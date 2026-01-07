import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Title,
    Text,
    Button,
    Card,
    Group,
    Stack,
    Badge,
    Grid,
    Paper,
    Divider,
    ThemeIcon,
    ActionIcon,
    Tooltip,
} from '@mantine/core';
import { Link, router } from '@inertiajs/react';
import {
    IconFileText,
    IconTrash,
    IconChevronRight,
    IconCalendarTime,
    IconAlertCircle,
    IconSearch
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function PostMortemIndex({ postMortems }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this report?')) {
            router.delete(route('post-mortems.destroy', id), {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Report deleted',
                        color: 'green',
                    });
                },
            });
        }
    };

    const getSeverityColor = (severity) => {
        const colors = {
            low: 'gray',
            medium: 'blue',
            high: 'orange',
            critical: 'red',
        };
        return colors[severity] || 'gray';
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <div>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            Post-Mortem Reports
                        </Title>
                        <Text c="dimmed" size="sm">
                            Analyze past incidents to improve your infrastructure and team response.
                        </Text>
                    </div>
                </Group>

                <Grid gutter="md">
                    {postMortems.length > 0 ? postMortems.map((report) => (
                        <Grid.Col key={report.id} span={{ base: 12, md: 6 }}>
                            <Card shadow="sm" radius="md" withBorder p="lg">
                                <Group justify="space-between" mb="xs">
                                    <Badge color={getSeverityColor(report.severity)} variant="light">
                                        {report.severity.toUpperCase()}
                                    </Badge>
                                    <Text size="xs" c="dimmed">
                                        Published: {new Date(report.published_at).toLocaleDateString()}
                                    </Text>
                                </Group>

                                <Title order={4} mb="xs">{report.title}</Title>
                                <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                                    {report.summary}
                                </Text>

                                <Divider mb="md" variant="dotted" />

                                <Group justify="space-between">
                                    <Stack gap={2}>
                                        <Text size="xs" fw={700} c="dimmed">MONITOR</Text>
                                        <Text size="sm" fw={600}>{report.incident.monitor.name}</Text>
                                    </Stack>
                                    <Group gap="xs">
                                        <Button
                                            variant="light"
                                            size="xs"
                                            rightSection={<IconChevronRight size={14} />}
                                            component={Link}
                                            href={route('post-mortems.show', report.id)}
                                        >
                                            View Report
                                        </Button>
                                        <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(report.id)}>
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Group>
                            </Card>
                        </Grid.Col>
                    )) : (
                        <Grid.Col span={12}>
                            <Card shadow="sm" radius="md" withBorder p="xl" style={{ textAlign: 'center' }}>
                                <IconFileText size={48} stroke={1.5} color="gray" style={{ margin: '0 auto 16px' }} />
                                <Text fw={600} mb="xs">No post-mortem reports yet</Text>
                                <Text size="sm" c="dimmed" mb="xl">
                                    Generate analysis reports from the Incidents page after resolving issues.
                                </Text>
                                <Button variant="light" component={Link} href="/incidents">Go to Incidents</Button>
                            </Card>
                        </Grid.Col>
                    )}
                </Grid>
            </Stack>
        </AppLayout>
    );
}
