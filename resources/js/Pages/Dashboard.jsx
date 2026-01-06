import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Title, Text, Grid, Card, Group, Badge, Stack, Paper, ThemeIcon } from '@mantine/core';
import { IconArrowUp, IconClock, IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard({ stats, uptimeData, responseTimeData }) {
    const statCards = [
        {
            title: 'Uptime (24h)',
            value: `${stats?.uptime_24h || 99.9}%`,
            icon: IconArrowUp,
            color: 'teal',
            trend: '+0.1%',
        },
        {
            title: 'Avg Response',
            value: `${stats?.avg_response || 245}ms`,
            icon: IconClock,
            color: 'blue',
            trend: '-12ms',
        },
        {
            title: 'Active Monitors',
            value: stats?.active_monitors || '12',
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

    return (
        <AppLayout>
            <Stack gap="xl">
                <div>
                    <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                        System Overview
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Monitor your infrastructure health and performance in real-time
                    </Text>
                </div>

                <Grid>
                    {statCards.map((stat) => (
                        <Grid.Col key={stat.title} span={{ base: 12, xs: 6, md: 3 }}>
                            <Card padding="lg" radius="md">
                                <Group justify="space-between" mb="md">
                                    <ThemeIcon
                                        size="xl"
                                        radius="md"
                                        variant="light"
                                        color={stat.color}
                                    >
                                        <stat.icon size={24} stroke={1.5} />
                                    </ThemeIcon>
                                    <Badge color={stat.color} variant="light" size="sm">
                                        {stat.trend}
                                    </Badge>
                                </Group>
                                <Text size="xs" c="dimmed" fw={600} tt="uppercase" mb={4}>
                                    {stat.title}
                                </Text>
                                <Text size="xl" fw={900} style={{ lineHeight: 1 }}>
                                    {stat.value}
                                </Text>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Card padding="lg" radius="md" h="100%">
                            <Group justify="space-between" mb="md">
                                <div>
                                    <Title order={4} fw={700}>
                                        Uptime (Last 24 Hours)
                                    </Title>
                                    <Text size="xs" c="dimmed">
                                        Real-time uptime percentage
                                    </Text>
                                </div>
                                <Badge color="green" variant="dot">
                                    All Systems Operational
                                </Badge>
                            </Group>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={defaultUptimeData}>
                                    <defs>
                                        <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#12b886" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#12b886" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                                    <XAxis dataKey="time" stroke="#868e96" fontSize={12} />
                                    <YAxis stroke="#868e96" fontSize={12} domain={[90, 100]} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e9ecef',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="uptime"
                                        stroke="#12b886"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorUptime)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card padding="lg" radius="md" h="100%">
                            <Title order={4} fw={700} mb="md">
                                Response Time
                            </Title>
                            <Text size="xs" c="dimmed" mb="md">
                                Average response time (ms)
                            </Text>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={defaultResponseData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                                    <XAxis dataKey="time" stroke="#868e96" fontSize={12} />
                                    <YAxis stroke="#868e96" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e9ecef',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="response"
                                        stroke="#228be6"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Grid.Col>
                </Grid>

                <Card padding="lg" radius="md">
                    <Group justify="space-between" mb="md">
                        <div>
                            <Title order={4} fw={700}>
                                Operational Log
                            </Title>
                            <Text size="xs" c="dimmed">
                                Recent system events and incidents
                            </Text>
                        </div>
                    </Group>
                    <Paper p="md" radius="sm" bg="gray.0" mt="md">
                        <Group gap="xs">
                            <ThemeIcon color="green" variant="light" size="sm" radius="xl">
                                <IconCheck size={14} />
                            </ThemeIcon>
                            <Text size="sm" c="dimmed">
                                No recent incidents. All monitors are running smoothly.
                            </Text>
                        </Group>
                    </Paper>
                </Card>
            </Stack>
        </AppLayout>
    );
}

export default Dashboard;
