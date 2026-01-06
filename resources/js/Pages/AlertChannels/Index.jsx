import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
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
    ThemeIcon,
} from '@mantine/core';
import { IconPlus, IconDots, IconEdit, IconTrash, IconMail, IconBrandSlack, IconBrandDiscord, IconBrandTelegram, IconWebhook } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function AlertChannelsIndex({ channels }) {
    const getTypeIcon = (type) => {
        const icons = {
            email: IconMail,
            slack: IconBrandSlack,
            discord: IconBrandDiscord,
            telegram: IconBrandTelegram,
            webhook: IconWebhook,
        };
        return icons[type] || IconMail;
    };

    const getTypeColor = (type) => {
        const colors = {
            email: 'blue',
            slack: 'violet',
            discord: 'indigo',
            telegram: 'cyan',
            webhook: 'orange',
        };
        return colors[type] || 'gray';
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this alert channel?')) {
            router.delete(`/alert-channels/${id}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Alert channel deleted successfully',
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
                            Alert Channels
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Configure notification channels for your monitors
                        </Text>
                    </div>
                    <Button
                        component={Link}
                        href="/alert-channels/create"
                        leftSection={<IconPlus size={16} />}
                    >
                        Add Channel
                    </Button>
                </Group>

                <Card padding="0" radius="md">
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Type</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Monitors</Table.Th>
                                <Table.Th>Created</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {channels.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Stack align="center" gap="md">
                                            <Text c="dimmed" size="lg">
                                                No alert channels yet
                                            </Text>
                                            <Button
                                                component={Link}
                                                href="/alert-channels/create"
                                                leftSection={<IconPlus size={16} />}
                                            >
                                                Add Your First Channel
                                            </Button>
                                        </Stack>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                channels.map((channel) => {
                                    const TypeIcon = getTypeIcon(channel.type);
                                    return (
                                        <Table.Tr key={channel.id}>
                                            <Table.Td>
                                                <Group gap="sm">
                                                    <ThemeIcon
                                                        size="md"
                                                        radius="md"
                                                        variant="light"
                                                        color={getTypeColor(channel.type)}
                                                    >
                                                        <TypeIcon size={16} />
                                                    </ThemeIcon>
                                                    <Text fw={600}>{channel.name}</Text>
                                                </Group>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge color={getTypeColor(channel.type)} variant="light">
                                                    {channel.type.toUpperCase()}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge color={channel.is_active ? 'green' : 'gray'} variant="light">
                                                    {channel.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge variant="light">{channel.monitors_count} monitors</Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm" c="dimmed">
                                                    {channel.created_at}
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
                                                            leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                                            component={Link}
                                                            href={`/alert-channels/${channel.id}/edit`}
                                                        >
                                                            Edit
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            color="red"
                                                            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                                            onClick={() => handleDelete(channel.id)}
                                                        >
                                                            Delete
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Table.Td>
                                        </Table.Tr>
                                    );
                                })
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>
            </Stack>
        </AppLayout>
    );
}

export default AlertChannelsIndex;
