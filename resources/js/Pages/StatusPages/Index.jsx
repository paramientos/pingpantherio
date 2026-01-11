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
    CopyButton,
    Tooltip,
} from '@mantine/core';
import { IconPlus, IconDots, IconEdit, IconTrash, IconExternalLink, IconCopy, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function StatusPagesIndex({ statusPages }) {
    const { auth } = usePage().props;
    
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this status page?')) {
            router.delete(`/status-pages/${id}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Status page deleted successfully',
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
                            Status Pages
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Create beautiful public status pages for your services
                        </Text>
                    </div>
                    {auth.is_admin && (
                        <Button
                            component={Link}
                            href="/status-pages/create"
                            leftSection={<IconPlus size={16} />}
                        >
                            Create Status Page
                        </Button>
                    )}
                </Group>

                <Card padding="0" radius="md">
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Slug</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Monitors</Table.Th>
                                <Table.Th>Public URL</Table.Th>
                                <Table.Th>Created</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {statusPages.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Stack align="center" gap="md">
                                            <Text c="dimmed" size="lg">
                                                No status pages yet
                                            </Text>

                                            {auth.is_admin && (
                                            <Button
                                                component={Link}
                                                href="/status-pages/create"
                                                leftSection={<IconPlus size={16} />}
                                            >
                                                Create Your First Status Page
                                            </Button>
                                            )}
                                        </Stack>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                statusPages.map((page) => (
                                    <Table.Tr key={page.id}>
                                        <Table.Td>
                                            <Text fw={600}>{page.name}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {page.slug}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={page.is_public ? 'green' : 'gray'} variant="light">
                                                {page.is_public ? 'Public' : 'Private'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light">{page.monitors_count} monitors</Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Text size="sm" c="dimmed" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {page.url}
                                                </Text>
                                                <CopyButton value={page.url}>
                                                    {({ copied, copy }) => (
                                                        <Tooltip label={copied ? 'Copied' : 'Copy URL'}>
                                                            <ActionIcon
                                                                color={copied ? 'teal' : 'gray'}
                                                                variant="subtle"
                                                                onClick={copy}
                                                                size="sm"
                                                            >
                                                                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    )}
                                                </CopyButton>
                                                <Tooltip label="Open in new tab">
                                                    <ActionIcon
                                                        component="a"
                                                        href={page.url}
                                                        target="_blank"
                                                        variant="subtle"
                                                        size="sm"
                                                    >
                                                        <IconExternalLink size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {page.created_at}
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
                                                    {!isReadOnly && (
                                                        <>
                                                            <Menu.Item
                                                                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                                                component={Link}
                                                                href={`/status-pages/${page.id}/edit`}
                                                            >
                                                                Edit
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                color="red"
                                                                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                                                onClick={() => handleDelete(page.id)}
                                                            >
                                                                Delete
                                                            </Menu.Item>
                                                        </>
                                                    )}
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

export default StatusPagesIndex;
