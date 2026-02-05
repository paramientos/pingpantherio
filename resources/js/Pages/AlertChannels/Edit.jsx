import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import {
    Title,
    Text,
    Button,
    TextInput,
    Select,
    Switch,
    Stack,
    Card,
    Group,
    Textarea,
    Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconInfoCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function AlertChannelsEdit({ channel }) {
    const form = useForm({
        initialValues: {
            name: channel.name,
            type: channel.type,
            is_active: channel.is_active,
            email: channel.type === 'email' ? channel.config.email : '',
            webhook_url: channel.type === 'webhook' ? channel.config.url : '',
            slack_webhook: channel.type === 'slack' ? channel.config.webhook_url : '',
            discord_webhook: channel.type === 'discord' ? channel.config.webhook_url : '',
            telegram_bot_token: channel.type === 'telegram' ? channel.config.bot_token : '',
            telegram_chat_id: channel.type === 'telegram' ? channel.config.chat_id : '',
        },
    });

    const handleSubmit = (values) => {
        const config = {};

        if (values.type === 'email') {
            config.email = values.email;
        } else if (values.type === 'webhook') {
            config.url = values.webhook_url;
        } else if (values.type === 'slack') {
            config.webhook_url = values.slack_webhook;
        } else if (values.type === 'discord') {
            config.webhook_url = values.discord_webhook;
        } else if (values.type === 'telegram') {
            config.bot_token = values.telegram_bot_token;
            config.chat_id = values.telegram_chat_id;
        }

        router.put(`/alert-channels/${channel.id}`, {
            name: values.name,
            type: values.type,
            is_active: values.is_active,
            config,
        }, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Alert channel updated successfully',
                    color: 'green',
                });
            },
            onError: (errors) => {
                form.setErrors(errors);
            },
        });
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group>
                    <Button
                        component={Link}
                        href="/alert-channels"
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        size="sm"
                    >
                        Back
                    </Button>
                </Group>

                <div>
                    <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                        Edit Alert Channel
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Update notification channel configuration
                    </Text>
                </div>

                <Alert icon={<IconInfoCircle size={16} />} title="How to use this channel?" color="blue" variant="light">
                    To receive notifications through this channel, you need to create an
                    <Link href="/alert-rules" style={{ color: 'inherit', fontWeight: 700, margin: '0 4px' }}>
                        Alert Rule
                    </Link>
                    and select this channel along with the monitors you want to watch.
                </Alert>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        <Card padding="lg" radius="md">
                            <Stack gap="md">
                                <TextInput
                                    label="Channel Name"
                                    placeholder="My Slack Channel"
                                    required
                                    {...form.getInputProps('name')}
                                />

                                <Select
                                    label="Channel Type"
                                    data={[
                                        { value: 'email', label: 'Email' },
                                        { value: 'slack', label: 'Slack' },
                                        { value: 'discord', label: 'Discord' },
                                        { value: 'telegram', label: 'Telegram' },
                                        { value: 'webhook', label: 'Webhook' },
                                    ]}
                                    {...form.getInputProps('type')}
                                />

                                {form.values.type === 'email' && (
                                    <TextInput
                                        label="Email Address"
                                        placeholder="alerts@example.com"
                                        type="email"
                                        required
                                        {...form.getInputProps('email')}
                                    />
                                )}

                                {form.values.type === 'slack' && (
                                    <Textarea
                                        label="Slack Webhook URL"
                                        placeholder="https://hooks.slack.com/services/..."
                                        required
                                        {...form.getInputProps('slack_webhook')}
                                    />
                                )}

                                {form.values.type === 'discord' && (
                                    <Textarea
                                        label="Discord Webhook URL"
                                        placeholder="https://discord.com/api/webhooks/..."
                                        required
                                        {...form.getInputProps('discord_webhook')}
                                    />
                                )}

                                {form.values.type === 'telegram' && (
                                    <>
                                        <TextInput
                                            label="Bot Token"
                                            placeholder="123456:ABC-DEF..."
                                            required
                                            {...form.getInputProps('telegram_bot_token')}
                                        />
                                        <TextInput
                                            label="Chat ID"
                                            placeholder="-1001234567890"
                                            required
                                            {...form.getInputProps('telegram_chat_id')}
                                        />
                                    </>
                                )}

                                {form.values.type === 'webhook' && (
                                    <Textarea
                                        label="Webhook URL"
                                        placeholder="https://example.com/webhook"
                                        required
                                        {...form.getInputProps('webhook_url')}
                                    />
                                )}

                                <Switch
                                    label="Active"
                                    description="Enable this alert channel"
                                    {...form.getInputProps('is_active', { type: 'checkbox' })}
                                />
                            </Stack>
                        </Card>

                        <Group justify="flex-end">
                            <Button
                                component={Link}
                                href="/alert-channels"
                                variant="subtle"
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Update Channel
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </AppLayout>
    );
}

export default AlertChannelsEdit;
