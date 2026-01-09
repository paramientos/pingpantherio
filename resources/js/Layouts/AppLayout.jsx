import React, { useEffect } from 'react';
import { AppShell, Burger, Group, NavLink, Avatar, Menu, Text, rem, ActionIcon, ScrollArea, Divider, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, usePage, router } from '@inertiajs/react';
import {
    IconChartPie,
    IconDeviceDesktop,
    IconAlertTriangle,
    IconBroadcast,
    IconSettings,
    IconUsers,
    IconKey,
    IconLogout,
    IconBolt,
    IconClock,
    IconFileAnalytics,
    IconSettingsAutomation,
    IconLayoutDashboard,
    IconWorld,
    IconHistory,
    IconWebhook,
    IconSun,
    IconMoon,
    IconSearch,
    IconShieldCheck,
    IconTarget,
    IconHierarchy2,
    IconSwords,
    IconFileText,
    IconBook,
    IconCalendarStats,
    IconFocusCentered,
} from '@tabler/icons-react';
import { Spotlight, spotlight } from '@mantine/spotlight';
import '@mantine/spotlight/styles.css';

function AppLayout({ children }) {
    const [opened, { toggle }] = useDisclosure();
    const { auth, url } = usePage().props;

    useEffect(() => {
        const handleOpenSpotlight = () => {
            spotlight.open();
        };

        window.addEventListener('open-spotlight', handleOpenSpotlight);

        return () => {
            window.removeEventListener('open-spotlight', handleOpenSpotlight);
        };
    }, []);


    const monitoringItems = [
        { label: 'Overview', icon: IconChartPie, href: '/console' },
        { label: 'Monitors', icon: IconDeviceDesktop, href: '/monitors' },
        { label: 'War Room', icon: IconFocusCentered, href: '/war-room' },
        { label: 'Incidents', icon: IconAlertTriangle, href: '/incidents' },
        { label: 'Status Pages', icon: IconBroadcast, href: '/status-pages' },
    ];

    const infrastructureItems = [
        { label: 'SSL Certificates', icon: IconShieldCheck, href: '/ssl' },
        { label: 'Domains', icon: IconWorld, href: '/domains' },
        { label: 'Maintenance', icon: IconClock, href: '/maintenance-windows' },
    ];

    const analysisItems = [
        { label: 'Analytics', icon: IconFileAnalytics, href: '/reports-analytics' },
        { label: 'SLA Tracking', icon: IconTarget, href: '/sla' },
        { label: 'Dependency Map', icon: IconHierarchy2, href: '/dependencies' },
        //{ label: 'Competitor Watch', icon: IconSwords, href: '/competitors' },
        { label: 'Post-Mortems', icon: IconFileText, href: '/post-mortems' },
        { label: 'Incident Playbooks', icon: IconBook, href: '/playbooks' },
    ];

    const configurationItems = [
        { label: 'Alert Rules', icon: IconSettingsAutomation, href: '/alert-rules' },
        { label: 'On-Call Schedules', icon: IconCalendarStats, href: '/on-call' },
        { label: 'Escalation Policies', icon: IconSettingsAutomation, href: '/escalation-policies' },
        { label: 'Alert Channels', icon: IconBolt, href: '/alert-channels' },
    ];

    const settingsItems = [
        { label: 'Settings', icon: IconSettings, href: '/settings/notifications' },
        { label: 'Webhooks', icon: IconWebhook, href: '/settings/webhooks' },
        { label: 'Team', icon: IconUsers, href: '/settings/teams' },
        { label: 'API Keys', icon: IconKey, href: '/settings/api-keys' },
        { label: 'Audit Logs', icon: IconHistory, href: '/settings/audit-logs' },
    ];

    const spotlightActions = [
        {
            id: 'home',
            label: 'Home',
            description: 'Go to overview',
            onClick: () => router.visit('/'),
            leftSection: <IconChartPie size={18} />,
        },
        {
            id: 'monitors',
            label: 'Monitors',
            description: 'List all uptime monitors',
            onClick: () => router.visit('/monitors'),
            leftSection: <IconDeviceDesktop size={18} />,
        },
        {
            id: 'incidents',
            label: 'Incidents',
            description: 'View incident reports',
            onClick: () => router.visit('/incidents'),
            leftSection: <IconAlertTriangle size={18} />,
        },
        {
            id: 'status-pages',
            label: 'Status Pages',
            description: 'Manage public status pages',
            onClick: () => router.visit('/status-pages'),
            leftSection: <IconBroadcast size={18} />,
        },
        {
            id: 'ssl',
            label: 'SSL Certificates',
            description: 'Monitor certificate expirations',
            onClick: () => router.visit('/ssl'),
            leftSection: <IconShieldCheck size={18} />,
        },
        {
            id: 'escalation-policies',
            label: 'Escalation Policies',
            description: 'Define alert chains',
            onClick: () => router.visit('/escalation-policies'),
            leftSection: <IconSettingsAutomation size={18} />,
        },
        {
            id: 'settings',
            label: 'Settings',
            description: 'Update your preferences',
            onClick: () => router.visit('/settings/notifications'),
            leftSection: <IconSettings size={18} />,
        },
        {
            id: 'team',
            label: 'Team',
            description: 'Manage members',
            onClick: () => router.visit('/settings/teams'),
            leftSection: <IconUsers size={18} />,
        },
        {
            id: 'security',
            label: 'Security',
            description: 'Session management',
            onClick: () => router.visit('/settings/security'),
            leftSection: <IconShieldCheck size={18} />,
        },
    ];

    return (
        <AppShell
            header={{ height: 64 }}
            navbar={{
                width: 280,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
            bg="var(--mantine-color-body)"
        >
            <AppShell.Header>
                <Group h="100%" px="lg" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Group gap="xs">
                            <ThemeIcon
                                variant="filled"
                                color="orange"
                                size="lg"
                                radius="md"
                            >
                                <IconBolt size={20} />
                            </ThemeIcon>
                            <div>
                                <Text size="lg" fw={900} style={{ lineHeight: 1, letterSpacing: '-1px', textTransform: 'uppercase' }}>
                                    Ping<span style={{ color: 'var(--mantine-primary-color-filled)' }}>Panther</span>
                                </Text>
                                <Text size="10px" c="dimmed" fw={800} tt="uppercase" style={{ lineHeight: 1, letterSpacing: '0.5px' }}>
                                    Command Console
                                </Text>
                            </div>
                        </Group>
                    </Group>

                    <Group gap="sm">
                        <ActionIcon
                            onClick={() => spotlight.open()}
                            variant="default"
                            size="lg"
                            aria-label="Search"
                            title="Search (Cmd + K)"
                        >
                            <IconSearch size={20} stroke={1.5} />
                        </ActionIcon>
                        {auth.user && (
                            <Menu shadow="md" width={220} position="bottom-end">
                                <Menu.Target>
                                    <Group style={{ cursor: 'pointer' }} gap="sm" px="sm" py={6}>
                                        <Avatar color="primary" radius="xl" size="sm" variant="filled">
                                            {auth.user.name.substring(0, 2).toUpperCase()}
                                        </Avatar>
                                        <div style={{ flex: 1 }} visibleFrom="sm">
                                            <Text size="sm" fw={600} style={{ lineHeight: 1 }}>
                                                {auth.user.name}
                                            </Text>
                                            <Text size="xs" c="dimmed" style={{ lineHeight: 1.4 }}>
                                                {auth.user.email}
                                            </Text>
                                        </div>
                                    </Group>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Label>Account</Menu.Label>
                                    <Menu.Item
                                        leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} />}
                                        component={Link}
                                        href="/settings/notifications"
                                    >
                                        Settings
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item
                                        color="red"
                                        leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} />}
                                        component={Link}
                                        href="/logout"
                                        method="post"
                                        as="button"
                                    >
                                        Logout
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        )}
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <AppShell.Section grow component={ScrollArea}>
                    <Text size="10px" fw={800} c="dimmed" tt="uppercase" mb="xs" px="sm" style={{ letterSpacing: '1px' }}>
                        Operational Telemetry
                    </Text>
                    {monitoringItems.map((item) => (
                        <NavLink
                            key={item.href}
                            component={Link}
                            href={item.href}
                            label={item.label}
                            leftSection={<item.icon size={20} stroke={1.5} />}
                            active={url === item.href || (item.href !== '/' && url.startsWith(item.href))}
                            variant="subtle"
                            mb={4}
                        />
                    ))}

                    <Text size="10px" fw={800} c="dimmed" tt="uppercase" mt="xl" mb="xs" px="sm" style={{ letterSpacing: '1px' }}>
                        Global Infrastructure
                    </Text>
                    {infrastructureItems.map((item) => (
                        <NavLink
                            key={item.href}
                            component={Link}
                            href={item.href}
                            label={item.label}
                            leftSection={<item.icon size={20} stroke={1.5} />}
                            active={url.startsWith(item.href)}
                            variant="subtle"
                            mb={4}
                        />
                    ))}

                    <Text size="10px" fw={800} c="dimmed" tt="uppercase" mt="xl" mb="xs" px="sm" style={{ letterSpacing: '1px' }}>
                        Intelligence & Recon
                    </Text>
                    {analysisItems.map((item) => (
                        <NavLink
                            key={item.href}
                            component={Link}
                            href={item.href}
                            label={item.label}
                            leftSection={<item.icon size={20} stroke={1.5} />}
                            active={url.startsWith(item.href)}
                            variant="subtle"
                            mb={4}
                        />
                    ))}

                    <Text size="10px" fw={800} c="dimmed" tt="uppercase" mt="xl" mb="xs" px="sm" style={{ letterSpacing: '1px' }}>
                        Deployment & Alerting
                    </Text>
                    {configurationItems.map((item) => (
                        <NavLink
                            key={item.href}
                            component={Link}
                            href={item.href}
                            label={item.label}
                            leftSection={<item.icon size={20} stroke={1.5} />}
                            active={url.startsWith(item.href)}
                            variant="subtle"
                            mb={4}
                        />
                    ))}

                    <Text size="10px" fw={800} c="dimmed" tt="uppercase" mt="xl" mb="xs" px="sm" style={{ letterSpacing: '1px' }}>
                        Core Configuration
                    </Text>

                    {settingsItems.map((item) => (
                        <NavLink
                            key={item.href}
                            component={Link}
                            href={item.href}
                            label={item.label}
                            leftSection={<item.icon size={20} stroke={1.5} />}
                            active={url.startsWith(item.href)}
                            variant="subtle"
                            mb={4}
                        />
                    ))}
                </AppShell.Section>

                <AppShell.Section>
                    <Divider my="md" />
                    <Text size="xs" c="dimmed" ta="center">
                        PingPanther v1.0.0
                    </Text>
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>

            <Spotlight
                actions={spotlightActions}
                nothingFound="Nothing found..."
                highlightQuery
                searchProps={{
                    leftSection: <IconSearch size={20} stroke={1.5} />,
                    placeholder: 'Search monitors, pages, settings...',
                }}
            />
        </AppShell >
    );
}

export default AppLayout;
