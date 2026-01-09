import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Title, Text, Grid, Card, Group, Badge, Stack, Paper, ThemeIcon, useMantineTheme } from '@mantine/core';
import { IconArrowUp, IconClock, IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard({ stats, uptimeData, responseTimeData }) {
    const theme = useMantineTheme();
    const isDark = theme.colorScheme === 'dark';

    console.log(stats)

    const statCards = [
        {
            title: 'Uptime (24h)',
            value: `${stats?.uptime_24h || 0}%`,
            icon: IconArrowUp,
            color: 'teal',
            trend: '+0.1%',
        },
        {
            title: 'Avg Response',
            value: `${stats?.avg_response || 0}ms`,
            icon: IconClock,
            color: 'blue',
            trend: '-12ms',
        },
        {
            title: 'Active Monitors',
            value: stats?.active_monitors || '0',
            icon: IconCheck,
            color: 'green',
            trend: '+2',
        },
        {
            title: 'Incidents',
            value: stats?.incidents || '0',
            icon: IconAlertTriangle,
            color: 'orange',
            trend: '0',
        },
    ];

    const defaultUptimeData = uptimeData || Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        uptime: 95 + Math.random() * 5,
    }));

    const defaultResponseData = responseTimeData || Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        response: 200 + Math.random() * 100,
    }));

    const gridColor = 'rgba(255,255,255,0.05)';
    const textColor = '#5c5f66';
    const tooltipBg = '#1A1B1E';
    const tooltipBorder = 'rgba(255,255,255,0.1)';
    const tooltipColor = '#fff';

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <div>
                        <Title order={1} fw={900} style={{ letterSpacing: '-1.5px', textTransform: 'uppercase' }}>
                            Infrastructure <span style={{ color: 'var(--mantine-primary-color-filled)' }}>Status</span>
                        </Title>
                        <Text c="dimmed" size="xs" fw={700} tt="uppercase" mt={4} style={{ letterSpacing: '1px' }}>
                            Real-time monitoring console • Live Feed
                        </Text>
                    </div>
                    <Badge variant="dot" color="green" size="lg">SYSTEMS STABLE</Badge>
                </Group>

                <Grid>
                    {statCards.map((stat) => (
                        <Grid.Col key={stat.title} span={{ base: 12, xs: 6, md: 3 }}>
                            <Card padding="lg">
                                <Group justify="space-between" mb="md">
                                    <ThemeIcon
                                        size="xl"
                                        radius="md"
                                        variant="filled"
                                        color={stat.color}
                                    >
                                        <stat.icon size={24} stroke={1.5} />
                                    </ThemeIcon>
                                    <Badge color={stat.color} variant="light" size="sm">
                                        {stat.trend}
                                    </Badge>
                                </Group>
                                <Text size="xs" c="dimmed" fw={800} tt="uppercase" mb={4} style={{ letterSpacing: '0.5px' }}>
                                    {stat.title}
                                </Text>
                                <Text size="2.5rem" fw={900} style={{ lineHeight: 1, fontFamily: 'var(--mantine-font-family-monospace)' }}>
                                    {stat.value}
                                </Text>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Card padding="xl" h="100%">
                            <Group justify="space-between" mb="xl">
                                <div>
                                    <Title order={4} fw={800} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                                        Regional Latency
                                    </Title>
                                    <Text size="xs" c="dimmed" fw={700}>
                                        NETWORK PROPAGATION DELAY
                                    </Text>
                                </div>
                            </Group>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={defaultUptimeData}>
                                    <defs>
                                        <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--mantine-color-green-6)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--mantine-color-green-6)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                    <XAxis dataKey="time" stroke={textColor} fontSize={10} fw={700} />
                                    <YAxis stroke={textColor} fontSize={10} fw={700} domain={[90, 100]} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: tooltipBg,
                                            border: `1px solid ${tooltipBorder}`,
                                            borderRadius: '8px',
                                            color: tooltipColor
                                        }}
                                        itemStyle={{ color: tooltipColor }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="uptime"
                                        stroke="var(--mantine-color-green-6)"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorUptime)"
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card padding="xl" h="100%">
                            <Title order={4} fw={800} tt="uppercase" mb="xs" style={{ letterSpacing: '0.5px' }}>
                                Response Dynamics
                            </Title>
                            <Text size="xs" c="dimmed" fw={700} mb="xl">
                                PACKET ROUND-TRIP PERFORMANCE
                            </Text>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={defaultResponseData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                    <XAxis dataKey="time" stroke={textColor} fontSize={10} fw={700} />
                                    <YAxis stroke={textColor} fontSize={10} fw={700} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: tooltipBg,
                                            border: `1px solid ${tooltipBorder}`,
                                            borderRadius: '8px',
                                            color: tooltipColor
                                        }}
                                        itemStyle={{ color: tooltipColor }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="response"
                                        stroke="var(--mantine-color-blue-6)"
                                        strokeWidth={3}
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Grid.Col>
                </Grid>

                <Card padding="xl">
                    <Group justify="space-between" mb="md">
                        <div>
                            <Title order={4} fw={800} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                                Operational Event Log
                            </Title>
                            <Text size="xs" c="dimmed" fw={700}>
                                SECURITY & PERFORMANCE AUDIT TRAIL
                            </Text>
                        </div>
                    </Group>
                    <Paper p="xl" radius="md" bg="rgba(255,255,255,0.02)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }} mt="md">
                        <Group gap="md">
                            <ThemeIcon color="green" variant="light" size="lg" radius="xl">
                                <IconCheck size={20} />
                            </ThemeIcon>
                            <Stack gap={0}>
                                <Text size="sm" fw={800} c="green.4">ALL SYSTEMS NOMINAL</Text>
                                <Text size="xs" c="dimmed" fw={600}>
                                    No anomalies detected in the last 168 hours of operation.
                                </Text>
                            </Stack>
                        </Group>
                    </Paper>
                </Card>
            </Stack>
        </AppLayout>
    );
}

export default Dashboard;
