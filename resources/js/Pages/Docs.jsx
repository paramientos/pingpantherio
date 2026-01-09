import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Title,
    Text,
    Group,
    Stack,
    Box,
    rem,
    Paper,
    NavLink,
    Code,
    Divider,
    ThemeIcon,
    Button,
    Badge
} from '@mantine/core';
import {
    IconBolt,
    IconBook,
    IconRocket,
    IconSettings,
    IconTerminal,
    IconBrandGithub,
    IconArrowLeft
} from '@tabler/icons-react';

export default function Docs() {
    const [activeSection, setActiveSection] = useState('installation');

    const sections = {
        installation: {
            title: 'Installation',
            icon: IconRocket,
            content: (
                <Stack gap="xl">
                    <div>
                        <Title order={2} mb="md">Quick Installation</Title>
                        <Text c="dimmed" mb="lg">
                            PingPanther can be installed on a fresh Ubuntu 24.04 LTS server with a single command.
                        </Text>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">Requirements</Title>
                        <Paper p="lg" bg="rgba(255,255,255,0.02)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            <Stack gap="sm">
                                <Text>• Ubuntu 24.04 LTS (fresh installation recommended)</Text>
                                <Text>• Minimum: 2GB RAM, 1 CPU core</Text>
                                <Text>• Recommended: 4GB RAM, 2 CPU cores</Text>
                                <Text>• Root access (sudo is not enough)</Text>
                                <Text>• A domain name pointing to your server (optional, for SSL)</Text>
                            </Stack>
                        </Paper>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">Installation Command</Title>
                        <Text c="dimmed" mb="md">
                            SSH into your server and run the following command:
                        </Text>
                        <Code block style={{ background: '#0a0a0a', padding: rem(20), fontSize: rem(14) }}>
                            {'bash <(curl -sSL https://raw.githubusercontent.com/paramientos/pingpantherio/main/install.sh)'}
                        </Code>
                        <Text size="sm" c="dimmed" mt="md">
                            The installer will interactively prompt you for:
                        </Text>
                        <Paper p="md" bg="rgba(255,119,0,0.05)" withBorder style={{ borderColor: 'rgba(255,119,0,0.2)', marginTop: rem(10) }}>
                            <Stack gap="xs">
                                <Text size="sm">• Domain name (or it will use your server IP)</Text>
                                <Text size="sm">• Admin email address</Text>
                                <Text size="sm">• Password will be auto-generated securely</Text>
                            </Stack>
                        </Paper>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">What Gets Installed</Title>
                        <Paper p="lg" bg="rgba(255,119,0,0.05)" withBorder style={{ borderColor: 'rgba(255,119,0,0.2)' }}>
                            <Stack gap="xs">
                                <Text fw={600}>The installer automatically sets up:</Text>
                                <Text>• PHP 8.4 with FPM and required extensions</Text>
                                <Text>• Nginx web server</Text>
                                <Text>• PostgreSQL database</Text>
                                <Text>• Redis for caching and queues</Text>
                                <Text>• Laravel Horizon for queue management</Text>
                                <Text>• Let's Encrypt SSL certificates (if domain provided)</Text>
                                <Text>• Systemd services for auto-restart</Text>
                                <Text>• Production optimizations (OPcache, route caching)</Text>
                            </Stack>
                        </Paper>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">First Login</Title>
                        <Text c="dimmed" mb="md">
                            After installation completes, access your dashboard at <Code>https://yourdomain.com</Code>
                        </Text>
                        <Paper p="lg" bg="rgba(34, 197, 94, 0.05)" withBorder style={{ borderColor: 'rgba(34, 197, 94,0.2)' }}>
                            <Text fw={600} mb="md">Your Credentials:</Text>
                            <Text size="sm" c="dimmed" mb="sm">
                                At the end of installation, the script will display your admin credentials.
                            </Text>
                            <Stack gap="sm">
                                <Text size="sm">• Email: The email you provided during installation</Text>
                                <Text size="sm">• Password: Auto-generated secure password (save it!)</Text>
                            </Stack>
                            <Text size="sm" c="orange" mt="md" fw={600}>
                                💡 Make sure to save these credentials immediately!
                            </Text>
                        </Paper>

                        <Paper p="lg" mt="lg" bg="rgba(34, 197, 94, 0.1)" withBorder style={{ borderColor: 'rgba(34, 197, 94,0.4)' }}>
                            <Text fw={700} size="lg" c="green" mb="md">Try Live Demo</Text>
                            <Text size="sm" c="dimmed" mb="md">
                                Want to try PingPanther before installing? Access our demo instance with pre-filled credentials.
                            </Text>
                            <Button
                                component={Link}
                                href="/login"
                                fullWidth
                                mt="md"
                                color="green"
                                size="md"
                            >
                                Access Demo Dashboard
                            </Button>
                        </Paper>
                    </div>
                </Stack>
            )
        },
        configuration: {
            title: 'Configuration',
            icon: IconSettings,
            content: (
                <Stack gap="xl">
                    <div>
                        <Title order={2} mb="md">Post-Installation Configuration</Title>
                        <Text c="dimmed" mb="lg">
                            After installation, you may want to configure additional settings for your production environment.
                        </Text>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">Email Settings</Title>
                        <Text c="dimmed" mb="md">
                            To receive email alerts, update your <Code>.env</Code> file located at <Code>/var/www/pingpanther/.env</Code>
                        </Text>
                        <Code block style={{ background: '#0a0a0a', padding: rem(20), fontSize: rem(13) }}>
                            {`MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="alerts@yourdomain.com"
MAIL_FROM_NAME="PingPanther Alerts"`}
                        </Code>
                        <Text size="sm" c="dimmed" mt="md">
                            After updating, clear the cache:
                        </Text>
                        <Code block style={{ background: '#0a0a0a', padding: rem(15), fontSize: rem(13), marginTop: rem(10) }}>
                            php artisan config:cache
                        </Code>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">Laravel Horizon</Title>
                        <Text c="dimmed" mb="md">
                            Horizon provides a dashboard for your Redis queues at <Code>/horizon</Code>
                        </Text>
                        <Paper p="lg" bg="rgba(255,255,255,0.02)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            <Text mb="md">To restart Horizon after code changes:</Text>
                            <Code block style={{ background: '#0a0a0a', padding: rem(15), fontSize: rem(13) }}>
                                sudo systemctl restart pingpanther-horizon
                            </Code>
                        </Paper>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">Updating PingPanther</Title>
                        <Text c="dimmed" mb="md">
                            To update to the latest version:
                        </Text>
                        <Code block style={{ background: '#0a0a0a', padding: rem(20), fontSize: rem(13) }}>
                            {`cd /var/www/pingpanther
git pull origin main
composer install --no-dev --optimize-autoloader
yarn install && yarn build
php artisan migrate --force
php artisan optimize
sudo systemctl restart pingpanther-horizon`}
                        </Code>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">Firewall Configuration</Title>
                        <Text c="dimmed" mb="md">
                            The installer configures UFW to allow HTTP and HTTPS. Check status:
                        </Text>
                        <Code block style={{ background: '#0a0a0a', padding: rem(15), fontSize: rem(13) }}>
                            sudo ufw status
                        </Code>
                    </div>
                </Stack>
            )
        },
        usage: {
            title: 'Usage Guide',
            icon: IconBook,
            content: (
                <Stack gap="xl">
                    <div>
                        <Title order={2} mb="md">Getting Started</Title>
                        <Text c="dimmed" mb="lg">
                            Learn how to create monitors, set up alerts, and manage your infrastructure monitoring.
                        </Text>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">Creating Your First Monitor</Title>
                        <Paper p="lg" bg="rgba(255,255,255,0.02)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            <Stack gap="sm">
                                <Text>1. Navigate to <strong>Monitors</strong> in the sidebar</Text>
                                <Text>2. Click <strong>Create Monitor</strong></Text>
                                <Text>3. Choose monitor type (HTTP, Ping, Port, etc.)</Text>
                                <Text>4. Enter your service URL or IP address</Text>
                                <Text>5. Set check interval (30s, 1m, 5m, etc.)</Text>
                                <Text>6. Click <strong>Save</strong></Text>
                            </Stack>
                        </Paper>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">Monitor Types</Title>
                        <Stack gap="md">
                            <Paper p="md" bg="rgba(255,255,255,0.01)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                <Text fw={700} mb="xs">HTTP/HTTPS</Text>
                                <Text size="sm" c="dimmed">Monitor websites and APIs. Checks for 2xx status codes.</Text>
                            </Paper>
                            <Paper p="md" bg="rgba(255,255,255,0.01)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                <Text fw={700} mb="xs">TCP Port</Text>
                                <Text size="sm" c="dimmed">Check if a specific port is open and accepting connections.</Text>
                            </Paper>
                            <Paper p="md" bg="rgba(255,255,255,0.01)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                <Text fw={700} mb="xs">Ping (ICMP)</Text>
                                <Text size="sm" c="dimmed">Simple ping check to verify server is reachable.</Text>
                            </Paper>
                            <Paper p="md" bg="rgba(255,255,255,0.01)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                <Text fw={700} mb="xs">Keyword Check</Text>
                                <Text size="sm" c="dimmed">Verify specific text appears on a webpage.</Text>
                            </Paper>
                            <Paper p="md" bg="rgba(255,255,255,0.01)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                <Text fw={700} mb="xs">Push/Heartbeat</Text>
                                <Text size="sm" c="dimmed">Monitor cron jobs and scheduled tasks.</Text>
                            </Paper>
                        </Stack>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">Setting Up Alerts</Title>
                        <Text c="dimmed" mb="md">
                            Configure how you want to be notified when incidents occur:
                        </Text>
                        <Stack gap="sm">
                            <Text>• Navigate to <strong>Settings → Notification Channels</strong></Text>
                            <Text>• Add Email, Slack, Discord, or Webhook channels</Text>
                            <Text>• Create <strong>Escalation Policies</strong> for multi-tier alerts</Text>
                            <Text>• Assign policies to your monitors</Text>
                        </Stack>
                    </div>

                    <div>
                        <Title order={3} size="h4" mb="md">Status Pages</Title>
                        <Text c="dimmed" mb="md">
                            Create public status pages for your customers:
                        </Text>
                        <Stack gap="sm">
                            <Text>• Go to <strong>Status Pages</strong></Text>
                            <Text>• Click <strong>Create Status Page</strong></Text>
                            <Text>• Select which monitors to display</Text>
                            <Text>• Customize branding and colors</Text>
                            <Text>• Share the public URL with your users</Text>
                        </Stack>
                    </div>
                </Stack>
            )
        },
        api: {
            title: 'API Reference',
            icon: IconTerminal,
            content: (
                <Stack gap="xl">
                    <div>
                        <Title order={2} mb="md">API Documentation</Title>
                        <Text c="dimmed" mb="lg">
                            PingPanther provides a RESTful API for programmatic access to all features.
                        </Text>
                    </div>

                    <Stack gap="xl">
                        <Box ta="center" py={60}>
                            <ThemeIcon size={80} radius="xl" variant="light" color="orange" mb="xl">
                                <IconTerminal size={40} />
                            </ThemeIcon>

                            <Title order={2} mb="md">Developer API</Title>
                            <Badge size="lg" variant="dot" color="orange" mb="xl">COMING SOON</Badge>

                            <Text c="dimmed" maw={500} mx="auto" size="lg">
                                We are working on a comprehensive REST API to allow you to manage monitors,
                                retrieve stats, and integrate PingPanther with your own tools programmatically.
                            </Text>

                            <Paper p="xl" mt={40} bg="rgba(255,255,255,0.02)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }} maw={600} mx="auto">
                                <Text fw={700} c="white" mb="md">Planned Endpoints</Text>
                                <Group justify="center" gap="sm">
                                    <Code>GET /api/monitors</Code>
                                    <Code>POST /api/monitors</Code>
                                    <Code>GET /api/incidents</Code>
                                    <Code>GET /api/stats</Code>
                                </Group>
                            </Paper>
                        </Box>
                    </Stack>
                </Stack>
            )
        }
    };

    return (
        <>
            <Head title="Documentation - PingPanther" />

            <Box bg="#050505" style={{ minHeight: '100vh', color: 'white' }}>
                {/* Header */}
                <Box style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100, background: '#050505' }}>
                    <Container size="xl" py="lg">
                        <Group justify="space-between">
                            <Group gap="xs">
                                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Group gap="xs">
                                        <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>
                                            <IconBolt size={20} />
                                        </ThemeIcon>
                                        <Text fw={900} size="xl">PingPanther</Text>
                                    </Group>
                                </Link>
                                <Text c="dimmed" size="sm">/ Documentation</Text>
                            </Group>
                            <Group gap="lg">
                                <Button component={Link} href="/" variant="subtle" color="gray" leftSection={<IconArrowLeft size={18} />}>
                                    Back to Home
                                </Button>
                                <Button component="a" href="https://github.com/paramientos/pingpantherio" target="_blank" variant="subtle" color="gray" leftSection={<IconBrandGithub size={18} />}>
                                    GitHub
                                </Button>
                            </Group>
                        </Group>
                    </Container>
                </Box>

                {/* Content */}
                <Container size="xl" py="xl">
                    <Group align="flex-start" gap="xl">
                        {/* Sidebar */}
                        <Box w={250} style={{ position: 'sticky', top: 100 }}>
                            <Stack gap="xs">
                                {Object.entries(sections).map(([key, section]) => (
                                    <NavLink
                                        key={key}
                                        label={section.title}
                                        leftSection={<section.icon size={20} />}
                                        active={activeSection === key}
                                        onClick={() => setActiveSection(key)}
                                        style={{
                                            borderRadius: 8,
                                            fontWeight: activeSection === key ? 700 : 500
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>

                        {/* Main Content */}
                        <Box style={{ flex: 1, maxWidth: 800 }}>
                            <Paper p="xl" bg="rgba(255,255,255,0.01)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                {sections[activeSection].content}
                            </Paper>
                        </Box>
                    </Group>
                </Container>
            </Box>
        </>
    );
}
