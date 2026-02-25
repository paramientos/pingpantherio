#!/bin/bash

cd "$(dirname "$0")"

echo "------------------------------------------------------------"
echo "🚀 Running Demo Protection Setup..."
echo "------------------------------------------------------------"


php artisan pp:create-admin admin@pingpanther.io password --with-demo 2>/dev/null || echo "ℹ️ Admin user admin@pingpanther.io already exists or command failed."

# This ensures that even if someone tries to delete or change password via UI/API, 
# the database level protection will block it.
php artisan tinker << 'EOF'
try {
    DB::unprepared("
        -- 1. Prevent Admin User Deletion
        CREATE OR REPLACE FUNCTION prevent_admin_delete()
        RETURNS TRIGGER AS \$\$
        BEGIN
            IF OLD.email = 'admin@pingpanther.io' THEN
                RAISE EXCEPTION 'Demo admin user cannot be deleted';
            END IF;
            RETURN OLD;
        END;
        \$\$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trg_prevent_admin_delete ON users;
        CREATE TRIGGER trg_prevent_admin_delete
        BEFORE DELETE ON users
        FOR EACH ROW EXECUTE FUNCTION prevent_admin_delete();

        -- 2. Prevent Admin Password or Email Change
        CREATE OR REPLACE FUNCTION prevent_admin_sensitive_update()
        RETURNS TRIGGER AS \$\$
        BEGIN
            IF OLD.email = 'admin@pingpanther.io' AND (NEW.password IS DISTINCT FROM OLD.password OR NEW.email IS DISTINCT FROM OLD.email) THEN
                RAISE EXCEPTION 'Demo admin credentials cannot be changed';
            END IF;
            RETURN NEW;
        END;
        \$\$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trg_prevent_admin_sensitive_update ON users;
        CREATE TRIGGER trg_prevent_admin_sensitive_update
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION prevent_admin_sensitive_update();

        -- 3. Prevent Deletion of Monitors
        CREATE OR REPLACE FUNCTION prevent_delete_in_demo()
        RETURNS TRIGGER AS \$\$
        BEGIN
            RAISE EXCEPTION 'Deletion is disabled in demo mode';
        END;
        \$\$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trg_prevent_monitors_delete ON monitors;
        CREATE TRIGGER trg_prevent_monitors_delete
        BEFORE DELETE ON monitors
        FOR EACH ROW EXECUTE FUNCTION prevent_delete_in_demo();

        -- 4. Prevent Deletion of Status Pages
        DROP TRIGGER IF EXISTS trg_prevent_status_pages_delete ON status_pages;
        CREATE TRIGGER trg_prevent_status_pages_delete
        BEFORE DELETE ON status_pages
        FOR EACH ROW EXECUTE FUNCTION prevent_delete_in_demo();
    ");
    echo "✅ Demo protection triggers applied successfully.\n";
} catch (\Exception $e) {
    echo "❌ Error applying triggers: " . $e->getMessage() . "\n";
}
EOF

echo "------------------------------------------------------------"
echo "✅ Demo Setup Complete!"
echo "------------------------------------------------------------"
