import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Title, Text, Grid, Card, Group, Badge, Stack, Paper, ThemeIcon, useMantineTheme, Table, Anchor, Alert, Center, Button } from '@mantine/core';
import { IconArrowUp, IconClock, IconAlertTriangle, IconCheck, IconTrendingUp, IconActivity, IconLock, IconUsers } from '@tabler/icons-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link, usePage, router, Deferred } from '@inertiajs/react';
import { Skeleton } from '@mantine/core';

function Dashboard({ stats, uptimeData, responseTimeData, monitorDistribution, incidentTimeline, slowestMonitors, recentIncidents, hasTeam, pendingInvitations }) {
    const theme = useMantineTheme();
    const { auth } = usePage().props;
    const isDark = theme.colorScheme === 'dark';

    const handleAcceptInvite = (token) => {
        router.get(route('invitations.accept', { token }));
    };

    const handleRejectInvite = (token) => {
        router.post(route('invitations.reject', { token }));
    };

    if (auth.user.role !== 'admin' && !hasTeam) {
        return (
            <AppLayout>
                <Center style={{ height: '70vh' }}>
                    <Stack align="center" gap="md" style={{ maxWidth: 450 }}>
                        {pendingInvitations && pendingInvitations.length > 0 ? (
                            <Paper p="xl" withBorder radius="md" bg="rgba(255,255,255,0.02)">
                                <Stack align="center" gap="md">
                                    <ThemeIcon size={60} radius="xl" color="indigo" variant="light">
                                        <IconUsers size={30} />
                                    </ThemeIcon>
                                    <Title order={3} ta="center">Team Invitation Received</Title>
                                    <Text c="dimmed" ta="center">
                                        You have been invited to a team. You must accept the invitation to access the system.
                                    </Text>

                                    {pendingInvitations.map((inv) => (
                                        <Card key={inv.id} withBorder w="100%" p="md">
                                            <Group justify="space-between">
                                                <div>
                                                    <Text fw={700}>{inv.team_name}</Text>
                                                    <Text size="xs" c="dimmed">Role: {inv.role}</Text>
                                                </div>
                                                <Group gap="xs">
                                                    <Button variant="light" color="red" size="xs" onClick={() => handleRejectInvite(inv.token)}>Reject</Button>
                                                    <Button color="green" size="xs" onClick={() => handleAcceptInvite(inv.token)}>Accept</Button>
                                                </Group>
                                            </Group>
                                        </Card>
                                    ))}
                                </Stack>
                            </Paper>
                        ) : (
                            <Stack align="center" gap="md">
                                <ThemeIcon size={80} radius="xl" color="orange" variant="light">
                                    <IconLock size={40} />
                                </ThemeIcon>
                                <Title order={2} ta="center">Access Restricted</Title>
                                <Text c="dimmed" ta="center">
                                    You are not a member of any team. To access the system fully, you must be added to a team by an administrator.
                                </Text>
                                <Button component={Link} href="/settings/profile" variant="light">
                                    Profile Settings
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </Center>
            </AppLayout>
        );
    }

    console.log(stats)

    const statCards = [
        {
            title: 'Uptime (24h)',
            value: `${stats?.uptime_24h || 0}% `,
            icon: IconArrowUp,
            color: 'teal',
            trend: '+0.1%',
        },
        {
            title: 'Avg Response',
            value: `${stats?.avg_response || 0} ms`,
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
                {pendingInvitations && pendingInvitations.length > 0 && (
                    <Alert
                        variant="light"
                        color="indigo"
                        title="Pending Team Invitations"
                        icon={<IconUsers size={18} />}
                        withCloseButton
                    >
                        <Stack gap="xs">
                            <Text size="sm">You have received invitations from the following teams:</Text>
                            {pendingInvitations.map((inv) => (
                                <Group key={inv.id} justify="space-between">
                                    <Text size="sm" fw={700}>{inv.team_name} ({inv.role})</Text>
                                    <Group gap="xs">
                                        <Button variant="subtle" color="red" size="xs" onClick={() => handleRejectInvite(inv.token)}>Reject</Button>
                                        <Button variant="light" color="green" size="xs" onClick={() => handleAcceptInvite(inv.token)}>Accept</Button>
                                    </Group>
                                </Group>
                            ))}
                        </Stack>
                    </Alert>
                )}

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

                <Deferred data="stats" fallback={
                    <Grid>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Grid.Col key={i} span={{ base: 12, xs: 6, md: 3 }}>
                                <Card padding="lg">
                                    <Skeleton height={40} width={40} mb="md" />
                                    <Skeleton height={10} width="60%" mb={8} />
                                    <Skeleton height={40} width="80%" />
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                }>
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
                </Deferred>


                <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Deferred data="monitorDistribution" fallback={
                            <Card padding="xl" h="100%">
                                <Skeleton height={20} width="40%" mb="xs" />
                                <Skeleton height={10} width="30%" mb="xl" />
                                <Skeleton height={250} circle mx="auto" />
                            </Card>
                        }>
                            <Card padding="xl" h="100%">
                                <Title order={4} fw={800} tt="uppercase" mb="xs" style={{ letterSpacing: '0.5px' }}>
                                    Monitor Distribution
                                </Title>
                                <Text size="xs" c="dimmed" fw={700} mb="xl">
                                    STATUS BREAKDOWN
                                </Text>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={monitorDistribution || []}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {(monitorDistribution || []).map((entry, index) => (
                                                <Cell key={`cell - ${index} `} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: tooltipBg,
                                                border: `1px solid ${tooltipBorder} `,
                                                borderRadius: '8px',
                                                color: tooltipColor
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Deferred>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Deferred data="incidentTimeline" fallback={
                            <Card padding="xl" h="100%">
                                <Skeleton height={20} width="40%" mb="xs" />
                                <Skeleton height={10} width="30%" mb="xl" />
                                <Skeleton height={250} />
                            </Card>
                        }>
                            <Card padding="xl" h="100%">
                                <Title order={4} fw={800} tt="uppercase" mb="xs" style={{ letterSpacing: '0.5px' }}>
                                    Incident Timeline (7 Days)
                                </Title>
                                <Text size="xs" c="dimmed" fw={700} mb="xl">
                                    DAILY INCIDENT COUNT
                                </Text>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={incidentTimeline || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                        <XAxis dataKey="date" stroke={textColor} fontSize={10} fw={700} />
                                        <YAxis stroke={textColor} fontSize={10} fw={700} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: tooltipBg,
                                                border: `1px solid ${tooltipBorder} `,
                                                borderRadius: '8px',
                                                color: tooltipColor
                                            }}
                                        />
                                        <Bar dataKey="incidents" fill="var(--mantine-color-red-6)" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Deferred>
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Deferred data="slowestMonitors" fallback={
                            <Card padding="xl" h="100%">
                                <Skeleton height={20} width="40%" mb="xs" />
                                <Skeleton height={10} width="30%" mb="xl" />
                                <Skeleton height={250} />
                            </Card>
                        }>
                            <Card padding="xl" h="100%">
                                <Group justify="space-between" mb="xl">
                                    <div>
                                        <Title order={4} fw={800} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                                            Slowest Monitors
                                        </Title>
                                        <Text size="xs" c="dimmed" fw={700}>
                                            AVG RESPONSE TIME (24H)
                                        </Text>
                                    </div>
                                    <ThemeIcon color="orange" variant="light" size="lg">
                                        <IconTrendingUp size={20} />
                                    </ThemeIcon>
                                </Group>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={slowestMonitors || []} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                                        <XAxis type="number" stroke={textColor} fontSize={10} />
                                        <YAxis type="category" dataKey="name" stroke={textColor} fontSize={10} width={100} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: tooltipBg,
                                                border: `1px solid ${tooltipBorder} `,
                                                borderRadius: '8px',
                                                color: tooltipColor
                                            }}
                                        />
                                        <Bar dataKey="response_time" fill="var(--mantine-color-orange-6)" radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Deferred>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Deferred data="recentIncidents" fallback={
                            <Card padding="xl" h="100%">
                                <Skeleton height={20} width="40%" mb="xs" />
                                <Skeleton height={10} width="30%" mb="md" />
                                <Stack gap="xs">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} height={60} radius="md" />
                                    ))}
                                </Stack>
                            </Card>
                        }>
                            <Card padding="xl" h="100%">
                                <Group justify="space-between" mb="md">
                                    <div>
                                        <Title order={4} fw={800} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                                            Recent Incidents
                                        </Title>
                                        <Text size="xs" c="dimmed" fw={700}>
                                            LATEST ALERTS
                                        </Text>
                                    </div>
                                    <ThemeIcon color="red" variant="light" size="lg">
                                        <IconActivity size={20} />
                                    </ThemeIcon>
                                </Group>
                                <Stack gap="xs" style={{ maxHeight: 300, overflowY: 'auto' }}>
                                    {recentIncidents && recentIncidents.length > 0 ? (
                                        recentIncidents.map((incident) => (
                                            <Paper key={incident.id} p="sm" radius="md" withBorder>
                                                <Group justify="space-between" mb={4}>
                                                    <Text size="sm" fw={600}>{incident.monitor_name}</Text>
                                                    <Badge color={incident.is_resolved ? 'green' : 'red'} size="xs">
                                                        {incident.is_resolved ? 'Resolved' : 'Active'}
                                                    </Badge>
                                                </Group>
                                                <Text size="xs" c="dimmed" lineClamp={1}>{incident.error}</Text>
                                                <Text size="xs" c="dimmed" mt={4}>
                                                    {incident.started_at}
                                                    {incident.is_resolved && ` → ${incident.resolved_at} `}
                                                </Text>
                                            </Paper>
                                        ))
                                    ) : (
                                        <Paper p="xl" radius="md" bg="rgba(255,255,255,0.02)" withBorder style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                            <Group gap="md">
                                                <ThemeIcon color="green" variant="light" size="lg" radius="xl">
                                                    <IconCheck size={20} />
                                                </ThemeIcon>
                                                <Stack gap={0}>
                                                    <Text size="sm" fw={800} c="green.4">ALL SYSTEMS NOMINAL</Text>
                                                    <Text size="xs" c="dimmed" fw={600}>
                                                        No incidents detected recently.
                                                    </Text>
                                                </Stack>
                                            </Group>
                                        </Paper>
                                    )}
                                </Stack>
                            </Card>
                        </Deferred>
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Deferred data="uptimeData" fallback={
                            <Card padding="xl" h="100%">
                                <Skeleton height={20} width="40%" mb="xs" />
                                <Skeleton height={10} width="30%" mb="xl" />
                                <Skeleton height={300} />
                            </Card>
                        }>
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
                                    <AreaChart data={uptimeData}>
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
                                                border: `1px solid ${tooltipBorder} `,
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
                        </Deferred>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Deferred data="responseTimeData" fallback={
                            <Card padding="xl" h="100%">
                                <Skeleton height={20} width="40%" mb="xs" />
                                <Skeleton height={10} width="30%" mb="xl" />
                                <Skeleton height={300} />
                            </Card>
                        }>
                            <Card padding="xl" h="100%">
                                <Title order={4} fw={800} tt="uppercase" mb="xs" style={{ letterSpacing: '0.5px' }}>
                                    Response Dynamics
                                </Title>
                                <Text size="xs" c="dimmed" fw={700} mb="xl">
                                    PACKET ROUND-TRIP PERFORMANCE
                                </Text>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={responseTimeData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                        <XAxis dataKey="time" stroke={textColor} fontSize={10} fw={700} />
                                        <YAxis stroke={textColor} fontSize={10} fw={700} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: tooltipBg,
                                                border: `1px solid ${tooltipBorder} `,
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
                        </Deferred>
                    </Grid.Col>
                </Grid>

            </Stack>
        </AppLayout>
    );
}

export default Dashboard;
