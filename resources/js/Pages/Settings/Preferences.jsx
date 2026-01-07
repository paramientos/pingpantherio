import React from 'react';
import SettingsLayout from './SettingsLayout';
import { Stack, Select, NumberInput, Button, Title, Text, Group, Paper, Divider } from '@mantine/core';
import { useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { IconClock, IconWorld, IconRefresh, IconPalette } from '@tabler/icons-react';

import { themes } from '../../Themes/palettes';

export default function Preferences({ settings, timezones }) {
    const { data, setData, post, processing } = useForm({
        timezone: settings?.preferences?.timezone ?? 'UTC',
        language: settings?.preferences?.language ?? 'en',
        theme: settings?.preferences?.theme ?? 'panther',
        refresh_rate: settings?.preferences?.refresh_rate ?? 60,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/settings/preferences', {
            onSuccess: () => {
                notifications.show({
                    title: 'Preferences saved',
                    message: 'Your personal preferences have been updated.',
                    color: 'green',
                });
                // Reload the page to apply theme changes
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            },
        });
    };

    return (
        <SettingsLayout activeTab="preferences">
            <form onSubmit={submit}>
                <Stack gap="xl">
                    <div>
                        <Title order={4} mb={4}>Regional & Localization</Title>
                        <Text size="sm" c="dimmed">Set your preferred timezone and language for the dashboard.</Text>
                    </div>

                    <Group grow align="flex-start">
                        <Select
                            label="Timezone"
                            placeholder="Select timezone"
                            data={timezones.map(tz => ({ value: tz, label: tz }))}
                            searchable
                            leftSection={<IconWorld size={16} />}
                            value={data.timezone}
                            onChange={(val) => setData('timezone', val)}
                        />
                        <Select
                            label="Language"
                            placeholder="Select language"
                            data={[
                                { value: 'en', label: 'English' },
                                // { value: 'tr', label: 'Türkçe' },
                                // { value: 'de', label: 'Deutsch' },
                                // { value: 'fr', label: 'Français' },
                            ]}
                            value={data.language}
                            onChange={(val) => setData('language', val)}
                        />
                    </Group>

                    <Divider />

                    <div>
                        <Title order={4} mb={4}>Dashboard Preferences</Title>
                        <Text size="sm" c="dimmed">Customize how the monitoring dashboard behaves.</Text>
                    </div>

                    <Stack gap="md">
                        <Group justify="space-between" wrap="nowrap">
                            <Group gap="md">
                                <Paper p="xs" radius="md" withBorder>
                                    <IconRefresh size={20} style={{ color: 'var(--mantine-primary-color-filled)' }} />
                                </Paper>
                                <div>
                                    <Text fw={600} size="sm">Auto-refresh Interval</Text>
                                    <Text size="xs" c="dimmed">How often the dashboard data updates (seconds). Set to 0 to disable.</Text>
                                </div>
                            </Group>
                            <NumberInput
                                value={data.refresh_rate}
                                onChange={(val) => setData('refresh_rate', val)}
                                min={0}
                                max={3600}
                                step={5}
                                suffix="s"
                                w={100}
                            />
                        </Group>

                        <Divider variant="dashed" />

                        <Group justify="space-between" wrap="nowrap">
                            <Group gap="md">
                                <Paper p="xs" radius="md" withBorder>
                                    <IconPalette size={20} style={{ color: 'var(--mantine-primary-color-filled)' }} />
                                </Paper>
                                <div>
                                    <Text fw={600} size="sm">Interface Theme</Text>
                                    <Text size="xs" c="dimmed">Choose your preferred appearance for the application.</Text>
                                </div>
                            </Group>
                            <Select
                                data={Object.entries(themes).map(([key, theme]) => ({
                                    value: key,
                                    label: theme.name
                                }))}
                                value={data.theme}
                                onChange={(val) => setData('theme', val)}
                                w={200}
                            />
                        </Group>
                    </Stack>

                    <Group justify="flex-end" mt="xl">
                        <Button type="submit" loading={processing}>
                            Save Preferences
                        </Button>
                    </Group>
                </Stack>
            </form>
        </SettingsLayout>
    );
}
