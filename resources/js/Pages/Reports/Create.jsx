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
    TagsInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function ReportsCreate({ monitors }) {
    const form = useForm({
        initialValues: {
            name: '',
            type: 'uptime',
            frequency: 'weekly',
            monitor_ids: [],
            recipients: [],
            is_active: true,
        },
        validate: {
            name: (value) => (value.length < 3 ? 'Name too short' : null),
            monitor_ids: (value) => (value.length === 0 ? 'Select at least one monitor' : null),
            recipients: (value) => (value.length === 0 ? 'Add at least one recipient' : null),
        },
    });

    const handleSubmit = (values) => {
        router.post('/reports', values, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Report schedule created successfully',
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
                        href="/reports"
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        size="sm"
                    >
                        Back
                    </Button>
                </Group>

                <div>
                    <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                        Create Automated Report
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Schedules automated PDF/HTML reports to be sent via email
                    </Text>
                </div>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Card padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <TextInput
                                label="Report Name"
                                placeholder="e.g. Monthly Infrastructure Health"
                                required
                                {...form.getInputProps('name')}
                            />

                            <Group grow>
                                <Select
                                    label="Report Type"
                                    data={[
                                        { value: 'uptime', label: 'Uptime & Availability' },
                                        { value: 'response_time', label: 'Response Time Analytics' },
                                        { value: 'slas', label: 'SLA Compliance' },
                                    ]}
                                    {...form.getInputProps('type')}
                                />
                                <Select
                                    label="Frequency"
                                    data={[
                                        { value: 'daily', label: 'Daily' },
                                        { value: 'weekly', label: 'Weekly' },
                                        { value: 'monthly', label: 'Monthly' },
                                    ]}
                                    {...form.getInputProps('frequency')}
                                />
                            </Group>

                            <MultiSelect
                                label="Monitors to Include"
                                placeholder="Select monitors"
                                data={monitors}
                                searchable
                                required
                                {...form.getInputProps('monitor_ids')}
                            />

                            <TagsInput
                                label="Email Recipients"
                                placeholder="Add email and press Enter"
                                description="Separate multiple emails with Enter"
                                required
                                {...form.getInputProps('recipients')}
                            />

                            <Switch
                                label="Active"
                                description="Enable this scheduled report"
                                mt="md"
                                {...form.getInputProps('is_active', { type: 'checkbox' })}
                            />

                            <Group justify="flex-end" mt="xl">
                                <Button variant="subtle" component={Link} href="/reports">Cancel</Button>
                                <Button type="submit">Create Schedule</Button>
                            </Group>
                        </Stack>
                    </Card>
                </form>
            </Stack>
        </AppLayout>
    );
}

export default ReportsCreate;
