import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import {
    Title,
    Text,
    Button,
    Grid,
    Card,
    Group,
    Badge,
    Stack,
    Table,
    Paper,
    ThemeIcon,
    RingProgress,
    Tabs,
    SimpleGrid,
    Tooltip as MantineTooltip,
    Alert,
    Timeline,
    TextInput,
    Modal,
    Select,
    ActionIcon,
    Code,
    Divider,
    Loader,
    Center,
    Textarea,
    Checkbox,
} from '@mantine/core';
import axios from 'axios';
import {
    IconArrowLeft,
    IconCheck,
    IconX,
    IconClock,
    IconAlertTriangle,
    IconActivity,
    IconBolt,
    IconTrash,
    IconPlayerPlay,
    IconPlus,
    IconBook,
    IconWorld,
    IconShieldLock,
    IconCpu,
    IconTerminal2,
    IconHistory,
    IconCamera,
    IconCode,
    IconMessageDots,
    IconSearch,
    IconEye,
    IconEyeOff,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { router } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

function MonitorShow({ monitor, heartbeats, incidents, stats, recovery_actions, playbooks, responseDistribution, uptimeTrend }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [playbookModalOpened, { open: openPlaybookModal, close: closePlaybookModal }] = useDisclosure(false);
    const [testModalOpened, { open: openTestModal, close: closeTestModal }] = useDisclosure(false);
    const [testing, setTesting] = React.useState(false);
    const [testResult, setTestResult] = React.useState(null);

    const handleTestNow = async () => {
        setTesting(true);
        setTestResult(null);
        openTestModal();

        // Add a bit of "dramatic effect" fake delay so the spinner is actually seen
        const minDelay = new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const [response] = await Promise.all([
                axios.post(route('monitors.check', monitor.id), {}, {
                    timeout: 10000 // 10 second timeout
                }),
                minDelay
            ]);

            setTestResult(response.data);
            // Refresh the page data to show new heartbeat in charts/list
            router.reload({ only: ['heartbeats', 'stats', 'monitor'] });
        } catch (error) {
            let msg = 'Could not reach the server';
            if (error.code === 'ECONNABORTED') msg = 'Test timed out after 10 seconds';
            else if (error.response?.data?.message) msg = error.response.data.message;

            notifications.show({
                title: 'Test Failed',
                message: msg,
                color: 'red'
            });
            closeTestModal();
        } finally {
            setTesting(false);
        }
    };

    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialTab = params?.get('tab') || 'heartbeats';
    const initialIncidentId = params?.get('incident_id');

    const [activeTab, setActiveTab] = React.useState(initialTab);
    const [selectedIncident, setSelectedIncident] = React.useState(null);

    React.useEffect(() => {
        if (initialIncidentId && incidents.length > 0) {
            const incident = incidents.find(i => i.id === initialIncidentId);
            if (incident) {
                setSelectedIncident(incident);
            }
        }
    }, [initialIncidentId, incidents]);

    const updateForm = useForm({
        initialValues: {
            message: '',
            type: 'update',
            is_public: false,
        }
    });

    const handleAddUpdate = (values) => {
        router.post(route('incidents.updates.store', selectedIncident.id), values, {
            onSuccess: () => {
                notifications.show({ title: 'Success', message: 'Update added', color: 'green' });
                updateForm.reset();
            }
        });
    };

    const form = useForm({
        initialValues: {
            name: '',
            type: 'webhook',
            config: { url: '', payload: '{}' },
            delay_seconds: 0,
        },
    });

    const handleAddRecovery = (values) => {
        const payload = {
            ...values,
            config: {
                ...values.config,
                payload: values.type === 'webhook' ? JSON.parse(values.config.payload || '{}') : {}
            }
        };

        router.post(`/monitors/${monitor.id}/recovery-actions`, payload, {
            onSuccess: () => {
                notifications.show({ title: 'Success', message: 'Recovery action added', color: 'green' });
                close();
                form.reset();
            },
            onError: (errors) => {
                notifications.show({ title: 'Error', message: Object.values(errors)[0], color: 'red' });
            }
        });
    };

    const handleDeleteRecovery = (id) => {
        if (confirm('Delete this automated recovery action?')) {
            router.delete(`/recovery-actions/${id}`, {
                onSuccess: () => notifications.show({ title: 'Deleted', message: 'Recovery action removed', color: 'red' })
            });
        }
    };
    const chartData = [...heartbeats].reverse().map(h => ({
        time: h.checked_at_human || new Date(h.checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        responseTime: Math.round(h.response_time),
        status: h.is_up ? 'UP' : 'DOWN'
    }));

    const getStatusColor = (status) => {
        const colors = {
            up: 'green',
            disabled: 'gray',
            pending: 'orange',
            down: 'red',
        };
        return colors[status] || 'gray';
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between" align="flex-start">
                    <div>
                        <Group gap="sm" mb="xs">
                            <Button
                                component={Link}
                                href="/monitors"
                                variant="subtle"
                                color="gray"
                                leftSection={<IconArrowLeft size={16} />}
                                size="xs"
                                radius="xl"
                            >
                                Back to Monitors
                            </Button>
                            <Badge
                                color={getStatusColor(monitor.status)}
                                variant="filled"
                                size="lg"
                                leftSection={monitor.status === 'up' ? <IconCheck size={14} /> : <IconAlertTriangle size={14} />}
                            >
                                {monitor.status.toUpperCase()}
                            </Badge>
                        </Group>
                        <Group gap="md">
                            <Title order={1} fw={900} style={{ letterSpacing: '-1px', fontSize: '2.5rem' }}>
                                {monitor.name}
                            </Title>
                        </Group>
                        <Group gap="xs" mt={4}>
                            <IconWorld size={16} />
                            <Text c="dimmed" size="sm" component="a" href={monitor.url} target="_blank" style={{ textDecoration: 'none' }}>
                                {monitor.url}
                            </Text>
                        </Group>
                    </div>
                    <Group>
                        <Button variant="light" color="blue" leftSection={<IconBook size={18} />} onClick={openPlaybookModal}>
                            Playbook
                        </Button>
                        <Button
                            variant="filled"
                            color="blue"
                            leftSection={<IconBolt size={18} />}
                            onClick={handleTestNow}
                            loading={testing}
                        >
                            Test Now
                        </Button>
                    </Group>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 6 }} spacing="lg">
                    <Card padding="xl" radius="lg" withBorder style={{ overflow: 'visible' }}>
                        <div style={{ position: 'absolute', top: -10, right: 20 }}>
                            <RingProgress
                                size={80}
                                thickness={8}
                                roundCaps
                                sections={[
                                    { value: stats.uptime_24h, color: 'teal' },
                                    { value: 100 - stats.uptime_24h, color: 'gray.1' },
                                ]}
                                label={
                                    <Text ta="center" fw={700} size="xs">
                                        {stats.uptime_24h}%
                                    </Text>
                                }
                            />
                        </div>
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Uptime (24h)</Text>
                        <Text size="h2" fw={900} style={{ lineHeight: 1 }}>{stats.uptime_24h}%</Text>
                        <Text size="xs" c="green" fw={600} mt={8}>Last day</Text>
                    </Card>

                    <Card padding="xl" radius="lg" withBorder>
                        <ThemeIcon color="teal" variant="light" size="xl" radius="md" mb="md">
                            <IconCheck size={24} />
                        </ThemeIcon>
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Uptime (7d)</Text>
                        <Text size="h2" fw={900} style={{ lineHeight: 1 }}>{stats.uptime_7d}%</Text>
                        <Text size="xs" c="dimmed" fw={500} mt={8}>Last week</Text>
                    </Card>

                    <Card padding="xl" radius="lg" withBorder>
                        <ThemeIcon color="cyan" variant="light" size="xl" radius="md" mb="md">
                            <IconActivity size={24} />
                        </ThemeIcon>
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Uptime (30d)</Text>
                        <Text size="h2" fw={900} style={{ lineHeight: 1 }}>{stats.uptime_30d}%</Text>
                        <Text size="xs" c="dimmed" fw={500} mt={8}>Last month</Text>
                    </Card>

                    <Card padding="xl" radius="lg" withBorder>
                        <ThemeIcon color="blue" variant="light" size="xl" radius="md" mb="md">
                            <IconClock size={24} />
                        </ThemeIcon>
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Avg Response</Text>
                        <Text size="h2" fw={900} style={{ lineHeight: 1 }}>{Math.round(stats.avg_response_time || 0)}<span style={{ fontSize: '1rem', fontWeight: 500, marginLeft: 2 }}>ms</span></Text>
                        <Text size="xs" c="dimmed" fw={500} mt={8}>Last 100 checks</Text>
                    </Card>

                    <Card padding="xl" radius="lg" withBorder>
                        <ThemeIcon color="orange" variant="light" size="xl" radius="md" mb="md">
                            <IconAlertTriangle size={24} />
                        </ThemeIcon>
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Total Incidents</Text>
                        <Text size="h2" fw={900} style={{ lineHeight: 1 }}>{stats.total_incidents}</Text>
                        <Text size="xs" c="dimmed" fw={500} mt={8}>Lifetime</Text>
                    </Card>

                    <Card padding="xl" radius="lg" withBorder>
                        <ThemeIcon color={stats.active_incidents > 0 ? "red" : "green"} variant="light" size="xl" radius="md" mb="md">
                            {stats.active_incidents > 0 ? <IconX size={24} /> : <IconCheck size={24} />}
                        </ThemeIcon>
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Active Incidents</Text>
                        <Text size="h2" fw={900} style={{ lineHeight: 1 }}>{stats.active_incidents}</Text>
                        <Text size="xs" c={stats.active_incidents > 0 ? "red" : "green"} fw={600} mt={8}>
                            {stats.active_incidents > 0 ? "Under investigation" : "All systems normal"}
                        </Text>
                    </Card>
                </SimpleGrid>

                <Card padding="xl" radius="lg" withBorder shadow="sm">
                    <Group justify="space-between" mb="xl">
                        <div>
                            <Title order={4} fw={800}>Check History</Title>
                            <Text size="sm" c="dimmed">Visual representation of the last 100 heartbeats</Text>
                        </div>
                        <Group gap={4}>
                            <Text size="xs" c="dimmed">SLOW</Text>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: `rgba(34, 139, 230, ${0.2 + (i * 0.2)})` }} />
                            ))}
                            <Text size="xs" c="dimmed" ml={4}>FAST</Text>
                        </Group>
                    </Group>

                    <Group gap={6} justify="center">
                        {heartbeats.slice(0, 50).map((h, i) => {
                            const speed = h.response_time;
                            let color = 'var(--mantine-color-blue-filled)';
                            if (!h.is_up) color = 'var(--mantine-color-red-filled)';
                            else if (speed > 1000) color = 'var(--mantine-color-blue-3)';
                            else if (speed > 500) color = 'var(--mantine-color-blue-5)';
                            else if (speed > 200) color = 'var(--mantine-color-blue-7)';

                            return (
                                <MantineTooltip
                                    key={h.id}
                                    label={`${h.is_up ? 'Up' : 'Down'} - ${Math.round(speed)}ms at ${h.checked_at}`}
                                    withArrow
                                >
                                    <div
                                        style={{
                                            width: 14,
                                            height: 32,
                                            borderRadius: 4,
                                            background: color,
                                            transition: 'transform 0.2s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scaleY(1.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scaleY(1)'}
                                    />
                                </MantineTooltip>
                            );
                        })}
                    </Group>

                    <Divider my="xl" label="Performance Analysis" labelPosition="center" />

                    <div style={{ height: 350, width: '100%', marginTop: 20 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#228be6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#228be6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                                <XAxis
                                    dataKey="time"
                                    hide
                                />
                                <YAxis
                                    unit="ms"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#adb5bd' }}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <Paper shadow="xl" p="md" withBorder radius="md">
                                                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">{payload[0].payload.time}</Text>
                                                    <Text size="lg" fw={900} c="blue">{payload[0].value}ms</Text>
                                                    <Badge size="xs" color={payload[0].payload.status === 'UP' ? 'green' : 'red'}>
                                                        {payload[0].payload.status}
                                                    </Badge>
                                                </Paper>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="responseTime"
                                    stroke="#228be6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRes)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Card padding="xl" radius="lg" withBorder shadow="sm">
                            <Group justify="space-between" mb="xl">
                                <div>
                                    <Title order={4} fw={800}>Response Time Distribution</Title>
                                    <Text size="sm" c="dimmed">Last 24 hours breakdown</Text>
                                </div>
                                <ThemeIcon color="blue" variant="light" size="lg">
                                    <IconClock size={20} />
                                </ThemeIcon>
                            </Group>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={responseDistribution || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                                    <XAxis dataKey="range" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#adb5bd' }} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#adb5bd' }} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <Paper shadow="xl" p="md" withBorder radius="md">
                                                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">{payload[0].payload.range}</Text>
                                                        <Text size="lg" fw={900} c="blue">{payload[0].value} checks</Text>
                                                    </Paper>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="count" fill="var(--mantine-color-blue-6)" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Card padding="xl" radius="lg" withBorder shadow="sm">
                            <Group justify="space-between" mb="xl">
                                <div>
                                    <Title order={4} fw={800}>Uptime Trend (7 Days)</Title>
                                    <Text size="sm" c="dimmed">Daily uptime percentage</Text>
                                </div>
                                <ThemeIcon color="teal" variant="light" size="lg">
                                    <IconActivity size={20} />
                                </ThemeIcon>
                            </Group>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={uptimeTrend || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#adb5bd' }} />
                                    <YAxis domain={[90, 100]} fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#adb5bd' }} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <Paper shadow="xl" p="md" withBorder radius="md">
                                                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">{payload[0].payload.date}</Text>
                                                        <Text size="lg" fw={900} c="teal">{payload[0].value}% uptime</Text>
                                                    </Paper>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="uptime"
                                        stroke="var(--mantine-color-teal-6)"
                                        strokeWidth={3}
                                        dot={{ fill: 'var(--mantine-color-teal-6)', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        {monitor.metadata && (
                            <Card padding="xl" radius="lg" withBorder>
                                <Group mb="xl">
                                    <ThemeIcon variant="light" color="gray" size="lg" radius="md">
                                        <IconCpu size={20} />
                                    </ThemeIcon>
                                    <Title order={4} fw={800}>Infrastructure Details</Title>
                                </Group>

                                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                                    <Stack gap="md">
                                        <div>
                                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Server Environment</Text>
                                            <Badge variant="light" color="gray" size="lg" radius="sm">{monitor.metadata.server || 'Unknown'}</Badge>
                                        </div>
                                        <div>
                                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>IP Address</Text>
                                            <Text size="sm" fw={700} ff="monospace">{monitor.metadata.ip_address || 'Unknown'}</Text>
                                        </div>
                                        <div>
                                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Protocol & Type</Text>
                                            <Text size="sm" fw={700}>{monitor.metadata.content_type || 'Unknown'}</Text>
                                        </div>
                                    </Stack>

                                    <Stack gap="md">
                                        <div>
                                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Response Size</Text>
                                            <Text size="sm" fw={700}>{monitor.metadata.content_length ? `${(monitor.metadata.content_length / 1024).toFixed(2)} KB` : 'Dynamic'}</Text>
                                        </div>
                                        <div>
                                            <Group gap="xs" mb={4}>
                                                <IconTerminal2 size={14} color="var(--mantine-color-dimmed)" />
                                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Raw Headers</Text>
                                            </Group>
                                            <Paper p="md" radius="md" withBorder style={{ maxHeight: 200, overflow: 'auto' }}>
                                                <Text size="xs" ff="monospace" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                                                    {monitor.metadata.response_headers ?
                                                        Object.entries(monitor.metadata.response_headers)
                                                            .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
                                                            .join('\n')
                                                        : 'No header data available'}
                                                </Text>
                                            </Paper>
                                        </div>
                                    </Stack>
                                </SimpleGrid>
                            </Card>
                        )}
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        {monitor.check_ssl && monitor.ssl_expires_at && (
                            <Card padding="xl" radius="lg" withBorder shadow="sm">
                                <Stack gap="lg">
                                    <Group justify="space-between" align="flex-start">
                                        <ThemeIcon
                                            size="xl"
                                            radius="md"
                                            variant="light"
                                            color={monitor.ssl_days_until_expiry <= 7 ? 'red' : monitor.ssl_days_until_expiry <= 30 ? 'orange' : 'blue'}
                                        >
                                            <IconShieldLock size={24} />
                                        </ThemeIcon>
                                        <Badge 
                                            size="lg" 
                                            radius="sm" 
                                            variant="light" 
                                            color={monitor.ssl_days_until_expiry <= 30 ? 'red' : 'blue'}
                                        >
                                            {monitor.ssl_days_until_expiry <= 30 ? 'CRITICAL' : 'SECURE'}
                                        </Badge>
                                    </Group>

                                    <div>
                                        <Text fw={800} size="xl" mb={4}>SSL Certificate</Text>
                                        <Text size="sm" c="dimmed" fw={500}>{monitor.ssl_issuer || 'Unknown Issuer'}</Text>
                                    </div>

                                    <Divider variant="dashed" />

                                    <Group justify="space-between" align="flex-end">
                                        <div>
                                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Expires In</Text>
                                            <Text fw={900} size="h3" c={monitor.ssl_days_until_expiry <= 30 ? 'red' : 'blue'} style={{ lineHeight: 1 }}>
                                                {monitor.ssl_days_until_expiry} Days
                                            </Text>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={4}>Valid Until</Text>
                                            <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                                {new Date(monitor.ssl_expires_at).toLocaleDateString()}
                                            </Text>
                                        </div>
                                    </Group>
                                </Stack>
                            </Card>
                        )}
                    </Grid.Col>
                </Grid>

                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List>
                        <Tabs.Tab value="heartbeats" leftSection={<IconCheck size={16} />}>
                            Heartbeats
                        </Tabs.Tab>
                        <Tabs.Tab value="incidents" leftSection={<IconAlertTriangle size={16} />}>
                            Incidents
                        </Tabs.Tab>
                        <Tabs.Tab value="recovery" leftSection={<IconBolt size={16} />}>
                            Self-Healing
                        </Tabs.Tab>
                        <Tabs.Tab value="playbook" leftSection={<IconBook size={16} />}>
                            Playbook
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="heartbeats" pt="md">
                        <Card padding="lg" radius="md">
                            <Title order={4} fw={700} mb="md">
                                Recent Checks
                            </Title>
                            <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Status</Table.Th>
                                            <Table.Th>Response Time</Table.Th>
                                            <Table.Th>Status Code</Table.Th>
                                            <Table.Th>Error</Table.Th>
                                            <Table.Th>Checked At</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {heartbeats.length === 0 ? (
                                            <Table.Tr>
                                                <Table.Td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                                    <Text c="dimmed">No heartbeats yet</Text>
                                                </Table.Td>
                                            </Table.Tr>
                                        ) : (
                                            heartbeats.map((heartbeat) => (
                                                <Table.Tr key={heartbeat.id}>
                                                    <Table.Td>
                                                        {heartbeat.is_up ? (
                                                            <Badge color="green" variant="light" leftSection={<IconCheck size={12} />}>
                                                                UP
                                                            </Badge>
                                                        ) : (
                                                            <Badge color="red" variant="light" leftSection={<IconX size={12} />}>
                                                                DOWN
                                                            </Badge>
                                                        )}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm">{Math.round(heartbeat.response_time)}ms</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm">{heartbeat.status_code || '-'}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm" c={heartbeat.error ? 'red' : 'dimmed'}>
                                                            {heartbeat.error || '-'}
                                                        </Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm" c="dimmed">{heartbeat.checked_at}</Text>
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </Paper>
                        </Card>
                    </Tabs.Panel>

                    <Tabs.Panel value="incidents" pt="md">
                        <Grid gutter="xl">
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <Card padding="lg" radius="md" withBorder>
                                    <Title order={4} fw={700} mb="xl">Incident History</Title>
                                    {incidents.length === 0 ? (
                                        <Paper p="md" radius="sm">
                                            <Text size="sm" c="dimmed">No incidents recorded</Text>
                                        </Paper>
                                    ) : (
                                        <Stack gap="md">
                                            {incidents.map((incident) => (
                                                <Paper
                                                    key={incident.id}
                                                    withBorder
                                                    p="md"
                                                    radius="md"
                                                    style={{
                                                        cursor: 'pointer',
                                                        borderColor: selectedIncident?.id === incident.id ? 'var(--mantine-color-blue-filled)' : undefined,
                                                        background: selectedIncident?.id === incident.id ? 'var(--mantine-color-blue-0)' : undefined,
                                                    }}
                                                    onClick={() => setSelectedIncident(incident)}
                                                >
                                                    <Group justify="space-between" mb={4}>
                                                        <Badge color={incident.resolved_at ? 'green' : 'red'} variant="light">
                                                            {incident.resolved_at ? 'Resolved' : 'Active'}
                                                        </Badge>
                                                        <Text size="xs" c="dimmed">{incident.started_at}</Text>
                                                    </Group>
                                                    <Text fw={700} size="sm" lineClamp={1}>{incident.error_message}</Text>
                                                    {incident.resolved_at && (
                                                        <Text size="xs" c="dimmed" mt={4}>Downtime: {incident.duration}</Text>
                                                    )}
                                                </Paper>
                                            ))}
                                        </Stack>
                                    )}
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 7 }}>
                                {selectedIncident ? (
                                    <Stack gap="lg">
                                        <Card padding="xl" radius="md" withBorder>
                                            <Title order={3} fw={900} mb="xs">Incident Details</Title>
                                            <Text c="dimmed" size="sm" mb="xl">ID: {selectedIncident.id}</Text>

                                            <SimpleGrid cols={2} mb="xl">
                                                <Paper p="md" radius="md">
                                                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">Started At</Text>
                                                    <Text fw={700}>{selectedIncident.started_at}</Text>
                                                </Paper>
                                                <Paper p="md" radius="md" bg={selectedIncident.resolved_at ? 'green.0' : 'red.0'}>
                                                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">Resolved At</Text>
                                                    <Text fw={700}>{selectedIncident.resolved_at || 'Under investigation'}</Text>
                                                </Paper>
                                            </SimpleGrid>

                                            <Tabs defaultValue="updates">
                                                <Tabs.List mb="md">
                                                    <Tabs.Tab value="updates" leftSection={<IconHistory size={16} />}>Journaling</Tabs.Tab>
                                                    <Tabs.Tab value="snapshot" leftSection={<IconCamera size={16} />}>Screenshot</Tabs.Tab>
                                                    <Tabs.Tab value="code" leftSection={<IconCode size={16} />}>HTML Snapshot</Tabs.Tab>
                                                </Tabs.List>

                                                <Tabs.Panel value="updates">
                                                    <Stack gap="md">
                                                        <form onSubmit={updateForm.onSubmit(handleAddUpdate)}>
                                                            <Paper withBorder p="md" radius="md" style={{ background: 'var(--mantine-primary-color-light)' }}>
                                                                <Stack gap="xs">
                                                                    <Text size="xs" fw={700} c="blue">ADD PROGRESS UPDATE</Text>
                                                                    <Select
                                                                        size="xs"
                                                                        data={[
                                                                            { value: 'update', label: 'General Update' },
                                                                            { value: 'investigating', label: 'Investigating' },
                                                                            { value: 'identified', label: 'Identified Issue' },
                                                                            { value: 'resolved', label: 'Resolved' },
                                                                        ]}
                                                                        {...updateForm.getInputProps('type')}
                                                                    />
                                                                    <Textarea
                                                                        placeholder="What happened? What are the next steps?"
                                                                        minRows={2}
                                                                        {...updateForm.getInputProps('message')}
                                                                    />
                                                                    <Group justify="space-between">
                                                                        <Checkbox
                                                                            size="xs"
                                                                            label="Show on Status Page"
                                                                            {...updateForm.getInputProps('is_public', { type: 'checkbox' })}
                                                                        />
                                                                        <Button type="submit" size="xs" leftSection={<IconPlus size={14} />}>Add Update</Button>
                                                                    </Group>
                                                                </Stack>
                                                            </Paper>
                                                        </form>

                                                        <Timeline active={selectedIncident.updates.length} bulletSize={20} lineWidth={2}>
                                                            {selectedIncident.updates.map((update) => (
                                                                <Timeline.Item
                                                                    key={update.id}
                                                                    title={
                                                                        <Group gap="xs">
                                                                            <Text size="sm" fw={500}>{update.message}</Text>
                                                                            {update.is_public ? (
                                                                                <Badge size="xs" color="green" variant="light" leftSection={<IconEye size={10} />}>Public</Badge>
                                                                            ) : (
                                                                                <Badge size="xs" color="gray" variant="light" leftSection={<IconEyeOff size={10} />}>Internal Only</Badge>
                                                                            )}
                                                                        </Group>
                                                                    }
                                                                    bullet={<IconMessageDots size={12} />}
                                                                >
                                                                    <Text size="xs" c="dimmed">{update.created_at} • <Badge size="xs" variant="outline">{update.type}</Badge></Text>
                                                                </Timeline.Item>
                                                            ))}
                                                            <Timeline.Item
                                                                bullet={<IconAlertTriangle size={12} />}
                                                                lineVariant="dashed"
                                                                title="Incident Started"
                                                            >
                                                                <Text size="xs" c="dimmed">{selectedIncident.started_at}</Text>
                                                            </Timeline.Item>
                                                        </Timeline>
                                                    </Stack>
                                                </Tabs.Panel>

                                                <Tabs.Panel value="snapshot">
                                                    {selectedIncident.screenshot_path ? (
                                                        <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
                                                            <img
                                                                src={selectedIncident.screenshot_path}
                                                                alt="Incident Screenshot"
                                                                style={{ width: '100%', display: 'block' }}
                                                            />
                                                        </Paper>
                                                    ) : (
                                                        <Center py="xl">
                                                            <Stack align="center" gap="xs">
                                                                <IconCamera size={48} color="var(--mantine-color-gray-4)" />
                                                                <Text c="dimmed">No screenshot available for this incident</Text>
                                                            </Stack>
                                                        </Center>
                                                    )}
                                                </Tabs.Panel>

                                                <Tabs.Panel value="code">
                                                    {selectedIncident.html_snapshot ? (
                                                        <Paper withBorder radius="md" p="md" style={{ background: 'var(--mantine-color-dark-filled)' }}>
                                                            <Code block color="gray.0" ff="monospace" style={{ maxHeight: 400, overflow: 'auto' }}>
                                                                {selectedIncident.html_snapshot}
                                                            </Code>
                                                        </Paper>
                                                    ) : (
                                                        <Center py="xl">
                                                            <Stack align="center" gap="xs">
                                                                <IconCode size={48} color="var(--mantine-color-gray-4)" />
                                                                <Text c="dimmed">No HTML snapshot captured</Text>
                                                            </Stack>
                                                        </Center>
                                                    )}
                                                </Tabs.Panel>
                                            </Tabs>
                                        </Card>
                                    </Stack>
                                ) : (
                                    <Card withBorder h="100%" radius="md">
                                        <Center h="100%">
                                            <Stack align="center" gap="xs">
                                                <ThemeIcon size={64} radius={64} variant="light" color="gray">
                                                    <IconSearch size={32} />
                                                </ThemeIcon>
                                                <Text fw={700}>Select an incident to see details</Text>
                                                <Text size="sm" c="dimmed">Detailed snapshots and journals will appear here</Text>
                                            </Stack>
                                        </Center>
                                    </Card>
                                )}
                            </Grid.Col>
                        </Grid>
                    </Tabs.Panel>

                    <Tabs.Panel value="recovery" pt="md">
                        <Stack gap="md">
                            <Group justify="space-between">
                                <div>
                                    <Title order={4} fw={700}>Automated Recovery Actions</Title>
                                    <Text size="xs" c="dimmed">Executed automatically when an incident begins</Text>
                                </div>
                                <Button size="xs" leftSection={<IconPlus size={14} />} onClick={open}>
                                    Add Action
                                </Button>
                            </Group>

                            {recovery_actions.length === 0 ? (
                                <Paper p="xl" withBorder style={{ textAlign: 'center' }}>
                                    <IconBolt size={48} color="gray" opacity={0.3} />
                                    <Text c="dimmed" mt="sm">No automated recovery actions configured.</Text>
                                    <Button variant="subtle" size="xs" mt="md" onClick={open}>Configure Now</Button>
                                </Paper>
                            ) : (
                                <Grid>
                                    {recovery_actions.map((action) => (
                                        <Grid.Col key={action.id} span={{ base: 12, md: 6 }}>
                                            <Card withBorder>
                                                <Group justify="space-between" mb="xs">
                                                    <Group gap="sm">
                                                        <ThemeIcon color="yellow" variant="light">
                                                            <IconPlayerPlay size={16} />
                                                        </ThemeIcon>
                                                        <Text fw={700}>{action.name}</Text>
                                                    </Group>
                                                    <ActionIcon color="red" variant="subtle" onClick={() => handleDeleteRecovery(action.id)}>
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Group>
                                                <Stack gap={4}>
                                                    <Text size="xs" c="dimmed">TYPE: <Badge size="xs" variant="outline">{action.type.toUpperCase()}</Badge></Text>
                                                    <Text size="xs" c="dimmed">DELAY: <b>{action.delay_seconds} seconds</b></Text>
                                                    {action.type === 'webhook' && (
                                                        <Code block mt="xs" size="xs">{action.config.url}</Code>
                                                    )}
                                                </Stack>
                                            </Card>
                                        </Grid.Col>
                                    ))}
                                </Grid>
                            )}
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="playbook" pt="md">
                        <Stack gap="md">
                            <Group justify="space-between">
                                <div>
                                    <Title order={4} fw={700}>Incident Playbook</Title>
                                    <Text size="xs" c="dimmed">Guidance for resolving incidents on this monitor</Text>
                                </div>
                                <Button size="xs" variant="light" leftSection={<IconPlus size={14} />} onClick={openPlaybookModal}>
                                    Assign Playbook
                                </Button>
                            </Group>

                            {monitor.playbook ? (
                                <Card padding="xl" withBorder radius="md">
                                    <Group justify="space-between" mb="md">
                                        <Title order={5}>{monitor.playbook.name}</Title>
                                        <Badge variant="dot">Markdown Enabled</Badge>
                                    </Group>
                                    <Divider mb="xl" />
                                    <Paper p="xl" radius="md" withBorder>
                                        <div
                                            className="markdown-content"
                                            style={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '1.6' }}
                                        >
                                            {monitor.playbook.content}
                                        </div>
                                    </Paper>
                                </Card>
                            ) : (
                                <Paper p="xl" withBorder style={{ textAlign: 'center' }}>
                                    <IconBook size={48} color="gray" opacity={0.3} />
                                    <Text c="dimmed" mt="sm">No playbook assigned to this monitor.</Text>
                                    <Button variant="subtle" size="xs" mt="md" onClick={openPlaybookModal}>Select a Playbook</Button>
                                </Paper>
                            )}
                        </Stack>
                    </Tabs.Panel>
                </Tabs>

                <Modal opened={playbookModalOpened} onClose={closePlaybookModal} title="Assign Incident Playbook" size="sm">
                    <Stack gap="md">
                        <Select
                            label="Select Playbook"
                            placeholder="Choose a guide"
                            data={playbooks}
                            defaultValue={monitor.playbook_id}
                            onChange={(val) => {
                                router.put(route('monitors.update', monitor.id), {
                                    ...monitor,
                                    playbook_id: val
                                }, {
                                    onSuccess: () => {
                                        notifications.show({ title: 'Success', message: 'Playbook updated', color: 'green' });
                                        closePlaybookModal();
                                    }
                                });
                            }}
                        />
                        <Button variant="light" component={Link} href={route('playbooks.index')} size="xs">Create New Playbook</Button>
                    </Stack>
                </Modal>

                <Modal opened={opened} onClose={close} title="Add Automated Recovery Action" size="lg">
                    <form onSubmit={form.onSubmit(handleAddRecovery)}>
                        <Stack gap="md">
                            <TextInput label="Action Name" placeholder="Restart API Gateway" required {...form.getInputProps('name')} />
                            <Select
                                label="Action Type"
                                data={[
                                    { value: 'webhook', label: 'HTTP Webhook (POST Request)' },
                                    { value: 'ssh', label: 'Remote SSH Command (Coming Soon)', disabled: true },
                                ]}
                                {...form.getInputProps('type')}
                            />

                            {form.values.type === 'webhook' && (
                                <>
                                    <TextInput label="Target URL" placeholder="https://api.cloud.com/v1/restart" required {...form.getInputProps('config.url')} />
                                    <TextInput label="JSON Payload (Optional)" placeholder='{"service": "web"}' {...form.getInputProps('config.payload')} />
                                </>
                            )}

                            <TextInput label="Delay (Seconds)" type="number" description="Execute after X seconds of downtime" {...form.getInputProps('delay_seconds')} />

                            <Button type="submit" fullWidth mt="md">Save Action</Button>
                        </Stack>
                    </form>
                </Modal>

                <Modal
                    opened={testModalOpened}
                    onClose={testing ? () => { } : closeTestModal}
                    title="Manual Monitor Test"
                    centered
                    size="md"
                    radius="lg"
                    withCloseButton={!testing}
                >
                    <div style={{ padding: '1rem 0' }}>
                        {testing ? (
                            <Stack align="center" gap="xl" py="xl">
                                <Loader size="xl" variant="bars" />
                                <div style={{ textAlign: 'center' }}>
                                    <Text fw={700} size="lg">Testing {monitor.name}...</Text>
                                    <Text size="sm" c="dimmed">This might take up to 10 seconds</Text>
                                </div>
                            </Stack>
                        ) : testResult && (
                            <Stack gap="md">
                                <Center>
                                    <ThemeIcon size={60} radius={60} color={testResult.is_up ? 'green' : 'red'} variant="light">
                                        {testResult.is_up ? <IconCheck size={40} /> : <IconX size={40} />}
                                    </ThemeIcon>
                                </Center>

                                <div style={{ textAlign: 'center' }}>
                                    <Title order={3} c={testResult.is_up ? 'green' : 'red'}>
                                        {testResult.is_up ? 'System is Online' : 'System is Offline'}
                                    </Title>
                                    <Text size="sm" c="dimmed">Check completed at {testResult.checked_at}</Text>
                                </div>

                                <Card withBorder radius="md" p="md">
                                    <SimpleGrid cols={2}>
                                        <div>
                                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Response Time</Text>
                                            <Text fw={700}>{Math.round(testResult.response_time)}ms</Text>
                                        </div>
                                        <div>
                                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Status Code</Text>
                                            <Text fw={700}>{testResult.status_code || 'N/A'}</Text>
                                        </div>
                                    </SimpleGrid>
                                    {!testResult.is_up && (
                                        <div style={{ marginTop: 12 }}>
                                            <Divider my="xs" />
                                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Error Detail</Text>
                                            <Text size="sm" c="red" fw={500}>{testResult.error || 'Unknown connection error'}</Text>
                                        </div>
                                    )}
                                </Card>

                                <Button fullWidth variant="light" onClick={closeTestModal} mt="md">
                                    Close Results
                                </Button>
                            </Stack>
                        )}
                    </div>
                </Modal>
            </Stack>
        </AppLayout>
    );
}

export default MonitorShow;
