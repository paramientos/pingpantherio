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
    Card,
    ThemeIcon,
    Badge,
    Box,
    rem,
    Paper,
    RingProgress,
    Center,
    Grid,
    ActionIcon
} from '@mantine/core';
import {
    IconBolt,
    IconShieldCheck,
    IconChartBar,
    IconActivity,
    IconTerminal2,
    IconWorld,
    IconArrowRight,
    IconCode,
    IconServer,
    IconCpu,
    IconCheck,
    IconCertificate,
    IconSitemap,
    IconCalendarTime,
    IconUsers,
    IconFileDescription,
    IconTools,
    IconBrandSlack,
    IconBrandDiscord,
    IconMail,
    IconDeviceMobile,
    IconCopy,
    IconBrandUbuntu,
    IconLock,
    IconRocket
} from '@tabler/icons-react';

export default function Landing() {
    return (
        <>
            <Head title="PingPanther - Infrastructure Monitoring" />

            <Box
                style={{
                    minHeight: '100vh',
                    backgroundColor: '#050505',
                    color: 'white',
                    position: 'relative',
                    overflowX: 'hidden',
                }}
            >
                {/* Tech Grid Background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `
                        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                    zIndex: 0,
                    pointerEvents: 'none',
                }} />

                {/* Navbar Placeholder */}
                <Container size="xl" py="md" style={{ position: 'relative', zIndex: 10 }}>
                    <Group justify="space-between">
                        <Group gap="xs">
                            <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>
                                <IconActivity size={20} />
                            </ThemeIcon>
                            <Text fw={900} size="xl" style={{ letterSpacing: '-1px' }}>PingPanther</Text>
                        </Group>
                        <Group>
                            <Button component={Link} href="/login" color="white" c="black" fw={600}>Log in</Button>
                        </Group>
                    </Group>
                </Container>

                {/* Hero Section */}
                <Container size="lg" pt={80} pb={120} style={{ position: 'relative', zIndex: 10 }}>
                    <Stack align="center" gap="xl">
                        <Badge
                            variant="outline"
                            color="orange"
                            size="lg"
                            radius="xl"
                            tt="none"
                            bg="rgba(255,119,0,0.1)"
                            style={{ borderColor: 'rgba(255,119,0,0.3)', color: '#ff922b' }}
                        >
                            <Group gap={8}>
                                <IconActivity size={16} />
                                <span>Uptime Monitoring, Status Pages & Incident Response</span>
                            </Group>
                        </Badge>

                        <div style={{ textAlign: 'center', maxWidth: 900 }}>
                            <Title
                                order={1}
                                style={{
                                    fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                                    fontWeight: 900,
                                    lineHeight: 0.9,
                                    letterSpacing: '-5px',
                                    marginBottom: rem(32),
                                    textTransform: 'uppercase',
                                    background: 'linear-gradient(180deg, #ffffff 0%, #666666 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.1))'
                                }}
                            >
                                Fix It Before <br />
                                <span style={{ color: 'var(--mantine-color-orange-6)', WebkitTextFillColor: 'var(--mantine-color-orange-6)' }}>Twitter Does.</span>
                            </Title>
                            <Text size="xl" c="dimmed" maw={700} mx="auto" mb="xl" fw={600} style={{ lineHeight: 1.4, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
                                Advanced infrastructure telemetry for high-stakes environments.
                                Detect anomalies in milliseconds, not minutes.
                            </Text>

                            {/* Core Features Quick List */}
                            <Group gap="xl" justify="center" style={{ opacity: 0.9 }}>
                                <Group gap={6}>
                                    <IconCheck size={18} color="#22c55e" />
                                    <Text size="sm" c="gray.3" fw={500}>Check every 30 seconds</Text>
                                </Group>
                                <Group gap={6}>
                                    <IconCheck size={18} color="#22c55e" />
                                    <Text size="sm" c="gray.3" fw={500}>SSL Expiration Alerts</Text>
                                </Group>
                                <Group gap={6}>
                                    <IconCheck size={18} color="#22c55e" />
                                    <Text size="sm" c="gray.3" fw={500}>Hosted Status Pages</Text>
                                </Group>
                                <Group gap={6} visibleFrom="sm">
                                    <IconCheck size={18} color="#22c55e" />
                                    <Text size="sm" c="gray.3" fw={500}>Cron Job Monitoring</Text>
                                </Group>
                            </Group>
                        </div>

                        <Group mt="xl">
                            <Button
                                component={Link}
                                href="/login"
                                size="xl"
                                color="orange"
                                radius="md"
                                rightSection={<IconArrowRight size={18} />}
                                style={{
                                    boxShadow: '0 0 20px rgba(247, 103, 7, 0.4)',
                                }}
                            >
                                Get Started
                            </Button>
                            <Button
                                component={Link}
                                href="/console"
                                size="xl"
                                variant="default"
                                radius="md"
                                bg="transparent"
                                c="white"
                                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                leftSection={<IconTerminal2 size={18} />}
                            >
                                Live Demo
                            </Button>
                        </Group>

                        {/* Abstract Interface Preview */}
                        <Box
                            mt={60}
                            style={{
                                width: '100%',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.02)',
                                backdropFilter: 'blur(10px)',
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                            }}
                        >
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 20px' }}>
                                <Group gap={8}>
                                    {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => (
                                        <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
                                    ))}
                                    <div style={{
                                        marginLeft: 20,
                                        background: 'rgba(0,0,0,0.3)',
                                        padding: '4px 12px',
                                        borderRadius: 4,
                                        fontSize: 12,
                                        color: '#666',
                                        fontFamily: 'monospace'
                                    }}>
                                        pingpanther.io/dashboard/main
                                    </div>
                                </Group>
                            </div>
                            <SimpleGrid cols={{ base: 1, md: 3 }} spacing={0}>
                                <Box p="xl" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Group mb="xs">
                                        <IconServer size={20} color="gray" />
                                        <Text size="sm" c="dimmed">System Status</Text>
                                    </Group>
                                    <Text size="2.5rem" fw={900} c="green.4" style={{ fontFamily: 'var(--mantine-font-family-monospace)' }}>99.99%</Text>
                                    <Text size="xs" c="dimmed" mt={4}>All systems operational</Text>

                                    <Stack mt="xl" gap="xs">
                                        <Group justify="space-between">
                                            <Text size="xs" c="dimmed">API Gateway</Text>
                                            <Badge size="xs" color="green" variant="dot" bg="transparent">UP</Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text size="xs" c="dimmed">Database</Text>
                                            <Badge size="xs" color="green" variant="dot" bg="transparent">UP</Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text size="xs" c="dimmed">Worker Nodes</Text>
                                            <Badge size="xs" color="green" variant="dot" bg="transparent">UP</Badge>
                                        </Group>
                                    </Stack>
                                </Box>
                                <Box p="xl" style={{ borderRight: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                                    <Group mb="xs">
                                        <IconActivity size={20} color="gray" />
                                        <Text size="sm" c="dimmed">Response Time</Text>
                                    </Group>
                                    <Text size="2.5rem" fw={900} c="white" style={{ fontFamily: 'var(--mantine-font-family-monospace)' }}>45<span style={{ fontSize: '1rem', color: '#666' }}>ms</span></Text>

                                    {/* Mock Chart */}
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100, marginTop: 20 }}>
                                        {[40, 60, 45, 30, 70, 50, 45, 60, 80, 50, 40, 30, 50, 65, 45].map((h, i) => (
                                            <div key={i} style={{
                                                flex: 1,
                                                background: i === 14 ? 'var(--mantine-color-orange-5)' : 'rgba(255,255,255,0.1)',
                                                height: `${h}%`,
                                                borderRadius: 2
                                            }} />
                                        ))}
                                    </div>
                                </Box>
                                <Box p="xl">
                                    <Group mb="xs">
                                        <IconCpu size={20} color="gray" />
                                        <Text size="sm" c="dimmed">Active Monitors</Text>
                                    </Group>

                                    <Center py="md">
                                        <RingProgress
                                            size={120}
                                            thickness={8}
                                            roundCaps
                                            sections={[{ value: 85, color: 'orange' }]}
                                            label={
                                                <Text c="white" fw={900} ta="center" size="xl" style={{ fontFamily: 'var(--mantine-font-family-monospace)' }}>
                                                    1,240
                                                </Text>
                                            }
                                        />
                                    </Center>
                                </Box>
                            </SimpleGrid>
                        </Box>
                    </Stack>
                </Container>

                {/* Bento Grid Features */}
                <Container size="lg" py={80} style={{ position: 'relative', zIndex: 10 }}>
                    <Stack align="center" mb={60}>
                        <Title order={2} style={{ fontSize: '3rem', letterSpacing: '-1px' }}>
                            Everything enclosed.
                        </Title>
                        <Text c="dimmed" size="xl" ta="center" maw={600}>
                            From simple uptime checks to complex incident management pipelines. We've got you covered.
                        </Text>
                    </Stack>

                    <SimpleGrid
                        cols={{ base: 1, md: 6 }}
                        spacing="md"
                        verticalSpacing="md"
                        style={{
                            gridAutoRows: 'minmax(280px, auto)'
                        }}
                    >
                        {/* Status Pages (Large 4/6) */}
                        <Paper
                            radius="lg"
                            p={0}
                            style={{
                                gridColumn: 'span 4', // 4 col
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box p="xl">
                                <Group mb="sm">
                                    <ThemeIcon size="lg" radius="md" color="green" variant="light">
                                        <IconWorld size={20} />
                                    </ThemeIcon>
                                    <Text fw={700} size="lg">Public Status Pages</Text>
                                </Group>
                                <Text c="dimmed" maw={500}>
                                    Build trust with your customers. Communicate downtime and maintenance with beautiful, hosted status pages. Custom domain support included.
                                </Text>
                            </Box>

                            {/* Browser Mockup */}
                            <Box
                                flex={1}
                                mt="md"
                                style={{
                                    background: '#0a0a0a',
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    borderRight: '1px solid rgba(255,255,255,0.1)',
                                    borderTopRightRadius: 16,
                                    marginRight: 20
                                }}
                            >
                                <Box p="sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 6 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }} />
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }} />
                                </Box>
                                <Stack p="xl" gap="xl">
                                    <Group justify="space-between">
                                        <Group>
                                            <div style={{ width: 32, height: 32, borderRadius: 6, background: 'orange' }} />
                                            <Stack gap={0}>
                                                <div style={{ width: 120, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }} />
                                                <div style={{ width: 80, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.1)', marginTop: 6 }} />
                                            </Stack>
                                        </Group>
                                        <Badge color="green" variant="light">All Systems Operational</Badge>
                                    </Group>

                                    {[1, 2, 3].map(i => (
                                        <Group key={i} justify="space-between">
                                            <div style={{ width: 100, height: 10, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }} />
                                            <Group gap={2}>
                                                {[...Array(15)].map((_, j) => (
                                                    <div key={j} style={{ width: 4, height: 20, borderRadius: 2, background: '#22c55e', opacity: 0.5 + Math.random() * 0.5 }} />
                                                ))}
                                            </Group>
                                        </Group>
                                    ))}
                                </Stack>
                            </Box>
                        </Paper>

                        {/* SSL Monitoring (Small 2/6) */}
                        <Paper
                            radius="lg"
                            p="xl"
                            style={{
                                gridColumn: 'span 2',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <ThemeIcon size="lg" radius="md" color="blue" variant="light" mb="md">
                                    <IconCertificate size={20} />
                                </ThemeIcon>
                                <Text fw={700} size="lg" mb="xs">SSL Monitoring</Text>
                                <Text size="sm" c="dimmed">
                                    Never let a certificate expire again. We'll notify you 30, 14, and 7 days before expiration.
                                </Text>
                            </div>

                            <Card mt="xl" bg="rgba(0,0,0,0.3)" withBorder style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                                <Group justify="space-between">
                                    <Group gap="xs">
                                        <IconCertificate size={16} color="orange" />
                                        <Text size="xs" fw={700}>pingpanther.io</Text>
                                    </Group>
                                    <Text size="xs" c="orange">Expires in 12 days</Text>
                                </Group>
                            </Card>
                        </Paper>

                        {/* Incident Management (Medium 3/6) */}
                        <Paper
                            radius="lg"
                            p="xl"
                            style={{
                                gridColumn: 'span 3',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <ThemeIcon size="lg" radius="md" color="red" variant="light" mb="md">
                                <IconSitemap size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb="xs">Escalation Policies</Text>
                            <Text size="sm" c="dimmed" mb="xl">
                                Ensure the right person is notified. If the primary on-call engineer doesn't ack, escalate to the next level.
                            </Text>

                            <Group align="center" justify="center" gap="xs" style={{ opacity: 0.8 }}>
                                <Badge color="gray" variant="dot">Notify On-Call</Badge>
                                <IconArrowRight size={16} color="gray" />
                                <Badge color="orange" variant="dot">Wait 5m</Badge>
                                <IconArrowRight size={16} color="gray" />
                                <Badge color="red" variant="dot">Notify Team Lead</Badge>
                            </Group>
                        </Paper>

                        {/* Cron Jobs (Medium 3/6) */}
                        <Paper
                            radius="lg"
                            p="xl"
                            style={{
                                gridColumn: 'span 3',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <ThemeIcon size="lg" radius="md" color="violet" variant="light" mb="md">
                                <IconCalendarTime size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb="xs">Cron & Heartbeat Monitoring</Text>
                            <Text size="sm" c="dimmed" mb="xl">
                                Monitor your background jobs, backups, and scheduled tasks. We alert you when they *don't* run.
                            </Text>

                            <Stack gap="xs">
                                <Group justify="space-between" p="xs" bg="rgba(255,255,255,0.03)" style={{ borderRadius: 6 }}>
                                    <Group gap="xs">
                                        <ThemeIcon size="xs" color="green" variant="transparent"><IconCheck size={12} /></ThemeIcon>
                                        <Text size="xs">Database Backup</Text>
                                    </Group>
                                    <Text size="xs" c="dimmed">Just now</Text>
                                </Group>
                                <Group justify="space-between" p="xs" bg="rgba(255,90,90,0.1)" style={{ borderRadius: 6 }}>
                                    <Group gap="xs">
                                        <ThemeIcon size="xs" color="red" variant="transparent"><IconArrowRight size={12} /></ThemeIcon>
                                        <Text size="xs" c="red.3">Invoice Generator</Text>
                                    </Group>
                                    <Text size="xs" c="red.3">Missed schedule</Text>
                                </Group>
                            </Stack>
                        </Paper>

                        {/* Monitor Types (Span 3) */}
                        <Paper
                            radius="lg"
                            p="xl"
                            style={{
                                gridColumn: 'span 3',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <ThemeIcon size="lg" radius="md" color="cyan" variant="light" mb="md">
                                <IconServer size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb="xs">Monitor Everything</Text>
                            <Text size="sm" c="dimmed" mb="xl">
                                Support for all major protocols. If it's on the internet, we can monitor it.
                            </Text>

                            <Group gap="sm">
                                {['HTTP/HTTPS', 'TCP Port', 'Ping (ICMP)', 'DNS Records', 'Keyword Check', 'UDP'].map((item) => (
                                    <Badge key={item} variant="outline" color="gray" style={{ textTransform: 'none', borderColor: 'rgba(255,255,255,0.1)' }}>
                                        {item}
                                    </Badge>
                                ))}
                            </Group>
                        </Paper>

                        {/* Integrations (Span 3) */}
                        <Paper
                            radius="lg"
                            p="xl"
                            style={{
                                gridColumn: 'span 3',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <ThemeIcon size="lg" radius="md" color="grape" variant="light" mb="md">
                                <IconBrandSlack size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb="xs">Integrations & Alerts</Text>
                            <Text size="sm" c="dimmed" mb="xl">
                                Get notified where you work. Native integrations with your favorite tools.
                            </Text>

                            <Group gap="xl" style={{ opacity: 0.7 }}>
                                <Group gap={6}>
                                    <IconBrandSlack size={24} />
                                    <Text size="sm">Slack</Text>
                                </Group>
                                <Group gap={6}>
                                    <IconBrandDiscord size={24} />
                                    <Text size="sm">Discord</Text>
                                </Group>
                                <Group gap={6}>
                                    <IconMail size={24} />
                                    <Text size="sm">Email</Text>
                                </Group>
                                <Group gap={6}>
                                    <IconDeviceMobile size={24} />
                                    <Text size="sm">SMS</Text>
                                </Group>
                                <Group gap={6}>
                                    <IconCode size={24} />
                                    <Text size="sm">Webhook</Text>
                                </Group>
                            </Group>
                        </Paper>

                        {/* Team Management (Span 2) */}
                        <Paper
                            radius="lg"
                            p="xl"
                            style={{
                                gridColumn: 'span 2',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <ThemeIcon size="lg" radius="md" color="pink" variant="light" mb="md">
                                <IconUsers size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb="xs">Team Collaboration</Text>
                            <Text size="sm" c="dimmed">
                                Invite your entire team. Role-based access control (RBAC) included.
                            </Text>
                        </Paper>

                        {/* Maintenance Windows (Span 2) */}
                        <Paper
                            radius="lg"
                            p="xl"
                            style={{
                                gridColumn: 'span 2',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <ThemeIcon size="lg" radius="md" color="yellow" variant="light" mb="md">
                                <IconTools size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb="xs">Maintenance Windows</Text>
                            <Text size="sm" c="dimmed">
                                Pause alerts during scheduled maintenance periods to avoid false positives.
                            </Text>
                        </Paper>

                        {/* Reporting (Span 2) */}
                        <Paper
                            radius="lg"
                            p="xl"
                            style={{
                                gridColumn: 'span 2',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <ThemeIcon size="lg" radius="md" color="teal" variant="light" mb="md">
                                <IconFileDescription size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb="xs">Detailed Reporting</Text>
                            <Text size="sm" c="dimmed">
                                Weekly email reports and PDF exports for your stakeholders.
                            </Text>
                        </Paper>

                    </SimpleGrid>
                </Container>

                {/* Installation / Self-Hosting Section */}
                <Container size="lg" py={120} style={{ position: 'relative', zIndex: 10 }}>
                    <Grid gutter={80} align="center">
                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <Badge variant="dot" color="orange" mb="md" size="lg">SELF-HOSTED DEPLOYMENT</Badge>
                            <Title order={2} style={{ fontSize: rem(48), letterSpacing: '-2px', lineHeight: 1.1, marginBottom: rem(24) }}>
                                Your Infrastructure, <br />
                                <span style={{ color: 'var(--mantine-color-orange-6)' }}>Your Rules.</span>
                            </Title>
                            <Text size="lg" c="dimmed" mb="xl" style={{ lineHeight: 1.6 }}>
                                Skip the SaaS overhead. Deploy PingPanther directly on your Ubuntu 24.04 servers with our optimized unattended installer.
                                Full control, maximum privacy, zero latency.
                            </Text>

                            <Stack gap="lg">
                                {[
                                    { icon: IconBrandUbuntu, title: 'Ubuntu 24.04 Optimized', desc: 'Native support for PHP 8.4, Nginx, and Postgres on the latest LTS.' },
                                    { icon: IconLock, title: 'Zero-Config SSL', desc: 'Automatic Let\'s Encrypt certificate provisioning out of the box.' },
                                    { icon: IconBolt, title: 'Extreme Performance', desc: 'Auto-configured Redis caching, Horizon queues, and opcache.' },
                                ].map((item, i) => (
                                    <Group key={i} align="flex-start" gap="md">
                                        <ThemeIcon size="xl" radius="md" variant="light" color="orange">
                                            <item.icon size={24} />
                                        </ThemeIcon>
                                        <div>
                                            <Text fw={700} size="md" tt="uppercase" style={{ letterSpacing: '0.5px' }}>{item.title}</Text>
                                            <Text size="sm" c="dimmed">{item.desc}</Text>
                                        </div>
                                    </Group>
                                ))}
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <Box
                                style={{
                                    background: '#0a0a0a',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Terminal Header */}
                                <Group justify="space-between" px="md" py="xs" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Group gap={8}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                                    </Group>
                                    <Text size="xs" c="dimmed" fw={700} style={{ fontFamily: 'var(--mantine-font-family-monospace)' }}>deploy_pingpanther.sh</Text>
                                    <ActionIcon variant="transparent" color="gray" size="sm">
                                        <IconCopy size={14} />
                                    </ActionIcon>
                                </Group>

                                {/* Terminal Content */}
                                <Box p="xl" style={{ fontFamily: 'var(--mantine-font-family-monospace)', fontSize: '13px', lineHeight: 1.6 }}>
                                    <Group gap="xs" mb="xs">
                                        <Text c="green.5" fw={900}>➜</Text>
                                        <Text c="cyan.4">~</Text>
                                        <Text c="white">curl -sSL install.sh | sudo bash</Text>
                                    </Group>
                                    <Text c="gray.6" mb="xs">[1/12] Updating system packages...</Text>
                                    <Text c="gray.6" mb="xs">[2/12] Adding PHP 8.4 and Node.js repositories...</Text>
                                    <Text c="gray.6" mb="xs">[3/12] Installing core infrastructure...</Text>
                                    <Group gap="xs" mb="xs">
                                        <Text c="green.4" fw={700}>✓</Text>
                                        <Text c="gray.6">PostgreSQL Database Initialized</Text>
                                    </Group>
                                    <Group gap="xs" mb="xs">
                                        <Text c="green.4" fw={700}>✓</Text>
                                        <Text c="gray.6">Redis Cache Layer Enabled</Text>
                                    </Group>
                                    <Text c="gray.6" mb="xs">[11/12] Configuring Nginx & SSL...</Text>
                                    <Text c="orange.5" fw={800} mt="lg">Detected domain: monitors.acme.com</Text>
                                    <Text c="white" mb="md">Installing Let's Encrypt SSL... Done.</Text>
                                    <Box py="sm" px="md" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                        <Text c="green.4" fw={900}>INSTALLATION COMPLETE</Text>
                                        <Text c="gray.5" size="xs">Access: https://monitors.acme.com</Text>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Container>

                {/* Trusted By Section */}
                <Container size="lg" py={60} style={{ position: 'relative', zIndex: 10 }}>
                    <Text ta="center" size="sm" c="dimmed" mb="xl" fw={500} style={{ letterSpacing: '2px' }}>
                        TRUSTED BY ENGINEERING TEAMS AT
                    </Text>
                    <Group justify="center" gap={60} style={{ opacity: 0.5, filter: 'grayscale(100%)' }}>
                        {['Acme Corp', 'Linear', 'Vercel', 'Stripe', 'Supabase'].map((company) => (
                            <Text key={company} fw={900} size="xl" c="dimmed" style={{ letterSpacing: '-1px' }}>
                                {company}
                            </Text>
                        ))}
                    </Group>
                </Container>

                {/* Pricing Section */}
                <Container size="lg" py={120} style={{ position: 'relative', zIndex: 10 }}>
                    <Stack align="center" mb={80}>
                        <Title order={2} style={{ fontSize: '3rem', letterSpacing: '-1px' }}>
                            Simple, transparent pricing.
                        </Title>
                        <Text c="dimmed" size="xl" maw={600} ta="center">
                            Start for free, upgrade as you grow. No hidden fees.
                        </Text>
                    </Stack>

                    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                        {[
                            {
                                name: 'Hobby',
                                price: '$0',
                                description: 'Perfect for side projects.',
                                features: ['5 Monitors', '3 Minute Interval', 'Email Alerts', '1 Status Page'],
                                color: 'gray'
                            },
                            {
                                name: 'Pro',
                                price: '$29',
                                description: 'For growing startups.',
                                features: ['50 Monitors', '30 Second Interval', 'SMS & Voice Alerts', 'Unlimited Status Pages', 'SSL Monitoring'],
                                color: 'orange',
                                popular: true
                            },
                            {
                                name: 'Business',
                                price: '$99',
                                description: 'For large scale deployments.',
                                features: ['200 Monitors', '10 Second Interval', 'Prioritized Support', 'SSO & SAML', 'Custom Contracts'],
                                color: 'blue'
                            }
                        ].map((plan) => (
                            <Paper
                                key={plan.name}
                                radius="lg"
                                p="xl"
                                style={{
                                    background: plan.popular ? 'rgba(255,119,0,0.03)' : 'rgba(255,255,255,0.02)',
                                    border: plan.popular ? '1px solid rgba(255,119,0,0.3)' : '1px solid rgba(255,255,255,0.05)',
                                    position: 'relative'
                                }}
                            >
                                {plan.popular && (
                                    <Badge
                                        variant="filled"
                                        color="orange"
                                        style={{ position: 'absolute', top: -12, right: 24 }}
                                    >
                                        MOST POPULAR
                                    </Badge>
                                )}
                                <Text fw={700} size="lg" c={plan.color === 'gray' ? 'dimmed' : plan.color}>{plan.name}</Text>
                                <Group align="flex-end" gap={4} my="md">
                                    <Text size="3rem" fw={800} style={{ lineHeight: 1 }}>{plan.price}</Text>
                                    <Text c="dimmed" mb={8}>/mo</Text>
                                </Group>
                                <Text c="dimmed" size="sm" mb="xl" style={{ minHeight: 40 }}>
                                    {plan.description}
                                </Text>

                                <Stack gap="sm" mb="xl" style={{ minHeight: 180 }}>
                                    {plan.features.map(f => (
                                        <Group key={f} gap="sm" align="flex-start">
                                            <ThemeIcon size={20} radius="xl" color={plan.color} variant="light">
                                                <IconCheck size={12} />
                                            </ThemeIcon>
                                            <Text size="sm">{f}</Text>
                                        </Group>
                                    ))}
                                </Stack>

                                <Button
                                    fullWidth
                                    size="md"
                                    color={plan.color}
                                    variant={plan.popular ? 'filled' : 'light'}
                                    component={Link}
                                    href="/login"
                                >
                                    Get Started
                                </Button>
                            </Paper>
                        ))}
                    </SimpleGrid>
                </Container>

                {/* FAQ Section */}
                <Container size="sm" py={80} style={{ position: 'relative', zIndex: 10 }}>
                    <Title order={2} ta="center" mb={60} style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>
                        Frequently Asked Questions
                    </Title>

                    <Stack gap="xl">
                        {[
                            { q: 'How does the monitoring work?', a: 'We have a distributed network of servers around the globe. We check your service from these locations at your specified interval.' },
                            { q: 'Can I use a custom domain for status pages?', a: 'Yes! On Pro and Business plans, you can map your own domain (e.g., status.yourcompany.com) to your status page.' },
                            { q: 'What happens if my payment fails?', a: 'We will retry the payment 3 times over 5 days. You will not lose any data, but your monitors may be paused.' },
                            { q: 'Do you offer an SLA?', a: 'Yes, we offer a 99.9% uptime SLA for Business customers.' }
                        ].map((item, i) => (
                            <Box key={i} py="md" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <Text fw={700} size="lg" mb="xs">{item.q}</Text>
                                <Text c="dimmed" style={{ lineHeight: 1.6 }}>{item.a}</Text>
                            </Box>
                        ))}
                    </Stack>
                </Container>

                {/* Final CTA */}
                <Container size="lg" py={120} style={{ position: 'relative', zIndex: 10 }}>
                    <Box
                        style={{
                            borderRadius: 32,
                            background: 'radial-gradient(ellipse at center, rgba(255, 119, 0, 0.15) 0%, rgba(0,0,0,0) 70%)',
                            border: '1px solid rgba(255,119,0,0.2)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            padding: '100px 40px',
                            boxShadow: '0 0 80px -20px rgba(255,119,0,0.1)'
                        }}
                    >
                        {/* Animated background glow */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '800px',
                            height: '800px',
                            background: 'conic-gradient(from 90deg at 50% 50%, #000000 0%, #ff7700 15%, #000000 30%)',
                            opacity: 0.1,
                            filter: 'blur(60px)',
                            zIndex: 0,
                            animation: 'spin 8s linear infinite'
                        }} />

                        <style>{`
                            @keyframes spin {
                                from { transform: translateX(-50%) rotate(0deg); }
                                to { transform: translateX(-50%) rotate(360deg); }
                            }
                        `}</style>

                        <Stack align="center" style={{ position: 'relative', zIndex: 1 }} gap="xl">
                            <Badge
                                variant="filled"
                                color="orange"
                                size="lg"
                                radius="xl"
                                style={{ boxShadow: '0 0 20px rgba(255,119,0,0.5)' }}
                            >
                                GET STARTED NOW
                            </Badge>

                            <Title order={2} style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', letterSpacing: '-2px', lineHeight: 1 }}>
                                Stop guessing. <br />
                                <span style={{ color: 'var(--mantine-color-orange-5)' }}>Start knowing.</span>
                            </Title>

                            <Text c="dimmed" size="xl" maw={600} mx="auto">
                                Join thousands of developers who sleep soundly knowing PingPanther is watching their infrastructure.
                            </Text>

                            <Group mt="xl">
                                <Button
                                    component={Link}
                                    href="/login"
                                    size="xl"
                                    color="orange"
                                    radius="md"
                                    h={60}
                                    px={40}
                                    mb={0}
                                    style={{
                                        fontSize: '1.2rem',
                                        boxShadow: '0 0 30px rgba(255,119,0,0.4)',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}
                                    rightSection={<IconArrowRight size={24} />}
                                >
                                    Login to Dashboard
                                </Button>
                            </Group>

                            <Text size="sm" c="dimmed" mt={-10}>
                                No credit card required • Unlimited 14-day trial • Cancel anytime
                            </Text>
                        </Stack>
                    </Box>
                </Container>

                {/* Footer Minimal */}
                <Box py={60} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Container size="lg">
                        <Group justify="space-between">
                            <Text c="dimmed" size="sm">© 2026 PingPanther Inc.</Text>
                            <Group gap="xl">
                                <Text component={Link} href="#" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>Privacy</Text>
                                <Text component={Link} href="#" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>Terms</Text>
                                <Text component={Link} href="#" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>Twitter</Text>
                                <Text component={Link} href="#" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>GitHub</Text>
                            </Group>
                        </Group>
                    </Container>
                </Box>
            </Box>
        </>
    );
}
