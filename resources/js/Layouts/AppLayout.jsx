import React from 'react';
import { AppShell, Burger, Group, NavLink, Avatar, Menu, Text, rem, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, usePage } from '@inertiajs/react';
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
} from '@tabler/icons-react';

function AppLayout({ children }) {
    const [opened, { toggle }] = useDisclosure();
    const { auth, url } = usePage().props;


    const navItems = [
        { label: 'Overview', icon: IconChartPie, href: '/' },
        { label: 'Custom Dashboards', icon: IconLayoutDashboard, href: '/custom-dashboards' },
        { label: 'Monitors', icon: IconDeviceDesktop, href: '/monitors' },
        { label: 'Incidents', icon: IconAlertTriangle, href: '/incidents' },
        { label: 'Status Pages', icon: IconBroadcast, href: '/status-pages' },
        { label: 'Domains', icon: IconWorld, href: '/domains' },
        { label: 'Reports', icon: IconFileAnalytics, href: '/reports' },
        { label: 'Alert Rules', icon: IconSettingsAutomation, href: '/alert-rules' },
        { label: 'Alert Channels', icon: IconBolt, href: '/alert-channels' },
        { label: 'Maintenance', icon: IconClock, href: '/maintenance-windows' },
    ];

    const settingsItems = [
        { label: 'Settings', icon: IconSettings, href: '/settings/notifications' },
        { label: 'Webhooks', icon: IconWebhook, href: '/webhooks' },
        { label: 'Team', icon: IconUsers, href: '/teams' },
        { label: 'API Keys', icon: IconKey, href: '/api-keys' },
        { label: 'Audit Logs', icon: IconHistory, href: '/audit-logs' },
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
        >
            <AppShell.Header>
                <Group h="100%" px="lg" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Group gap="sm">
                            <ActionIcon
                                variant="gradient"
                                gradient={{ from: 'indigo', to: 'violet', deg: 135 }}
                                size="lg"
                                radius="md"
                            >
                                <IconBolt size={20} />
                            </ActionIcon>
                            <div>
                                <Text size="lg" fw={900} style={{ lineHeight: 1, letterSpacing: '-0.5px' }}>
                                    Ping<span style={{ color: 'var(--mantine-color-indigo-6)' }}>Panther</span>
                                </Text>
                                <Text size="xs" c="dimmed" fw={500} style={{ lineHeight: 1 }}>
                                    Uptime Monitoring
                                </Text>
                            </div>
                        </Group>
                    </Group>

                    {auth.user && (
                        <Menu shadow="md" width={220} position="bottom-end">
                            <Menu.Target>
                                <Group style={{ cursor: 'pointer' }} gap="sm" px="sm" py={6}>
                                    <Avatar color="indigo" radius="xl" size="sm" variant="filled">
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
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <AppShell.Section grow>
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs" px="sm">
                        Main
                    </Text>
                    {navItems.map((item) => (
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

                    <Text size="xs" fw={700} c="dimmed" tt="uppercase" mt="xl" mb="xs" px="sm">
                        Settings
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
                    <Text size="xs" c="dimmed" ta="center" mt="md">
                        PingPanther v1.0.0
                    </Text>
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}

export default AppLayout;
