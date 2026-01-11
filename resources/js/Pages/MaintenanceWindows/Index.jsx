import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Title,
    Text,
    Button,
    Table,
    Badge,
    Group,
    ActionIcon,
    Stack,
    Menu,
    rem,
    Card,
} from '@mantine/core';
import { IconPlus, IconDots, IconTrash, IconClock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function MaintenanceWindowsIndex({ windows }) {
    const { auth } = usePage().props;
    
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this maintenance window?')) {
            router.delete(`/maintenance-windows/${id}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Maintenance window deleted successfully',
                        color: 'green',
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
                            Maintenance Windows
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Schedule maintenance periods to pause monitoring
                        </Text>
                    </div>
                    {auth.is_admin && (
                        <Button
                            component={Link}
                            href="/maintenance-windows/create"
                            leftSection={<IconPlus size={16} />}
                        >
                            Schedule Maintenance
                        </Button>
                    )}
                </Group>

                <Card padding="0" radius="md">
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Monitor</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Starts At</Table.Th>
                                <Table.Th>Ends At</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {windows.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Stack align="center" gap="md">
                                            <Text c="dimmed" size="lg">
                                                No maintenance windows scheduled
                                            </Text>

                                            {auth.is_admin && (
                                            <Button
                                                component={Link}
                                                href="/maintenance-windows/create"
                                                leftSection={<IconPlus size={16} />}
                                            >
                                                Schedule Your First Maintenance
                                            </Button>
                                            )}
                                        </Stack>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                windows.map((window) => (
                                    <Table.Tr key={window.id}>
                                        <Table.Td>
                                            <div>
                                                <Text fw={600}>{window.name}</Text>
                                                {window.description && (
                                                    <Text size="xs" c="dimmed">
                                                        {window.description}
                                                    </Text>
                                                )}
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{window.monitor_name}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                color={window.is_ongoing ? 'orange' : window.is_active ? 'blue' : 'gray'}
                                                variant="light"
                                                leftSection={window.is_ongoing ? <IconClock size={12} /> : null}
                                            >
                                                {window.is_ongoing ? 'Ongoing' : window.is_active ? 'Scheduled' : 'Inactive'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {window.starts_at}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {window.ends_at}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Menu shadow="md" width={200}>
                                                <Menu.Target>
                                                    <ActionIcon variant="subtle">
                                                        <IconDots style={{ width: rem(16), height: rem(16) }} />
                                                    </ActionIcon>
                                                </Menu.Target>

                                                <Menu.Dropdown>
                                                    <Menu.Item
                                                        color="red"
                                                        leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                                        onClick={() => handleDelete(window.id)}
                                                    >
                                                        Delete
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>
            </Stack>
        </AppLayout>
    );
}

export default MaintenanceWindowsIndex;
