import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import {
    Title,
    Text,
    Button,
    TextInput,
    Textarea,
    Select,
    Switch,
    Stack,
    Card,
    Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateTimePicker } from '@mantine/dates';
import { IconArrowLeft } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function MaintenanceWindowsCreate({ monitors }) {
    const form = useForm({
        initialValues: {
            monitor_id: '',
            name: '',
            description: '',
            starts_at: new Date(),
            ends_at: new Date(Date.now() + 2 * 60 * 60 * 1000),
            is_active: true,
        },
    });

    const handleSubmit = (values) => {
        router.post('/maintenance-windows', {
            ...values,
            starts_at: values.starts_at.toISOString().slice(0, 16),
            ends_at: values.ends_at.toISOString().slice(0, 16),
        }, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Maintenance window scheduled successfully',
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
                        href="/maintenance-windows"
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        size="sm"
                    >
                        Back
                    </Button>
                </Group>

                <div>
                    <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                        Schedule Maintenance
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Monitoring will be paused during this period
                    </Text>
                </div>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        <Card padding="lg" radius="md">
                            <Stack gap="md">
                                <Select
                                    label="Monitor"
                                    placeholder="Select a monitor"
                                    data={monitors}
                                    required
                                    {...form.getInputProps('monitor_id')}
                                />

                                <TextInput
                                    label="Name"
                                    placeholder="Server Upgrade"
                                    required
                                    {...form.getInputProps('name')}
                                />

                                <Textarea
                                    label="Description"
                                    placeholder="Upgrading to new server infrastructure"
                                    rows={3}
                                    {...form.getInputProps('description')}
                                />

                                <DateTimePicker
                                    label="Starts At"
                                    placeholder="Pick start date and time"
                                    required
                                    {...form.getInputProps('starts_at')}
                                />

                                <DateTimePicker
                                    label="Ends At"
                                    placeholder="Pick end date and time"
                                    required
                                    minDate={form.values.starts_at}
                                    {...form.getInputProps('ends_at')}
                                />

                                <Switch
                                    label="Active"
                                    description="Enable this maintenance window"
                                    {...form.getInputProps('is_active', { type: 'checkbox' })}
                                />
                            </Stack>
                        </Card>

                        <Group justify="flex-end">
                            <Button
                                component={Link}
                                href="/maintenance-windows"
                                variant="subtle"
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Schedule Maintenance
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </AppLayout>
    );
}

export default MaintenanceWindowsCreate;
