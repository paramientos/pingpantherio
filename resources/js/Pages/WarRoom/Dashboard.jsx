import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Title,
    Text,
    Grid,
    Card,
    Group,
    Badge,
    Stack,
    ThemeIcon,
    SimpleGrid,
    Paper,
    Center,
    Box,
} from '@mantine/core';
import {
    IconActivity,
    IconCheck,
    IconX,
    IconAlertTriangle,
    IconClock,
    IconArrowUpRight,
    IconMaximize,
    IconMinimize,
} from '@tabler/icons-react';
import {
    AreaChart,
    Area,
    ResponsiveContainer,
} from 'recharts';

const styles = `
    @keyframes pulse-red {
        0% { box-shadow: 0 0 0 0 rgba(250, 82, 82, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(250, 82, 82, 0); }
        100% { box-shadow: 0 0 0 0 rgba(250, 82, 82, 0); }
    }
    @keyframes pulse-green {
        0% { box-shadow: 0 0 0 0 rgba(18, 184, 134, 0.2); }
        70% { box-shadow: 0 0 0 10px rgba(18, 184, 134, 0); }
        100% { box-shadow: 0 0 0 0 rgba(18, 184, 134, 0); }
    }
    .war-room-card {
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .war-room-card:hover {
        transform: translateY(-4px);
        background: rgba(255,255,255,0.04) !important;
    }
`;

export default function WarRoomDashboard({ monitors, activeIncidents, stats }) {
    // Auto-refresh every 15 seconds for War Room
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['monitors', 'activeIncidents', 'stats'] });
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    return (
        <Box bg="#050505" style={{ minHeight: '100vh', color: '#fff', overflow: 'auto' }} p="xl">
            <style>{styles}</style>
            <Head title="Operations War Room" />

            <Stack gap="xl">
                {/* Header */}
                <Group justify="space-between">
                    <Stack gap={0}>
                        <Group gap="xs">
                            <ThemeIcon variant="transparent" color="orange" size="lg">
                                <IconActivity size={32} />
                            </ThemeIcon>
                            <Title order={1} fw={900} style={{ letterSpacing: '-1px' }}>
                                WAR ROOM <span style={{ color: 'var(--mantine-color-orange-6)' }}>COMMAND</span>
                            </Title>
                        </Group>
                        <Text c="dimmed" size="xs" fw={700} tt="uppercase" mt={4}>
                            Real-time Infrastructure Monitoring • Live Status
                        </Text>
                    </Stack>

                    <Group gap="xl">
                        <Stack align="flex-end" gap={0}>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">System Time</Text>
                            <Text fw={900} size="xl">{new Date().toLocaleTimeString()}</Text>
                        </Stack>
                        <ThemeIcon
                            onClick={toggleFullscreen}
                            style={{ cursor: 'pointer' }}
                            variant="light"
                            color="gray"
                            size="lg"
                        >
                            <IconMaximize size={20} />
                        </ThemeIcon>
                    </Group>
                </Group>

                {/* KPI Ribbon */}
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                    <Paper bg="rgba(255,255,255,0.03)" p="xl" radius="md" withBorder style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <Group justify="space-between" mb="xs">
                            <Text size="sm" fw={700} c="green.4" tt="uppercase">Operational</Text>
                            <IconCheck color="var(--mantine-color-green-4)" />
                        </Group>
                        <Title order={1} size={48} fw={900}>{stats.up_count}</Title>
                        <Text size="xs" c="dimmed">Active monitors currently responding successfully</Text>
                    </Paper>

                    <Paper bg="rgba(255,255,255,0.03)" p="xl" radius="md" withBorder style={{ borderColor: stats.down_count > 0 ? 'var(--mantine-color-red-6)' : 'rgba(255,255,255,0.1)' }}>
                        <Group justify="space-between" mb="xs">
                            <Text size="sm" fw={700} c="red.6" tt="uppercase">Incidents</Text>
                            <IconAlertTriangle color="var(--mantine-color-red-6)" />
                        </Group>
                        <Title order={1} size={48} fw={900} c={stats.down_count > 0 ? 'red.6' : 'white'}>{stats.down_count}</Title>
                        <Text size="xs" c="dimmed">Active outages requiring immediate attention</Text>
                    </Paper>

                    <Paper bg="rgba(255,255,255,0.03)" p="xl" radius="md" withBorder style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <Group justify="space-between" mb="xs">
                            <Text size="sm" fw={700} c="blue.4" tt="uppercase">Global Latency</Text>
                            <IconClock color="var(--mantine-color-blue-4)" />
                        </Group>
                        <Title order={1} size={48} fw={900}>{stats.avg_response}ms</Title>
                        <Text size="xs" c="dimmed">Average response time across all regions</Text>
                    </Paper>
                </SimpleGrid>

                <Grid gutter="xl">
                    {/* Monitor Grid */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Card bg="transparent" p={0}>
                            <Title order={3} mb="lg" fw={800}>Infrastructure Matrix</Title>
                            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                                {monitors.map((monitor) => (
                                    <Paper
                                        key={monitor.id}
                                        className="war-room-card"
                                        bg="rgba(255,255,255,0.02)"
                                        p="md"
                                        radius="md"
                                        withBorder
                                        style={{
                                            borderColor: monitor.status === 'down' ? 'var(--mantine-color-red-8)' : 'rgba(255,255,255,0.05)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            animation: monitor.status === 'down' ? 'pulse-red 2s infinite' : 'pulse-green 4s infinite'
                                        }}
                                    >
                                        {monitor.status === 'down' && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 2,
                                                background: 'red',
                                                boxShadow: '0 0 10px red'
                                            }} />
                                        )}

                                        <Group justify="space-between" mb="md" wrap="nowrap">
                                            <Stack gap={0} style={{ overflow: 'hidden' }}>
                                                <Text fw={800} size="sm" span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {monitor.name}
                                                </Text>
                                                <Text size="xs" c="dimmed" ff="monospace" span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {monitor.last_checked_at}
                                                </Text>
                                            </Stack>
                                            <Badge
                                                variant="filled"
                                                color={monitor.status === 'up' ? 'green.9' : 'red.9'}
                                                size="sm"
                                            >
                                                {monitor.status.toUpperCase()}
                                            </Badge>
                                        </Group>

                                        <Group gap="xs" mb="lg">
                                            <Text size="h4" fw={900} style={{ fontFamily: 'monospace' }}>
                                                {monitor.last_response_time || 0}
                                                <span style={{ fontSize: '10px', marginLeft: '2px', color: 'var(--mantine-color-dimmed)' }}>ms</span>
                                            </Text>
                                        </Group>

                                        <Box h={40}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={monitor.history}>
                                                    <defs>
                                                        <linearGradient id={`grad-${monitor.id}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={monitor.status === 'up' ? '#12b886' : '#fa5252'} stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor={monitor.status === 'up' ? '#12b886' : '#fa5252'} stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <Area
                                                        type="monotone"
                                                        dataKey="value"
                                                        stroke={monitor.status === 'up' ? '#12b886' : '#fa5252'}
                                                        fill={`url(#grad-${monitor.id})`}
                                                        strokeWidth={2}
                                                        isAnimationActive={false}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </Paper>
                                ))}
                            </SimpleGrid>
                        </Card>
                    </Grid.Col>

                    {/* Active Incidents Feed */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card bg="rgba(255,255,255,0.01)" withBorder style={{ borderColor: 'rgba(255,255,255,0.1)', height: '100%' }} p="xl">
                            <Title order={3} mb="xl" fw={800} c="red.6">Active Feed</Title>

                            {activeIncidents.length === 0 ? (
                                <Center p="xl" style={{ flex: 1 }}>
                                    <Stack align="center" gap="xs">
                                        <IconCheck size={48} color="var(--mantine-color-green-4)" opacity={0.5} />
                                        <Text c="dimmed" size="sm">No active threats detected</Text>
                                        <Text size="xs" c="green.4" fw={700}>SYSTEMS STABLE</Text>
                                    </Stack>
                                </Center>
                            ) : (
                                <Stack gap="md">
                                    {activeIncidents.map((incident) => (
                                        <Paper
                                            key={incident.id}
                                            p="md"
                                            radius="md"
                                            bg="rgba(250, 82, 82, 0.05)"
                                            withBorder
                                            style={{ borderColor: 'var(--mantine-color-red-9)' }}
                                        >
                                            <Group justify="space-between" mb={4}>
                                                <Text fw={800} size="sm" c="red.4">{incident.monitor_name}</Text>
                                                <Text size="xs" c="dimmed">{incident.started_at}</Text>
                                            </Group>
                                            <Text size="xs" lineClamp={2}>{incident.message}</Text>
                                            <Group mt="xs" gap={4}>
                                                <IconArrowUpRight size={10} color="var(--mantine-color-red-6)" />
                                                <Text size="10px" fw={700} tt="uppercase" c="red.6">Major Outage</Text>
                                            </Group>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}

                            <Box mt="auto" pt="xl">
                                <Paper p="md" bg="rgba(255,255,255,0.03)" radius="md">
                                    <Group justify="space-between">
                                        <Text size="xs" fw={700} c="dimmed">NETWORK HEALTH</Text>
                                        <Text size="xs" fw={700} c="green">99.98%</Text>
                                    </Group>
                                    <Box h={4} bg="rgba(255,255,255,0.1)" mt={8} radius="xl" style={{ overflow: 'hidden' }}>
                                        <Box h="100%" w="99%" bg="green" />
                                    </Box>
                                </Paper>
                            </Box>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Box>
    );
}
