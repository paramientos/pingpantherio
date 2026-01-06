import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import {
    Title,
    Text,
    Button,
    TextInput,
    Select,
    MultiSelect,
    Switch,
    Stack,
    Card,
    Group,
    NumberInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function AlertRulesCreate({ monitors, channels }) {
    const form = useForm({
        initialValues: {
            name: '',
            condition_type: 'response_time',
            condition_value: 1000,
            threshold: 1,
            duration: 0,
            monitor_ids: [],
            channel_ids: [],
            is_active: true,
        },
        validate: {
            name: (value) => (value.length < 3 ? 'Name too short' : null),
            monitor_ids: (value) => (value.length === 0 ? 'Select at least one monitor' : null),
            channel_ids: (value) => (value.length === 0 ? 'Select at least one channel' : null),
        },
    });

    const handleSubmit = (values) => {
        router.post('/alert-rules', values, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Alert rule created successfully',
                    color: 'green',
                });
            },
        });
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group>
                    <Button
                        component={Link}
                        href="/alert-rules"
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        size="sm"
                    >
                        Back
                    </Button>
                </Group>

                <div>
                    <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                        Configure Alert Rule
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Set specific conditions that trigger alerts across your channels
                    </Text>
                </div>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Card padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <TextInput
                                label="Rule Name"
                                placeholder="e.g. Critical Latency Alert"
                                required
                                {...form.getInputProps('name')}
                            />

                            <Group grow>
                                <Select
                                    label="Trigger Condition"
                                    data={[
                                        { value: 'response_time', label: 'Response Time (ms)' },
                                        { value: 'status_code', label: 'HTTP Status Code' },
                                        { value: 'ssl_expiry', label: 'SSL Expiry (days)' },
                                    ]}
                                    {...form.getInputProps('condition_type')}
                                />
                                <NumberInput
                                    label="Condition Value"
                                    {...form.getInputProps('condition_value')}
                                />
                            </Group>

                            <Group grow>
                                <NumberInput
                                    label="Sensitivity (Threshold)"
                                    description="Occurrences before alerting"
                                    min={1}
                                    {...form.getInputProps('threshold')}
                                />
                                <NumberInput
                                    label="Duration (Minutes)"
                                    description="Must persist for at least"
                                    min={0}
                                    {...form.getInputProps('duration')}
                                />
                            </Group>

                            <MultiSelect
                                label="Monitors"
                                placeholder="Select monitors to watch"
                                data={monitors}
                                searchable
                                required
                                {...form.getInputProps('monitor_ids')}
                            />

                            <MultiSelect
                                label="Alert Channels"
                                placeholder="Select channels to notify"
                                data={channels}
                                searchable
                                required
                                {...form.getInputProps('channel_ids')}
                            />

                            <Switch
                                label="Active"
                                description="Enable this alert rule"
                                mt="md"
                                {...form.getInputProps('is_active', { type: 'checkbox' })}
                            />

                            <Group justify="flex-end" mt="xl">
                                <Button variant="subtle" component={Link} href="/alert-rules">Cancel</Button>
                                <Button type="submit">Create Alert Rule</Button>
                            </Group>
                        </Stack>
                    </Card>
                </form>
            </Stack>
        </AppLayout>
    );
}

export default AlertRulesCreate;
