import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Stack,
    SimpleGrid,
    ThemeIcon,
    Badge,
    Box,
    rem,
    Paper,
    Stepper,
    Code,
    List
} from '@mantine/core';
import {
    IconBolt,
    IconTerminal2,
    IconArrowRight,
    IconCheck,
    IconRocket,
    IconServer,
    IconShieldCheck,
    IconBrandGithub,
    IconDownload,
    IconClock,
    IconActivity,
    IconWorld
} from '@tabler/icons-react';

export default function Landing() {
    return (
        <>
            <Head title="PingPanther - Self-Hosted Uptime Monitoring" />

            <Box bg="#050505" style={{ minHeight: '100vh', color: 'white' }}>
                {/* Navbar */}
                <Box style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100, background: '#050505' }}>
                    <Container size="lg" py="lg">
                        <Group justify="space-between">
                            <Group gap="xs">
                                <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>
                                    <IconBolt size={20} />
                                </ThemeIcon>
                                <Text fw={900} size="xl">PingPanther</Text>
                            </Group>
                            <Group gap="lg">
                                <Button component={Link} href="/docs" variant="subtle" color="gray">Documentation</Button>
                                <Button component="a" href="https://github.com/pingpanther/pingpanther" target="_blank" variant="subtle" color="gray" leftSection={<IconBrandGithub size={18} />}>
                                    GitHub
                                </Button>
                                <Button component={Link} href="/login" color="orange">Try Demo</Button>
                            </Group>
                        </Group>
                    </Container>
                </Box>

                {/* Hero */}
                <Container size="lg" pt={80} pb={60}>
                    <Stack align="center" gap="xl">
                        <Badge size="lg" variant="dot" color="orange" style={{ background: 'rgba(255,119,0,0.1)', padding: '10px 20px' }}>
                            OPEN SOURCE • SELF-HOSTED
                        </Badge>

                        <Title ta="center" style={{ fontSize: rem(64), letterSpacing: '-2px', fontWeight: 900, maxWidth: 800, lineHeight: 1.1 }}>
                            Deploy Your Own <br />
                            <span style={{ color: 'var(--mantine-color-orange-6)' }}>Uptime Monitoring</span> <br />
                            <span style={{ color: 'var(--mantine-color-green-6)' }}>in 60 seconds</span>
                        </Title>

                        <Text size="xl" c="dimmed" maw={700} ta="center" style={{ lineHeight: 1.7 }}>
                            Like VitoDeploy, but for monitoring. One command installs everything:
                            PHP 8.4, Nginx, PostgreSQL, Redis, SSL certificates, and a beautiful dashboard.
                        </Text>

                        <Group gap="lg" mt="md">
                            <Button
                                size="xl"
                                h={60}
                                px={40}
                                color="orange"
                                rightSection={<IconRocket size={20} />}
                                style={{ fontSize: rem(18), fontWeight: 700 }}
                                component="a"
                                href="#installation"
                            >
                                Try Live Demo
                            </Button>
                            <Button
                                size="xl"
                                h={60}
                                px={40}
                                variant="outline"
                                color="gray"
                                leftSection={<IconBrandGithub size={20} />}
                                style={{ fontSize: rem(18) }}
                                component="a"
                                href="https://github.com/pingpanther/pingpanther"
                                target="_blank"
                            >
                                View Source
                            </Button>
                        </Group>

                        <Group gap="xl" mt="lg">
                            <Group gap="xs">
                                <IconCheck size={18} color="var(--mantine-color-green-6)" />
                                <Text size="sm" c="dimmed">No Docker Required</Text>
                            </Group>
                            <Group gap="xs">
                                <IconCheck size={18} color="var(--mantine-color-green-6)" />
                                <Text size="sm" c="dimmed">Free SSL Certificates</Text>
                            </Group>
                            <Group gap="xs">
                                <IconCheck size={18} color="var(--mantine-color-green-6)" />
                                <Text size="sm" c="dimmed">Production Ready</Text>
                            </Group>
                        </Group>

                        <Paper
                            p="lg"
                            mt="xl"
                            bg="rgba(34, 197, 94, 0.05)"
                            withBorder
                            style={{ borderColor: 'rgba(34, 197, 94, 0.3)', maxWidth: 500 }}
                        >
                            <Text fw={700} size="lg" c="green" mb="md">🎯 Try Live Demo</Text>
                            <Stack gap="sm">
                                <Group>
                                    <Text w={80} size="sm" c="dimmed">Email:</Text>
                                    <Code style={{ fontSize: rem(13) }}>admin@pingpanther.io</Code>
                                </Group>
                                <Group>
                                    <Text w={80} size="sm" c="dimmed">Password:</Text>
                                    <Code style={{ fontSize: rem(13) }}>password</Code>
                                </Group>
                            </Stack>
                            <Button
                                component={Link}
                                href="/login"
                                fullWidth
                                mt="md"
                                color="green"
                                rightSection={<IconArrowRight size={18} />}
                            >
                                Access Demo Dashboard
                            </Button>
                        </Paper>
                    </Stack>
                </Container >

                {/* Installation Steps */}
                < Box id="installation" py={80} style={{ background: 'rgba(255,255,255,0.01)' }
                }>
                    <Container size="md">
                        <Stack align="center" mb={60}>
                            <Badge size="lg" color="orange">INSTALLATION</Badge>
                            <Title ta="center" style={{ fontSize: rem(42), letterSpacing: '-1.5px', fontWeight: 900 }}>
                                Three Steps to Production
                            </Title>
                            <Text size="lg" c="dimmed" ta="center">
                                Seriously. That's all it takes.
                            </Text>
                        </Stack>

                        <Stepper active={3} orientation="vertical" size="lg" iconSize={50}>
                            <Stepper.Step
                                label="Prepare Your Server"
                                description="Fresh Ubuntu 24.04 LTS"
                                icon={<IconServer size={24} />}
                            >
                                <Paper p="xl" mt="md" bg="rgba(255,255,255,0.02)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                    <Text size="lg" fw={600} mb="md">Requirements:</Text>
                                    <List spacing="sm" c="dimmed">
                                        <List.Item>Ubuntu 24.04 LTS (fresh install recommended)</List.Item>
                                        <List.Item>Minimum: 2GB RAM, 1 CPU core</List.Item>
                                        <List.Item>Recommended: 4GB RAM, 2 CPU cores</List.Item>
                                        <List.Item>Root or sudo access</List.Item>
                                        <List.Item>A domain pointing to your server (optional, for SSL)</List.Item>
                                    </List>
                                    <Text size="sm" c="dimmed" mt="lg">
                                        💡 Works on any VPS: DigitalOcean, Hetzner, Linode, AWS EC2, etc.
                                    </Text>
                                </Paper>
                            </Stepper.Step>

                            <Stepper.Step
                                label="Run the Installer"
                                description="One command does everything"
                                icon={<IconTerminal2 size={24} />}
                            >
                                <Paper p="xl" mt="md" bg="#0a0a0a" withBorder style={{ borderColor: 'rgba(255,119,0,0.2)' }}>
                                    <Text size="sm" c="dimmed" mb="md" fw={600}>SSH into your server and run:</Text>
                                    <Code
                                        block
                                        style={{
                                            background: 'rgba(0,0,0,0.5)',
                                            padding: rem(20),
                                            fontSize: rem(15),
                                            fontFamily: 'var(--mantine-font-family-monospace)',
                                            color: 'var(--mantine-color-green-4)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        curl -sSL https://raw.githubusercontent.com/pingpanther/pingpanther/main/install.sh | sudo bash
                                    </Code>
                                    <Text size="sm" c="dimmed" mt="lg">
                                        The installer will interactively ask for:
                                    </Text>
                                    <List size="sm" c="dimmed" mt="xs" spacing="xs">
                                        <List.Item>Domain name (or use IP if you don't have one)</List.Item>
                                        <List.Item>Admin email address</List.Item>
                                        <List.Item>A secure password will be auto-generated</List.Item>
                                    </List>
                                    <Text size="sm" c="orange" mt="md" fw={600}>
                                        ⚡ The script will automatically:
                                    </Text>
                                    <List size="sm" c="dimmed" mt="xs" spacing="xs">
                                        <List.Item>Install PHP 8.4, Nginx, PostgreSQL, Redis</List.Item>
                                        <List.Item>Configure Laravel Horizon for queue management</List.Item>
                                        <List.Item>Set up Let's Encrypt SSL (if domain provided)</List.Item>
                                        <List.Item>Create systemd services for auto-restart</List.Item>
                                        <List.Item>Optimize for production (OPcache, Redis caching)</List.Item>
                                    </List>
                                </Paper>
                            </Stepper.Step>

                            <Stepper.Step
                                label="Access Your Dashboard"
                                description="Start monitoring immediately"
                                icon={<IconRocket size={24} />}
                            >
                                <Paper p="xl" mt="md" bg="rgba(34, 197, 94, 0.05)" withBorder style={{ borderColor: 'rgba(34, 197, 94, 0.2)' }}>
                                    <Text size="lg" fw={700} c="green" mb="md">✓ Installation Complete!</Text>
                                    <Text size="md" c="dimmed" mb="lg">
                                        Open your browser and navigate to your domain (or IP address).
                                        You'll see the login screen.
                                    </Text>
                                    <Box p="md" bg="rgba(0,0,0,0.3)" style={{ borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <Text size="sm" c="dimmed" mb="xs">Login credentials:</Text>
                                        <Text size="sm" c="green" fw={600}>
                                            You'll create your admin account during installation.
                                            The installer will ask for your email and generate a secure password.
                                        </Text>
                                    </Box>
                                    <Text size="sm" c="orange" mt="lg" fw={600}>
                                        💡 Your credentials will be displayed at the end of installation.
                                    </Text>
                                </Paper>
                            </Stepper.Step>
                        </Stepper>
                    </Container>
                </Box >

                {/* Features */}
                < Container size="lg" py={80} >
                    <Stack align="center" mb={60}>
                        <Badge size="lg" color="orange">FEATURES</Badge>
                        <Title ta="center" style={{ fontSize: rem(42), letterSpacing: '-1.5px', fontWeight: 900 }}>
                            Enterprise-Grade Monitoring
                        </Title>
                        <Text size="lg" c="dimmed" maw={600} ta="center">
                            Everything you need to keep your infrastructure running smoothly
                        </Text>
                    </Stack>

                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                        {[
                            {
                                icon: IconServer,
                                title: 'Multi-Protocol Monitoring',
                                desc: 'Monitor HTTP/HTTPS endpoints, TCP ports, ICMP ping, DNS records, and SSL certificates. Support for custom heartbeat URLs for cron job monitoring.',
                                features: ['HTTP/HTTPS checks', 'TCP port monitoring', 'Ping (ICMP)', 'DNS validation', 'SSL certificate tracking', 'Heartbeat/Push monitors']
                            },
                            {
                                icon: IconShieldCheck,
                                title: 'Smart Alert System',
                                desc: 'Multi-channel notifications with intelligent escalation policies. Never miss a critical incident again.',
                                features: ['Email notifications', 'Slack integration', 'Discord webhooks', 'Custom webhooks', 'Multi-tier escalation', 'Alert grouping']
                            },
                            {
                                icon: IconClock,
                                title: 'Public Status Pages',
                                desc: 'Beautiful, customizable status pages for your customers. Show real-time uptime and incident history.',
                                features: ['Custom branding', 'Custom domains', 'Incident timeline', 'Scheduled maintenance', 'Subscriber notifications', 'Embed widgets']
                            },
                            {
                                icon: IconBolt,
                                title: 'High Performance',
                                desc: 'Built on Laravel with Redis caching and Horizon queue management. Handles thousands of checks per minute.',
                                features: ['Redis caching', 'Laravel Horizon', 'OPcache optimization', 'Database indexing', 'Async processing', 'Sub-second checks']
                            },
                            {
                                icon: IconCheck,
                                title: 'Automated Recovery',
                                desc: 'Self-healing capabilities through webhook-based recovery actions. Automatically restart services or trigger remediation.',
                                features: ['Webhook triggers', 'Custom scripts', 'Auto-restart services', 'Retry logic', 'Recovery logs', 'Success tracking']
                            },
                            {
                                icon: IconRocket,
                                title: 'Production Ready',
                                desc: 'Battle-tested infrastructure with systemd services, automatic restarts, and comprehensive logging.',
                                features: ['Systemd integration', 'Auto-restart', 'Log rotation', 'Database backups', 'Health checks', 'Zero-downtime updates']
                            },
                            {
                                icon: IconTerminal2,
                                title: 'Developer-Friendly API',
                                desc: 'Full REST API for programmatic access. Integrate monitoring into your CI/CD pipeline.',
                                features: ['RESTful API', 'API tokens', 'Webhook events', 'CLI tools', 'SDKs available', 'OpenAPI docs']
                            },
                            {
                                icon: IconActivity,
                                title: 'Real-Time Analytics',
                                desc: 'Beautiful dashboards with response time charts, uptime percentages, and incident timelines.',
                                features: ['Response time graphs', 'Uptime statistics', 'Incident reports', 'Performance trends', 'SLA tracking', 'Custom dashboards']
                            },
                            {
                                icon: IconWorld,
                                title: 'Global Monitoring',
                                desc: 'Check your services from multiple geographic locations to ensure worldwide availability.',
                                features: ['Multi-region checks', 'Latency tracking', 'Geographic reports', 'CDN monitoring', 'DNS propagation', 'Global uptime']
                            }
                        ].map((feature, i) => (
                            <Paper
                                key={i}
                                p="xl"
                                withBorder
                                style={{
                                    background: 'rgba(255,255,255,0.01)',
                                    borderColor: 'rgba(255,255,255,0.05)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,119,0,0.3)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <ThemeIcon size={50} radius="md" color="orange" variant="light" mb="lg">
                                    <feature.icon size={26} />
                                </ThemeIcon>
                                <Text fw={700} size="lg" mb="sm">{feature.title}</Text>
                                <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }} mb="md">{feature.desc}</Text>
                                <Stack gap={6}>
                                    {feature.features.map((item, idx) => (
                                        <Group key={idx} gap="xs">
                                            <IconCheck size={14} color="var(--mantine-color-green-6)" />
                                            <Text size="xs" c="dimmed">{item}</Text>
                                        </Group>
                                    ))}
                                </Stack>
                            </Paper>
                        ))}
                    </SimpleGrid>
                </Container >

                {/* Why Self-Hosted */}
                < Box py={80} style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <Container size="md">
                        <Stack align="center" mb={60}>
                            <Badge size="lg" color="orange">WHY SELF-HOST?</Badge>
                            <Title ta="center" style={{ fontSize: rem(42), letterSpacing: '-1.5px', fontWeight: 900 }}>
                                Your Data, Your Control
                            </Title>
                        </Stack>

                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                            <Stack gap="lg">
                                <Group align="flex-start">
                                    <ThemeIcon size="lg" color="green" variant="light">
                                        <IconCheck size={20} />
                                    </ThemeIcon>
                                    <div>
                                        <Text fw={700} mb={4}>No Monthly Fees</Text>
                                        <Text size="sm" c="dimmed">Pay once for your VPS. No per-monitor pricing.</Text>
                                    </div>
                                </Group>
                                <Group align="flex-start">
                                    <ThemeIcon size="lg" color="green" variant="light">
                                        <IconCheck size={20} />
                                    </ThemeIcon>
                                    <div>
                                        <Text fw={700} mb={4}>Complete Privacy</Text>
                                        <Text size="sm" c="dimmed">Your monitoring data never leaves your server.</Text>
                                    </div>
                                </Group>
                                <Group align="flex-start">
                                    <ThemeIcon size="lg" color="green" variant="light">
                                        <IconCheck size={20} />
                                    </ThemeIcon>
                                    <div>
                                        <Text fw={700} mb={4}>Unlimited Monitors</Text>
                                        <Text size="sm" c="dimmed">Monitor as many services as your server can handle.</Text>
                                    </div>
                                </Group>
                            </Stack>
                            <Stack gap="lg">
                                <Group align="flex-start">
                                    <ThemeIcon size="lg" color="green" variant="light">
                                        <IconCheck size={20} />
                                    </ThemeIcon>
                                    <div>
                                        <Text fw={700} mb={4}>Customizable</Text>
                                        <Text size="sm" c="dimmed">Full source code access. Modify anything you want.</Text>
                                    </div>
                                </Group>
                                <Group align="flex-start">
                                    <ThemeIcon size="lg" color="green" variant="light">
                                        <IconCheck size={20} />
                                    </ThemeIcon>
                                    <div>
                                        <Text fw={700} mb={4}>No Vendor Lock-in</Text>
                                        <Text size="sm" c="dimmed">Export your data anytime. Switch providers freely.</Text>
                                    </div>
                                </Group>
                                <Group align="flex-start">
                                    <ThemeIcon size="lg" color="green" variant="light">
                                        <IconCheck size={20} />
                                    </ThemeIcon>
                                    <div>
                                        <Text fw={700} mb={4}>Enterprise Support</Text>
                                        <Text size="sm" c="dimmed">Community support on GitHub. Paid support available.</Text>
                                    </div>
                                </Group>
                            </Stack>
                        </SimpleGrid>
                    </Container>
                </Box >

                {/* CTA */}
                < Container size="md" py={100} >
                    <Paper
                        p={60}
                        radius="xl"
                        style={{
                            background: 'radial-gradient(ellipse at center, rgba(255, 119, 0, 0.15) 0%, rgba(0,0,0,0) 70%)',
                            border: '2px solid rgba(255,119,0,0.3)',
                            textAlign: 'center'
                        }}
                    >
                        <Stack align="center" gap="xl">
                            <IconDownload size={60} color="var(--mantine-color-orange-6)" />
                            <Title style={{ fontSize: rem(36), letterSpacing: '-1px', fontWeight: 900 }}>
                                Ready to Deploy?
                            </Title>
                            <Text size="lg" c="dimmed" maw={500}>
                                Join hundreds of teams who trust PingPanther to monitor their infrastructure.
                            </Text>
                            <Button
                                size="xl"
                                h={70}
                                px={50}
                                color="orange"
                                rightSection={<IconArrowRight size={24} />}
                                style={{ fontSize: rem(20), fontWeight: 700 }}
                                component="a"
                                href="#installation"
                            >
                                Install Now
                            </Button>
                            <Text size="sm" c="dimmed">
                                Takes less than 2 minutes • Free forever • Open source
                            </Text>
                        </Stack>
                    </Paper>
                </Container >

                {/* Footer */}
                < Box py={40} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Container size="lg">
                        <Group justify="space-between">
                            <Text c="dimmed" size="sm">© 2026 PingPanther. Open Source.</Text>
                            <Group gap="xl">
                                <Text component={Link} href="/docs" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>Documentation</Text>
                                <Text component="a" href="https://github.com/pingpanther/pingpanther" target="_blank" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>GitHub</Text>
                                <Text component={Link} href="/login" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>Demo</Text>
                            </Group>
                        </Group>
                    </Container>
                </Box >
            </Box >
        </>
    );
}
