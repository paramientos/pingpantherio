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
    List,
    Anchor
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
                            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Group gap="xs">
                                    <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>
                                        <IconBolt size={20} />
                                    </ThemeIcon>
                                    <Text fw={900} size="xl">PingPanther</Text>
                                </Group>
                            </Link>
                            <Group gap="lg">
                                <Button component={Link} href="/docs" variant="subtle" color="gray">Documentation</Button>
                                <Button component="a" href="https://github.com/paramientos/pingpantherio" target="_blank" variant="subtle" color="gray" leftSection={<IconBrandGithub size={18} />}>
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
                            <span style={{ color: 'var(--mantine-color-green-6)' }}>in 60 Seconds</span>
                        </Title>

                        <Text size="xl" c="dimmed" maw={700} ta="center" style={{ lineHeight: 1.7 }}>
                            Self-hosted uptime monitoring that alerts you before your customers notice.
                            Track websites, APIs, servers, SSL certificates, and cron jobs from a single dashboard.
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
                                href="/login"
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
                                href="https://github.com/paramientos/pingpantherio"
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
                    </Stack>
                </Container>

                {/* Installation Steps */}
                <Box id="installation" py={120} style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <Container size="lg">
                        <Stack align="center" mb={80}>
                            <Badge size="lg" color="orange">QUICK START</Badge>
                            <Title ta="center" style={{ fontSize: rem(48), letterSpacing: '-2px', fontWeight: 900, lineHeight: 1.2 }}>
                                Ready in 3 Simple Steps
                            </Title>
                        </Stack>

                        <SimpleGrid cols={{ base: 1, md: 3 }} spacing={60}>
                            {/* Step 1 */}
                            <Stack align="center" ta="center" gap="md">
                                <ThemeIcon size={80} radius="xl" color="orange" variant="light">
                                    <IconServer size={40} />
                                </ThemeIcon>
                                <Title order={3}>1. Prepare</Title>
                                <Text c="dimmed" size="sm" maw={300}>
                                    Get a fresh Ubuntu 24.04 server. Any VPS provider works.
                                    Minimum 2GB RAM.
                                </Text>
                            </Stack>

                            {/* Step 2 */}
                            <Stack align="center" ta="center" gap="md">
                                <ThemeIcon size={80} radius="xl" color="orange" variant="filled">
                                    <IconTerminal2 size={40} />
                                </ThemeIcon>
                                <Title order={3}>2. Install</Title>
                                <Text c="dimmed" size="sm" maw={300}>
                                    Run our magic command. It installs the entire stack and configures your domain.
                                </Text>
                                <Code
                                    p="xs"
                                    style={{
                                        background: '#0a0a0a',
                                        border: '1px solid rgba(255,119,0,0.3)',
                                        color: 'orange',
                                        fontSize: rem(10),
                                        borderRadius: '4px'
                                    }}
                                >
                                    {'bash <(curl -sSL ...)'}
                                </Code>
                                <Anchor component={Link} href="/docs" size="xs" c="orange" fw={600}>
                                    View Installation Docs
                                </Anchor>
                            </Stack>

                            {/* Step 3 */}
                            <Stack align="center" ta="center" gap="md">
                                <ThemeIcon size={80} radius="xl" color="green" variant="light">
                                    <IconRocket size={40} />
                                </ThemeIcon>
                                <Title order={3}>3. Monitor</Title>
                                <Text c="dimmed" size="sm" maw={300}>
                                    Login to your dashboard. Your admin account is ready.
                                    Start monitoring instantly.
                                </Text>
                                <Button
                                    component={Link}
                                    href="/login"
                                    variant="subtle"
                                    color="green"
                                    rightSection={<IconArrowRight size={16} />}
                                >
                                    Try Demo
                                </Button>
                            </Stack>
                        </SimpleGrid>
                    </Container>
                </Box>

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
                                <Text fw={700} size="xl" mb="sm">{feature.title}</Text>
                                <Text size="md" c="dimmed" style={{ lineHeight: 1.6 }} mb="md">{feature.desc}</Text>
                                <Stack gap={6}>
                                    {feature.features.map((item, idx) => (
                                        <Group key={idx} gap="xs">
                                            <IconCheck size={16} color="var(--mantine-color-green-6)" />
                                            <Text size="sm" c="dimmed">{item}</Text>
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
                                href="/docs"
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
                                <Text component="a" href="https://github.com/paramientos/pingpantherio" target="_blank" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>GitHub</Text>
                                <Text component={Link} href="/login" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>Demo</Text>
                            </Group>
                        </Group>
                    </Container>
                </Box >
            </Box >
        </>
    );
}
