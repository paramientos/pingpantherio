import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Title,
    Text,
    Button,
    Card,
    Group,
    Stack,
    Select,
    Grid,
    RingProgress,
    Badge,
    Table,
    Paper,
    rem,
    Divider,
} from '@mantine/core';
import { IconDownload, IconChartBar, IconClock, IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';
import { router } from '@inertiajs/react';

export default function ReportsAnalytics({ analytics, period, selectedMonitor, monitors }) {
    const [selectedPeriod, setSelectedPeriod] = useState(period);
    const [selectedMonitorId, setSelectedMonitorId] = useState(selectedMonitor);

    const handleFilterChange = () => {
        router.get(route('reports.analytics'), {
            period: selectedPeriod,
            monitor_id: selectedMonitorId,
        }, {
            preserveState: true,
        });
    };

    const handleExportPdf = () => {
        window.location.href = route('reports.export-pdf', {
            period: selectedPeriod,
            monitor_id: selectedMonitorId,
        });
    };

    const getUptimeColor = (uptime) => {
        if (uptime >= 99) return 'green';
        if (uptime >= 95) return 'yellow';
        return 'red';
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <div>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            Analytics & Reports
                        </Title>
                        <Text c="dimmed" size="sm">
                            Detailed uptime statistics and performance metrics
                        </Text>
                    </div>
                    <Button leftSection={<IconDownload size={16} />} onClick={handleExportPdf}>
                        Export PDF
                    </Button>
                </Group>

                <Card shadow="sm" radius="md" withBorder p="lg">
                    <Group gap="md" mb="xl">
                        <Select
                            label="Time Period"
                            data={[
                                { value: '7', label: 'Last 7 days' },
                                { value: '30', label: 'Last 30 days' },
                                { value: '90', label: 'Last 90 days' },
                            ]}
                            value={selectedPeriod}
                            onChange={setSelectedPeriod}
                            style={{ flex: 1 }}
                        />
                        <Select
                            label="Monitor"
                            placeholder="All monitors"
                            data={[{ value: '', label: 'All Monitors' }, ...monitors]}
                            value={selectedMonitorId || ''}
                            onChange={setSelectedMonitorId}
                            clearable
                            style={{ flex: 1 }}
                        />
                        <Button onClick={handleFilterChange} mt={24}>
                            Apply Filters
                        </Button>
                    </Group>
                </Card>

                {analytics.map((data) => (
                    <Card key={data.monitor_id} shadow="sm" radius="md" withBorder p="lg">
                        <Group justify="space-between" mb="xl">
                            <div>
                                <Text fw={700} size="xl">{data.monitor_name}</Text>
                                <Text size="sm" c="dimmed">{data.monitor_url}</Text>
                            </div>
                            <Badge
                                size="xl"
                                color={getUptimeColor(data.uptime_percentage)}
                                variant="light"
                                leftSection={<IconChartBar size={18} />}
                            >
                                {data.uptime_percentage}% Uptime
                            </Badge>
                        </Group>

                        <Grid gutter="md" mb="xl">
                            <Grid.Col span={4}>
                                <Paper withBorder p="md" radius="md" style={{ textAlign: 'center' }}>
                                    <RingProgress
                                        size={120}
                                        thickness={12}
                                        sections={[
                                            { value: data.uptime_percentage, color: getUptimeColor(data.uptime_percentage) }
                                        ]}
                                        label={
                                            <div style={{ textAlign: 'center' }}>
                                                <Text fw={700} size="xl">{data.uptime_percentage}%</Text>
                                                <Text size="xs" c="dimmed">Uptime</Text>
                                            </div>
                                        }
                                        style={{ margin: '0 auto' }}
                                    />
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <Grid gutter="md">
                                    <Grid.Col span={6}>
                                        <Paper withBorder p="md" radius="md">
                                            <Group gap="xs" mb="xs">
                                                <IconClock size={20} color="#6366f1" />
                                                <Text size="xs" fw={600} c="dimmed">AVG RESPONSE TIME</Text>
                                            </Group>
                                            <Text fw={700} size="xl">{data.avg_response_time}ms</Text>
                                            <Text size="xs" c="dimmed">Min: {data.min_response_time}ms | Max: {data.max_response_time}ms</Text>
                                        </Paper>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Paper withBorder p="md" radius="md">
                                            <Group gap="xs" mb="xs">
                                                <IconCheck size={20} color="#10b981" />
                                                <Text size="xs" fw={600} c="dimmed">TOTAL CHECKS</Text>
                                            </Group>
                                            <Text fw={700} size="xl">{data.total_checks}</Text>
                                            <Text size="xs" c="dimmed">
                                                <span style={{ color: '#10b981' }}>{data.successful_checks} passed</span> |
                                                <span style={{ color: '#ef4444' }}> {data.failed_checks} failed</span>
                                            </Text>
                                        </Paper>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Paper withBorder p="md" radius="md">
                                            <Group gap="xs" mb="xs">
                                                <IconAlertTriangle size={20} color="#f59e0b" />
                                                <Text size="xs" fw={600} c="dimmed">INCIDENTS</Text>
                                            </Group>
                                            <Text fw={700} size="xl">{data.total_incidents}</Text>
                                            <Text size="xs" c="dimmed">Total downtime events</Text>
                                        </Paper>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Paper withBorder p="md" radius="md">
                                            <Group gap="xs" mb="xs">
                                                <IconX size={20} color="#ef4444" />
                                                <Text size="xs" fw={600} c="dimmed">DOWNTIME</Text>
                                            </Group>
                                            <Text fw={700} size="xl">{data.total_downtime_hours}h</Text>
                                            <Text size="xs" c="dimmed">{data.total_downtime_minutes} minutes total</Text>
                                        </Paper>
                                    </Grid.Col>
                                </Grid>
                            </Grid.Col>
                        </Grid>
                    </Card>
                ))}

                {analytics.length === 0 && (
                    <Card shadow="sm" radius="md" withBorder p="xl" style={{ textAlign: 'center' }}>
                        <IconChartBar size={48} stroke={1.5} color="gray" style={{ margin: '0 auto 16px' }} />
                        <Text fw={600} mb="xs">No data available</Text>
                        <Text size="sm" c="dimmed">
                            There are no monitors or no data for the selected period.
                        </Text>
                    </Card>
                )}
            </Stack>
        </AppLayout>
    );
}
