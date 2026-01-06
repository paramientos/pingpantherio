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
    Timeline,
    Tabs,
} from '@mantine/core';
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
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { router } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { TextInput, Modal, Select, ActionIcon, Code } from '@mantine/core';

function MonitorShow({ monitor, heartbeats, incidents, stats, recovery_actions }) {
    const [opened, { open, close }] = useDisclosure(false);

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
    const getStatusColor = (status) => {
        const colors = {
            active: 'green',
            paused: 'red',
            pending: 'orange',
        };
        return colors[status] || 'gray';
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Group gap="sm" mb="xs">
                            <Button
                                component={Link}
                                href="/monitors"
                                variant="subtle"
                                leftSection={<IconArrowLeft size={16} />}
                                size="sm"
                            >
                                Back
                            </Button>
                            <Badge color={getStatusColor(monitor.status)} variant="light">
                                {monitor.status.toUpperCase()}
                            </Badge>
                        </Group>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            {monitor.name}
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            {monitor.url}
                        </Text>
                    </div>
                </Group>

                <Grid>
                    <Grid.Col span={{ base: 12, xs: 6, md: 3 }}>
                        <Card padding="lg" radius="md">
                            <Group justify="center" mb="md">
                                <RingProgress
                                    size={100}
                                    thickness={10}
                                    roundCaps
                                    sections={[
                                        { value: stats.uptime_24h, color: 'teal' },
                                        { value: 100 - stats.uptime_24h, color: 'gray.2' },
                                    ]}
                                    label={
                                        <div style={{ textAlign: 'center' }}>
                                            <Text size="lg" fw={900} style={{ lineHeight: 1 }}>
                                                {stats.uptime_24h}%
                                            </Text>
                                        </div>
                                    }
                                />
                            </Group>
                            <Text size="xs" c="dimmed" ta="center" fw={600} tt="uppercase">
                                24h Uptime
                            </Text>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6, md: 3 }}>
                        <Card padding="lg" radius="md">
                            <Group justify="space-between" mb="md">
                                <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                                    <IconClock size={24} stroke={1.5} />
                                </ThemeIcon>
                            </Group>
                            <Text size="xs" c="dimmed" fw={600} tt="uppercase" mb={4}>
                                Avg Response
                            </Text>
                            <Text size="xl" fw={900} style={{ lineHeight: 1 }}>
                                {Math.round(stats.avg_response_time || 0)}ms
                            </Text>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6, md: 3 }}>
                        <Card padding="lg" radius="md">
                            <Group justify="space-between" mb="md">
                                <ThemeIcon size="xl" radius="md" variant="light" color="orange">
                                    <IconAlertTriangle size={24} stroke={1.5} />
                                </ThemeIcon>
                            </Group>
                            <Text size="xs" c="dimmed" fw={600} tt="uppercase" mb={4}>
                                Total Incidents
                            </Text>
                            <Text size="xl" fw={900} style={{ lineHeight: 1 }}>
                                {stats.total_incidents}
                            </Text>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6, md: 3 }}>
                        <Card padding="lg" radius="md">
                            <Group justify="space-between" mb="md">
                                <ThemeIcon size="xl" radius="md" variant="light" color="red">
                                    <IconActivity size={24} stroke={1.5} />
                                </ThemeIcon>
                            </Group>
                            <Text size="xs" c="dimmed" fw={600} tt="uppercase" mb={4}>
                                Active Incidents
                            </Text>
                            <Text size="xl" fw={900} style={{ lineHeight: 1 }}>
                                {stats.active_incidents}
                            </Text>
                        </Card>
                    </Grid.Col>
                </Grid>

                {monitor.check_ssl && monitor.ssl_expires_at && (
                    <Card padding="lg" radius="md" withBorder>
                        <Group justify="space-between">
                            <div>
                                <Group gap="sm" mb="xs">
                                    <ThemeIcon
                                        size="lg"
                                        radius="md"
                                        variant="light"
                                        color={monitor.ssl_days_until_expiry <= 7 ? 'red' : monitor.ssl_days_until_expiry <= 30 ? 'orange' : 'green'}
                                    >
                                        🔒
                                    </ThemeIcon>
                                    <div>
                                        <Text fw={700} size="lg">
                                            SSL Certificate
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            {monitor.ssl_issuer}
                                        </Text>
                                    </div>
                                </Group>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Badge
                                    size="lg"
                                    variant="light"
                                    color={monitor.ssl_days_until_expiry <= 7 ? 'red' : monitor.ssl_days_until_expiry <= 30 ? 'orange' : 'green'}
                                >
                                    {monitor.ssl_days_until_expiry} days left
                                </Badge>
                                <Text size="xs" c="dimmed" mt={4}>
                                    Expires: {monitor.ssl_expires_at}
                                </Text>
                            </div>
                        </Group>
                    </Card>
                )}

                {monitor.metadata && (
                    <Card padding="lg" radius="md" withBorder>
                        <Title order={4} fw={700} mb="md">
                            Site Information
                        </Title>
                        <Grid>
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Stack gap="sm">
                                    <div>
                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                            Server
                                        </Text>
                                        <Text size="sm" fw={500}>
                                            {monitor.metadata.server || 'Unknown'}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                            IP Address
                                        </Text>
                                        <Text size="sm" fw={500} ff="monospace">
                                            {monitor.metadata.ip_address || 'Unknown'}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                            Content Type
                                        </Text>
                                        <Text size="sm" fw={500}>
                                            {monitor.metadata.content_type || 'Unknown'}
                                        </Text>
                                    </div>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Stack gap="sm">
                                    <div>
                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                            Content Length
                                        </Text>
                                        <Text size="sm" fw={500}>
                                            {monitor.metadata.content_length ? `${(monitor.metadata.content_length / 1024).toFixed(2)} KB` : 'Unknown'}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                            Response Headers
                                        </Text>
                                        <Paper p="xs" bg="gray.0" radius="sm" style={{ maxHeight: 150, overflow: 'auto' }}>
                                            <Text size="xs" ff="monospace" style={{ whiteSpace: 'pre-wrap' }}>
                                                {monitor.metadata.response_headers ?
                                                    Object.entries(monitor.metadata.response_headers)
                                                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                                                        .join('\n')
                                                    : 'No headers'}
                                            </Text>
                                        </Paper>
                                    </div>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Card>
                )}

                <Tabs defaultValue="heartbeats">
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
                        <Card padding="lg" radius="md">
                            <Title order={4} fw={700} mb="md">
                                Incident History
                            </Title>
                            {incidents.length === 0 ? (
                                <Paper p="md" radius="sm" bg="gray.0">
                                    <Group gap="xs">
                                        <ThemeIcon color="green" variant="light" size="sm" radius="xl">
                                            <IconCheck size={14} />
                                        </ThemeIcon>
                                        <Text size="sm" c="dimmed">
                                            No incidents recorded
                                        </Text>
                                    </Group>
                                </Paper>
                            ) : (
                                <Timeline active={incidents.length} bulletSize={24} lineWidth={2}>
                                    {incidents.map((incident) => (
                                        <Timeline.Item
                                            key={incident.id}
                                            bullet={incident.resolved_at ? <IconCheck size={12} /> : <IconX size={12} />}
                                            title={incident.resolved_at ? 'Resolved' : 'Active Incident'}
                                            color={incident.resolved_at ? 'green' : 'red'}
                                        >
                                            <Text c="dimmed" size="sm">
                                                {incident.error_message}
                                            </Text>
                                            <Text size="xs" mt={4} c="dimmed">
                                                Started: {incident.started_at}
                                            </Text>
                                            {incident.resolved_at && (
                                                <Text size="xs" c="dimmed">
                                                    Resolved: {incident.resolved_at} ({incident.duration})
                                                </Text>
                                            )}
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            )}
                        </Card>
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
                                <Paper p="xl" withBorder style={{ textAlign: 'center' }} bg="gray.0">
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
                </Tabs>

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
            </Stack>
        </AppLayout>
    );
}

export default MonitorShow;
