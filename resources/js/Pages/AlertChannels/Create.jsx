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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function AlertChannelsCreate() {
    const form = useForm({
        initialValues: {
            name: '',
            type: 'email',
            is_active: true,
            email: '',
            webhook_url: '',
            slack_webhook: '',
            discord_webhook: '',
            telegram_bot_token: '',
            telegram_chat_id: '',
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

        router.post('/alert-channels', {
            name: values.name,
            type: values.type,
            is_active: values.is_active,
            config,
        }, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Alert channel created successfully',
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
                        Add Alert Channel
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Configure a new notification channel
                    </Text>
                </div>

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
                                Create Channel
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </AppLayout>
    );
}

export default AlertChannelsCreate;
