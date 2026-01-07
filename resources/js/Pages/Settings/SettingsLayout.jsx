import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Tabs, Container, Paper, Title, Text, Stack, Switch, Group, Button, Divider, rem } from '@mantine/core';
import { IconBell, IconUser, IconLock, IconShield, IconDeviceDesktop, IconKey, IconHistory, IconWebhook, IconUsers } from '@tabler/icons-react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { notifications as mantineNotifications } from '@mantine/notifications';

export default function SettingsLayout({ children, activeTab }) {
    return (
        <AppLayout>
            <Container size="lg">
                <Stack gap="xl">
                    <div>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>Account Settings</Title>
                        <Text c="dimmed" size="sm">Manage your profile, security and notification preferences.</Text>
                    </div>

                    <Tabs value={activeTab} variant="outline" radius="md">
                        <Tabs.List mb="xl">
                            <Tabs.Tab
                                value="notifications"
                                leftSection={<IconBell style={{ width: rem(16), height: rem(16) }} />}
                                component={Link}
                                href="/settings/notifications"
                            >
                                Notifications
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="profile"
                                leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                                component={Link}
                                href="/settings/profile"
                            >
                                Profile
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="preferences"
                                leftSection={<IconDeviceDesktop style={{ width: rem(16), height: rem(16) }} />}
                                component={Link}
                                href="/settings/preferences"
                            >
                                Preferences
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="security"
                                leftSection={<IconShield style={{ width: rem(16), height: rem(16) }} />}
                                component={Link}
                                href="/settings/security"
                            >
                                Security
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="team"
                                leftSection={<IconUsers style={{ width: rem(16), height: rem(16) }} />}
                                component={Link}
                                href="/settings/teams"
                            >
                                Team
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="webhooks"
                                leftSection={<IconWebhook style={{ width: rem(16), height: rem(16) }} />}
                                component={Link}
                                href="/settings/webhooks"
                            >
                                Webhooks
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="api-keys"
                                leftSection={<IconKey style={{ width: rem(16), height: rem(16) }} />}
                                component={Link}
                                href="/settings/api-keys"
                            >
                                API Keys
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="audit-logs"
                                leftSection={<IconHistory style={{ width: rem(16), height: rem(16) }} />}
                                component={Link}
                                href="/settings/audit-logs"
                            >
                                Audit Logs
                            </Tabs.Tab>
                        </Tabs.List>

                        <Paper withBorder p="xl" radius="md">
                            {children}
                        </Paper>
                    </Tabs>
                </Stack>
            </Container>
        </AppLayout>
    );
}
