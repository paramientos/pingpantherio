import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import {
    Title,
    Text,
    Button,
    TextInput,
    Textarea,
    Switch,
    Stack,
    Card,
    Group,
    Checkbox,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function CustomDashboardsCreate() {
    const form = useForm({
        initialValues: {
            name: '',
            description: '',
            widgets: ['uptime_hero', 'latency_stats'],
            is_public: false,
        },
    });

    const handleSubmit = (values) => {
        router.post('/custom-dashboards', values, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Custom dashboard created successfully',
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
                        href="/custom-dashboards"
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        size="sm"
                    >
                        Back
                    </Button>
                </Group>

                <div>
                    <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                        Create Performance Dashboard
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Customize your monitoring view with specific widgets and layouts
                    </Text>
                </div>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Card padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <TextInput
                                label="Dashboard Name"
                                placeholder="e.g. Server Room #1 Overview"
                                required
                                {...form.getInputProps('name')}
                            />

                            <Textarea
                                label="Description"
                                placeholder="What is this dashboard for?"
                                {...form.getInputProps('description')}
                            />

                            <Text size="sm" fw={500} mt="md">Initial Widgets</Text>
                            <Checkbox.Group {...form.getInputProps('widgets')}>
                                <Stack gap="xs">
                                    <Checkbox value="uptime_hero" label="Uptime Hero KPI (Aggregated)" />
                                    <Checkbox value="latency_stats" label="Average Latency Chart" />
                                    <Checkbox value="incident_log" label="Recent Incidents Feed" />
                                    <Checkbox value="region_map" label="Global Availability Map" />
                                </Stack>
                            </Checkbox.Group>

                            <Switch
                                label="Public Access"
                                description="Allow anyone with the link to view this dashboard"
                                mt="md"
                                {...form.getInputProps('is_public', { type: 'checkbox' })}
                            />

                            <Group justify="flex-end" mt="xl">
                                <Button variant="subtle" component={Link} href="/custom-dashboards">Cancel</Button>
                                <Button type="submit">Create Dashboard</Button>
                            </Group>
                        </Stack>
                    </Card>
                </form>
            </Stack>
        </AppLayout>
    );
}

export default CustomDashboardsCreate;
