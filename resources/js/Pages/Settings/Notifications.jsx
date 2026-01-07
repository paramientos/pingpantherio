import React from 'react';
import SettingsLayout from './SettingsLayout';
import { Stack, Switch, Group, Button, Title, Text, Divider, Paper } from '@mantine/core';
import { useForm } from '@inertiajs/react';
import { notifications as mantineNotifications } from '@mantine/notifications';
import { IconMail, IconDeviceDesktop, IconFileAnalytics } from '@tabler/icons-react';

export default function Notifications({ settings }) {
    const { data, setData, post, processing } = useForm({
        notifications: settings?.notifications ?? {
            email: true,
            browser: true,
            weekly_report: true,
        },
    });

    const submit = (e) => {
        e.preventDefault();
        post('/settings/notifications', {
            onSuccess: () => {
                mantineNotifications.show({
                    title: 'Settings saved',
                    message: 'Your notification preferences have been updated.',
                    color: 'green',
                });
            },
        });
    };

    return (
        <SettingsLayout activeTab="notifications">
            <form onSubmit={submit}>
                <Stack gap="xl">
                    <div>
                        <Title order={4} mb={4}>Incident Notifications</Title>
                        <Text size="sm" c="dimmed">Choose how you want to be notified when an incident occurs.</Text>
                    </div>

                    <Stack gap="md">
                        <Group justify="space-between" wrap="nowrap">
                            <Group gap="md">
                                <Paper p="xs" radius="md" withBorder>
                                    <IconMail size={20} style={{ color: 'var(--mantine-color-indigo-6)' }} />
                                </Paper>
                                <div>
                                    <Text fw={600} size="sm">Email Notifications</Text>
                                    <Text size="xs" c="dimmed">Receive alerts via your account email address.</Text>
                                </div>
                            </Group>
                            <Switch
                                checked={data.notifications.email}
                                onChange={(e) => setData('notifications', { ...data.notifications, email: e.currentTarget.checked })}
                                size="md"
                            />
                        </Group>

                        <Divider variant="dashed" />

                        <Group justify="space-between" wrap="nowrap">
                            <Group gap="md">
                                <Paper p="xs" radius="md" withBorder>
                                    <IconDeviceDesktop size={20} style={{ color: 'var(--mantine-color-indigo-6)' }} />
                                </Paper>
                                <div>
                                    <Text fw={600} size="sm">Browser Notifications</Text>
                                    <Text size="xs" c="dimmed">Get real-time push notifications in your browser.</Text>
                                </div>
                            </Group>
                            <Switch
                                checked={data.notifications.browser}
                                onChange={(e) => setData('notifications', { ...data.notifications, browser: e.currentTarget.checked })}
                                size="md"
                            />
                        </Group>
                    </Stack>

                    <Divider />

                    <div>
                        <Title order={4} mb={4}>Reports & Updates</Title>
                        <Text size="sm" c="dimmed">Stay informed about your overall system health.</Text>
                    </div>

                    <Group justify="space-between" wrap="nowrap">
                        <Group gap="md">
                            <Paper p="xs" radius="md" withBorder>
                                <IconFileAnalytics size={20} style={{ color: 'var(--mantine-color-indigo-6)' }} />
                            </Paper>
                            <div>
                                <Text fw={600} size="sm">Weekly Health Report</Text>
                                <Text size="xs" c="dimmed">A summary of your uptime and performance for the week.</Text>
                            </div>
                        </Group>
                        <Switch
                            checked={data.notifications.weekly_report}
                            onChange={(e) => setData('notifications', { ...data.notifications, weekly_report: e.currentTarget.checked })}
                            size="md"
                        />
                    </Group>

                    <Group justify="flex-end" mt="xl">
                        <Button type="submit" loading={processing}>
                            Save Changes
                        </Button>
                    </Group>
                </Stack>
            </form>
        </SettingsLayout>
    );
}
