import React from 'react';
import { Head } from '@inertiajs/react';
import {
    Container,
    Title,
    Text,
    Card,
    Group,
    Badge,
    Stack,
    Paper,
    ThemeIcon,
    Timeline,
    Grid,
} from '@mantine/core';
import { IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';

function StatusPageShow({ statusPage, monitors, incidents }) {
    const allOperational = monitors.every(m => m.status === 'up');

    return (
        <>
            <Head title={statusPage.name} />

            <div style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-body)' }}>
                <Container size="lg" py="xl">
                    <Stack gap="xl">
                        {statusPage.logo_url && (
                            <img src={statusPage.logo_url} alt={statusPage.name} style={{ height: 60 }} />
                        )}

                        <div style={{ textAlign: 'center' }}>
                            <Title order={1} fw={900} mb="sm">
                                {statusPage.name}
                            </Title>
                            {statusPage.description && (
                                <Text c="dimmed" size="lg">
                                    {statusPage.description}
                                </Text>
                            )}
                        </div>

                        <Card padding="xl" radius="md" withBorder>
                            <Group justify="center" mb="xl">
                                <ThemeIcon
                                    size={60}
                                    radius="xl"
                                    variant="light"
                                    color={allOperational ? 'green' : 'red'}
                                >
                                    {allOperational ? <IconCheck size={32} /> : <IconX size={32} />}
                                </ThemeIcon>
                            </Group>
                            <Title order={2} ta="center" fw={700} mb="xs">
                                {allOperational ? 'All Systems Operational' : 'Some Systems Down'}
                            </Title>
                            <Text ta="center" c="dimmed">
                                Last updated: {new Date().toLocaleString()}
                            </Text>
                        </Card>

                        {statusPage.show_uptime && (
                            <Stack gap="md">
                                <Title order={3} fw={700}>
                                    Services
                                </Title>
                                {monitors.map((monitor) => (
                                    <Card key={monitor.id} padding="lg" radius="md" withBorder>
                                        <Group justify="space-between" mb="md">
                                            <div>
                                                <Text fw={600} size="lg">
                                                    {monitor.name}
                                                </Text>
                                                <Text size="sm" c="dimmed">
                                                    {monitor.url}
                                                </Text>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <Badge
                                                    color={monitor.status === 'up' ? 'green' : 'red'}
                                                    variant="light"
                                                    size="lg"
                                                    mb="xs"
                                                >
                                                    {monitor.status === 'up' ? 'Operational' : 'Down'}
                                                </Badge>
                                                <Text size="xs" c="dimmed">
                                                    {monitor.uptime_24h}% uptime
                                                </Text>
                                            </div>
                                        </Group>

                                        <Group gap={2} mt="md">
                                            {monitor.heartbeats.slice(0, 90).reverse().map((heartbeat, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        width: 4,
                                                        height: 40,
                                                        backgroundColor: heartbeat.is_up ? '#12b886' : '#fa5252',
                                                        borderRadius: 2,
                                                    }}
                                                    title={`${heartbeat.checked_at} - ${heartbeat.is_up ? 'UP' : 'DOWN'}`}
                                                />
                                            ))}
                                        </Group>
                                        <Group justify="space-between" mt="xs">
                                            <Text size="xs" c="dimmed">
                                                90 days ago
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                Today
                                            </Text>
                                        </Group>
                                    </Card>
                                ))}
                            </Stack>
                        )}

                        {statusPage.show_incidents && incidents.length > 0 && (
                            <Stack gap="md">
                                <Title order={3} fw={700}>
                                    Recent Incidents
                                </Title>
                                <Card padding="lg" radius="md" withBorder>
                                    <Timeline up={incidents.length} bulletSize={24} lineWidth={2}>
                                        {incidents.map((incident) => (
                                            <Timeline.Item
                                                key={incident.id}
                                                bullet={incident.resolved_at ? <IconCheck size={12} /> : <IconAlertTriangle size={12} />}
                                                title={incident.monitor_name}
                                                color={incident.resolved_at ? 'green' : 'red'}
                                            >
                                                <Text c="dimmed" size="sm" mb="md">
                                                    {incident.error_message}
                                                </Text>

                                                {incident.updates && incident.updates.length > 0 && (
                                                    <Stack gap="xs" mb="md" pl="md" style={{ borderLeft: '2px solid var(--mantine-color-dimmed)' }}>
                                                        {incident.updates.map((update) => (
                                                            <div key={update.id}>
                                                                <Group gap="xs">
                                                                    <Badge size="xs" variant="outline" color="blue">{update.type}</Badge>
                                                                    <Text size="xs" c="dimmed">{update.created_at}</Text>
                                                                </Group>
                                                                <Text size="sm" mt={2}>{update.message}</Text>
                                                            </div>
                                                        ))}
                                                    </Stack>
                                                )}

                                                <Group gap="xl">
                                                    <Text size="xs" c="dimmed">
                                                        Started: {incident.started_at}
                                                    </Text>
                                                    {incident.resolved_at && (
                                                        <Text size="xs" c="dimmed">
                                                            Resolved: {incident.resolved_at} ({incident.duration})
                                                        </Text>
                                                    )}
                                                </Group>
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                </Card>
                            </Stack>
                        )}

                        <Paper p="md" radius="sm" style={{ background: 'var(--mantine-color-dark-filled)' }} ta="center">
                            <Text size="sm" c="dimmed">
                                Powered by <strong>PingPanther</strong>
                            </Text>
                        </Paper>
                    </Stack>
                </Container>
            </div>
        </>
    );
}

export default StatusPageShow;
