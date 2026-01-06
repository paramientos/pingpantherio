import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Title,
    Text,
    Table,
    Badge,
    Group,
    Stack,
    Card,
    Grid,
    ThemeIcon,
    Paper,
    Pagination,
} from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconClock, IconActivity } from '@tabler/icons-react';

function IncidentsIndex({ incidents, stats }) {
    return (
        <AppLayout>
            <Stack gap="xl">
                <div>
                    <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                        Incidents
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Monitor downtime events and resolution history
                    </Text>
                </div>

                <Grid>
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
                                {stats.total}
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
                                Active Now
                            </Text>
                            <Text size="xl" fw={900} style={{ lineHeight: 1 }}>
                                {stats.active}
                            </Text>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6, md: 3 }}>
                        <Card padding="lg" radius="md">
                            <Group justify="space-between" mb="md">
                                <ThemeIcon size="xl" radius="md" variant="light" color="green">
                                    <IconCheck size={24} stroke={1.5} />
                                </ThemeIcon>
                            </Group>
                            <Text size="xs" c="dimmed" fw={600} tt="uppercase" mb={4}>
                                Resolved Today
                            </Text>
                            <Text size="xl" fw={900} style={{ lineHeight: 1 }}>
                                {stats.resolved_today}
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
                                Avg Resolution
                            </Text>
                            <Text size="xl" fw={900} style={{ lineHeight: 1 }}>
                                {stats.avg_resolution_time}
                            </Text>
                        </Card>
                    </Grid.Col>
                </Grid>

                <Card padding="0" radius="md">
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Monitor</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Error</Table.Th>
                                <Table.Th>Started</Table.Th>
                                <Table.Th>Duration</Table.Th>
                                <Table.Th>Resolved</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {incidents.data.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Stack align="center" gap="md">
                                            <ThemeIcon size={60} radius="xl" variant="light" color="green">
                                                <IconCheck size={32} />
                                            </ThemeIcon>
                                            <div>
                                                <Text size="lg" fw={600}>
                                                    No incidents recorded
                                                </Text>
                                                <Text c="dimmed" size="sm">
                                                    All your monitors are running smoothly
                                                </Text>
                                            </div>
                                        </Stack>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                incidents.data.map((incident) => (
                                    <Table.Tr key={incident.id}>
                                        <Table.Td>
                                            <div>
                                                <Text fw={600} size="sm">
                                                    {incident.monitor_name}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {incident.monitor_url}
                                                </Text>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                color={incident.is_active ? 'red' : 'green'}
                                                variant="light"
                                                leftSection={incident.is_active ? <IconAlertTriangle size={12} /> : <IconCheck size={12} />}
                                            >
                                                {incident.is_active ? 'Active' : 'Resolved'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="red" style={{ maxWidth: 300 }}>
                                                {incident.error_message}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {incident.started_at}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light" color="gray">
                                                {incident.duration}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {incident.resolved_at || '-'}
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>

                    {incidents.data.length > 0 && (
                        <Paper p="md">
                            <Group justify="center">
                                <Pagination
                                    total={incidents.last_page}
                                    value={incidents.current_page}
                                    onChange={(page) => router.get(`/incidents?page=${page}`)}
                                />
                            </Group>
                        </Paper>
                    )}
                </Card>
            </Stack>
        </AppLayout>
    );
}

export default IncidentsIndex;
