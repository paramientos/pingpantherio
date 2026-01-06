import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import {
    Title,
    Text,
    Button,
    SimpleGrid,
    Card,
    Group,
    ActionIcon,
    Stack,
    Badge,
} from '@mantine/core';
import { IconPlus, IconTrash, IconLayoutDashboard, IconExternalLink } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function CustomDashboardsIndex({ dashboards }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this custom dashboard?')) {
            router.delete(`/custom-dashboards/${id}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Deleted',
                        message: 'Dashboard has been removed',
                        color: 'red',
                    });
                },
            });
        }
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            Performance Dashboards
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Build custom real-time views with specialized widgets
                        </Text>
                    </div>
                    <Button
                        component={Link}
                        href="/custom-dashboards/create"
                        leftSection={<IconPlus size={16} />}
                    >
                        New Dashboard
                    </Button>
                </Group>

                {dashboards.length === 0 ? (
                    <Card padding="xl" radius="md" withBorder style={{ textAlign: 'center' }}>
                        <Stack align="center" gap="md">
                            <IconLayoutDashboard size={48} stroke={1.5} color="gray" />
                            <Text size="lg" fw={500}>No custom dashboards yet</Text>
                            <Text c="dimmed" maw={400}>
                                Create your first specialized dashboard to track metrics across multiple monitors.
                            </Text>
                            <Button
                                component={Link}
                                href="/custom-dashboards/create"
                                variant="light"
                            >
                                Get Started
                            </Button>
                        </Stack>
                    </Card>
                ) : (
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                        {dashboards.map((dashboard) => (
                            <Card key={dashboard.id} padding="lg" radius="md" withBorder shadow="sm">
                                <Stack justify="space-between" h="100%">
                                    <div>
                                        <Group justify="space-between" mb="xs">
                                            <Text fw={700} size="lg">{dashboard.name}</Text>
                                            {dashboard.is_public && <Badge size="xs">Public</Badge>}
                                        </Group>
                                        <Text size="sm" c="dimmed" lineClamp={2}>
                                            {dashboard.description || 'No description provided.'}
                                        </Text>
                                    </div>

                                    <Group justify="space-between" mt="xl">
                                        <Button
                                            variant="light"
                                            component={Link}
                                            href={`/custom-dashboards/${dashboard.id}`}
                                            fullWidth
                                            leftSection={<IconExternalLink size={16} />}
                                            style={{ flex: 1 }}
                                        >
                                            View
                                        </Button>
                                        <ActionIcon
                                            color="red"
                                            variant="subtle"
                                            size="lg"
                                            onClick={() => handleDelete(dashboard.id)}
                                        >
                                            <IconTrash size={18} />
                                        </ActionIcon>
                                    </Group>
                                </Stack>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </Stack>
        </AppLayout>
    );
}

export default CustomDashboardsIndex;
