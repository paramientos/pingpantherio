#!/bin/bash

cd "$(dirname "$0")"

echo "------------------------------------------------------------"
echo "🎨 Injecting UI Demo Alert..."
echo "------------------------------------------------------------"

# UI Injection: Add the React Alert to AppLayout.jsx
# Note: This should be run BEFORE 'npm run build' in Forge
APP_LAYOUT="resources/js/Layouts/AppLayout.jsx"
if [ -f "$APP_LAYOUT" ]; then
    php -r '
    $path = "resources/js/Layouts/AppLayout.jsx";
    $content = file_get_contents($path);
    $alertCode = "                <Alert
                    variant=\"filled\"
                    color=\"yellow\"
                    title=\"Demo Mode Active\"
                    icon={<IconAlertTriangle />}
                    mb=\"lg\"
                    radius=\"md\"
                    styles={{
                        title: { fontWeight: 900, fontSize: \"1.1rem\" },
                        root: { border: \"none\" }
                    }}
                >
                    PingPanther is currently in demo mode. For security and auditing reasons; account registration, password changes, API key management, and data deletion are restricted at the database level.
                </Alert>";
    
    $newContent = str_replace("{/* DEMO_MODE_ALERT_PLACEHOLDER */}", $alertCode, $content);
    file_put_contents($path, $newContent);
    '
    echo "✅ UI Alert injected into AppLayout.jsx"
else
    echo "⚠️  AppLayout.jsx not found, skipping UI injection."
fi

echo "------------------------------------------------------------"
echo "🚀 Running Strict Demo Protection Setup..."
echo "------------------------------------------------------------"

# 1. Ensure the demo admin user exists before applying triggers
# This password 'password' is used as requested.
php artisan pp:create-admin admin@pingpanther.io password --with-demo 2>/dev/null || echo "ℹ️ Admin user admin@pingpanther.io checked."

# 2. Apply Strict PostgreSQL Triggers
php artisan tinker << 'EOF'
try {
    DB::unprepared("
        -- Function: Block everything (Insert, Update, Delete)
        CREATE OR REPLACE FUNCTION block_all_modifications()
        RETURNS TRIGGER AS \$\$
        BEGIN
            RAISE EXCEPTION 'This action is disabled in demo mode.';
        END;
        \$\$ LANGUAGE plpgsql;

        -- Function: Block only deletion
        CREATE OR REPLACE FUNCTION block_deletion()
        RETURNS TRIGGER AS \$\$
        BEGIN
            RAISE EXCEPTION 'Deletion is disabled in demo mode.';
        END;
        \$\$ LANGUAGE plpgsql;

        -- A. FULL LOCK: Users, API Keys, Webhooks
        -- Users: Prevent registration, profile updates, and deletion
        DROP TRIGGER IF EXISTS trg_users_lock ON users;
        CREATE TRIGGER trg_users_lock
        BEFORE INSERT OR UPDATE OR DELETE ON users
        FOR EACH ROW EXECUTE FUNCTION block_all_modifications();

        -- API Keys: Prevent creation, editing, and deletion
        DROP TRIGGER IF EXISTS trg_api_keys_lock ON api_keys;
        CREATE TRIGGER trg_api_keys_lock
        BEFORE INSERT OR UPDATE OR DELETE ON api_keys
        FOR EACH ROW EXECUTE FUNCTION block_all_modifications();

        -- Webhooks: Prevent creation, editing, and deletion
        DROP TRIGGER IF EXISTS trg_webhooks_lock ON webhooks;
        CREATE TRIGGER trg_webhooks_lock
        BEFORE INSERT OR UPDATE OR DELETE ON webhooks
        FOR EACH ROW EXECUTE FUNCTION block_all_modifications();

        -- B. DELETE LOCK: Monitors, Status Pages
        -- Monitors: Prevent deletion
        DROP TRIGGER IF EXISTS trg_monitors_delete_lock ON monitors;
        CREATE TRIGGER trg_monitors_delete_lock
        BEFORE DELETE ON monitors
        FOR EACH ROW EXECUTE FUNCTION block_deletion();

        -- Status Pages: Prevent deletion
        DROP TRIGGER IF EXISTS trg_status_pages_delete_lock ON status_pages;
        CREATE TRIGGER trg_status_pages_delete_lock
        BEFORE DELETE ON status_pages
        FOR EACH ROW EXECUTE FUNCTION block_deletion();
    ");
    echo "✅ Strict demo protection triggers applied successfully.\n";
} catch (\Exception $e) {
    echo "❌ Error applying triggers: " . $e->getMessage() . "\n";
}
EOF

echo "------------------------------------------------------------"
echo "✅ Strict Demo Setup Complete!"
echo "------------------------------------------------------------"
