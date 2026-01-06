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
    MultiSelect,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function StatusPagesEdit({ statusPage, monitors }) {
    const form = useForm({
        initialValues: {
            name: statusPage.name,
            slug: statusPage.slug,
            description: statusPage.description || '',
            logo_url: statusPage.logo_url || '',
            is_public: statusPage.is_public,
            show_uptime: statusPage.show_uptime,
            show_incidents: statusPage.show_incidents,
            monitor_ids: statusPage.monitor_ids || [],
        },
    });

    const handleSubmit = (values) => {
        router.put(`/status-pages/${statusPage.id}`, values, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Status page updated successfully',
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
                        href="/status-pages"
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        size="sm"
                    >
                        Back
                    </Button>
                </Group>

                <div>
                    <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                        Edit Status Page
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Update your status page settings
                    </Text>
                </div>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        <Card padding="lg" radius="md">
                            <Stack gap="md">
                                <Title order={4} fw={700}>
                                    Basic Information
                                </Title>

                                <TextInput
                                    label="Name"
                                    placeholder="My Service Status"
                                    required
                                    {...form.getInputProps('name')}
                                />

                                <TextInput
                                    label="Slug"
                                    placeholder="my-service"
                                    description="This will be used in the public URL"
                                    required
                                    {...form.getInputProps('slug')}
                                />

                                <Textarea
                                    label="Description"
                                    placeholder="Real-time status of our services"
                                    rows={3}
                                    {...form.getInputProps('description')}
                                />

                                <TextInput
                                    label="Logo URL"
                                    placeholder="https://example.com/logo.png"
                                    {...form.getInputProps('logo_url')}
                                />
                            </Stack>
                        </Card>

                        <Card padding="lg" radius="md">
                            <Stack gap="md">
                                <Title order={4} fw={700}>
                                    Monitors
                                </Title>

                                <MultiSelect
                                    label="Select Monitors"
                                    placeholder="Choose monitors to display"
                                    data={monitors}
                                    searchable
                                    {...form.getInputProps('monitor_ids')}
                                />
                            </Stack>
                        </Card>

                        <Card padding="lg" radius="md">
                            <Stack gap="md">
                                <Title order={4} fw={700}>
                                    Settings
                                </Title>

                                <Switch
                                    label="Make this status page public"
                                    description="Anyone with the link can view this page"
                                    {...form.getInputProps('is_public', { type: 'checkbox' })}
                                />

                                <Switch
                                    label="Show uptime statistics"
                                    description="Display 90-day uptime bars"
                                    {...form.getInputProps('show_uptime', { type: 'checkbox' })}
                                />

                                <Switch
                                    label="Show incident history"
                                    description="Display recent incidents timeline"
                                    {...form.getInputProps('show_incidents', { type: 'checkbox' })}
                                />
                            </Stack>
                        </Card>

                        <Group justify="flex-end">
                            <Button
                                component={Link}
                                href="/status-pages"
                                variant="subtle"
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Update Status Page
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </AppLayout>
    );
}

export default StatusPagesEdit;
