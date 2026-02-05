import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Title,
    Text,
    Button,
    Table,
    Badge,
    Group,
    ActionIcon,
    Modal,
    TextInput,
    Select,
    NumberInput,
    Switch,
    Stack,
    Menu,
    rem,
    Paper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { router, Link, usePage } from '@inertiajs/react';
import { IconPlus, IconDots, IconEdit, IconTrash, IconCircleCheck, IconCircleX, IconClock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Deferred } from '@inertiajs/react';
import { Skeleton } from '@mantine/core';
import MonitorForm from '@/Components/MonitorForm';

function MonitorsIndex({ monitors, escalationPolicies }) {
    const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
    const [selectedMonitor, setSelectedMonitor] = useState(null);
    const { auth } = usePage().props;

    const createForm = useForm({
        initialValues: {
            name: '',
            url: '',
            type: 'http',
            interval: 300,
            timeout: 30,
            method: 'GET',
            verify_ssl: true,
            check_ssl: false,
            headers: '',
            keyword: '',
            port: 80,
            tags: [],
            group: '',
            escalation_policy_id: null,
        },
    });

    const editForm = useForm({
        initialValues: {
            name: '',
            url: '',
            type: 'http',
            interval: 300,
            timeout: 30,
            method: 'GET',
            verify_ssl: true,
            check_ssl: false,
            headers: '',
            keyword: '',
            port: 80,
            tags: [],
            group: '',
            escalation_policy_id: null,
        },
    });

    const handleCreate = (values) => {
        router.post('/monitors', values, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Monitor created successfully',
                    color: 'green',
                });
                closeCreate();
                createForm.reset();
            },
            onError: () => {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to create monitor',
                    color: 'red',
                });
            },
        });
    };

    const handleEdit = (monitor) => {
        setSelectedMonitor(monitor);

        editForm.setValues({
            name: monitor.name,
            url: monitor.url,
            type: monitor.type,
            interval: monitor.interval,
            timeout: monitor.timeout || 30,
            method: monitor.method || 'GET',
            verify_ssl: monitor.verify_ssl ?? true,
            headers: monitor.headers ? JSON.stringify(monitor.headers) : '',
            keyword: monitor.keyword || '',
            port: monitor.port || 80,
            check_ssl: monitor.check_ssl || false,
            escalation_policy_id: monitor.escalation_policy_id,
        });

        openEdit();
    };

    const handleUpdate = (values) => {
        router.put(`/monitors/${selectedMonitor.id}`, values, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Monitor updated successfully',
                    color: 'green',
                });
                closeEdit();
            },
            onError: () => {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to update monitor',
                    color: 'red',
                });
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this monitor?')) {
            router.delete(`/monitors/${id}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Monitor deleted successfully',
                        color: 'green',
                    });
                },
            });
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            up: { color: 'green', icon: IconCircleCheck, label: 'Up' },
            disabled: { color: 'gray', icon: IconClock, label: 'Disabled' },
            pending: { color: 'orange', icon: IconClock, label: 'Pending' },
            down: { color: 'red', icon: IconCircleX, label: 'Down' },
        };

        const { color, icon: Icon, label } = config[status] || config.pending;

        return (
            <Badge color={color} variant="light" leftSection={<Icon size={12} />}>
                {label}
            </Badge>
        );
    };

    const getTypeBadge = (type) => {
        const colors = {
            http: 'blue',
            ping: 'cyan',
            port: 'violet',
            keyword: 'grape',
        };

        return (
            <Badge color={colors[type] || 'gray'} variant="dot">
                {type.toUpperCase()}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            Monitors
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Manage your uptime monitors
                        </Text>
                    </div>
                    {auth.is_admin && (
                        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
                            Add Monitor
                        </Button>
                    )}
                </Group>

                <Paper shadow="sm" radius="md" withBorder>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>URL</Table.Th>
                                <Table.Th>Type</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Recent Checks</Table.Th>
                                <Table.Th>Interval</Table.Th>
                                <Table.Th>Last Check</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Deferred data="monitors" fallback={
                                Array(5).fill(0).map((_, i) => (
                                    <Table.Tr key={i}>
                                        <Table.Td><Skeleton height={20} radius="md" /></Table.Td>
                                        <Table.Td><Skeleton height={20} radius="md" /></Table.Td>
                                        <Table.Td><Skeleton height={24} width={60} radius="xl" /></Table.Td>
                                        <Table.Td><Skeleton height={24} width={60} radius="xl" /></Table.Td>
                                        <Table.Td><Group gap={2}>{Array(10).fill(0).map((_, j) => <Skeleton key={j} height={24} width={8} radius={2} />)}</Group></Table.Td>
                                        <Table.Td><Skeleton height={20} width={40} radius="md" /></Table.Td>
                                        <Table.Td><Skeleton height={20} width={100} radius="md" /></Table.Td>
                                        <Table.Td><Skeleton height={32} width={32} radius="md" /></Table.Td>
                                    </Table.Tr>
                                ))
                            }>
                                {monitors?.length === 0 ? (
                                    <Table.Tr>
                                        <Table.Td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                                            <Text c="dimmed">No monitors yet. Create your first one!</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ) : (
                                    monitors?.map((monitor) => (
                                        <Table.Tr key={monitor.id}>
                                            <Table.Td>
                                                <Link href={`/monitors/${monitor.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <Text fw={600} className="monitor-name-link" style={{ cursor: 'pointer' }}>
                                                        {monitor.name}
                                                    </Text>
                                                </Link>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm" c="dimmed" style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {monitor.url}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>{getTypeBadge(monitor.type)}</Table.Td>
                                            <Table.Td>{getStatusBadge(monitor.status)}</Table.Td>
                                            <Table.Td>
                                                <Group gap={2}>
                                                    {monitor.recent_heartbeats && monitor.recent_heartbeats.length > 0 ? (
                                                        monitor.recent_heartbeats.slice(0, 10).reverse().map((hb, idx) => (
                                                            <div
                                                                key={idx}
                                                                style={{
                                                                    width: 8,
                                                                    height: 24,
                                                                    backgroundColor: hb.is_up ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-red-6)',
                                                                    borderRadius: 2,
                                                                    opacity: 0.8,
                                                                }}
                                                                title={`${hb.is_up ? 'Up' : 'Down'} - ${hb.checked_at}`}
                                                            />
                                                        ))
                                                    ) : (
                                                        <Text size="xs" c="dimmed">No data</Text>
                                                    )}
                                                </Group>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">{monitor.interval}s</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm" c="dimmed">
                                                    {monitor.last_checked_at || 'Never'}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Menu shadow="md" width={200}>
                                                    <Menu.Target>
                                                        <ActionIcon variant="subtle" color="gray">
                                                            <IconDots size={16} />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        <Menu.Item
                                                            leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                                            component={Link}
                                                            href={`/monitors/${monitor.id}`}
                                                        >
                                                            View Details
                                                        </Menu.Item>

                                                        {auth.is_admin && (
                                                            <>
                                                                <Menu.Item
                                                                    leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                                                    onClick={() => handleEdit(monitor)}
                                                                >
                                                                    Edit
                                                                </Menu.Item>
                                                                <Menu.Item
                                                                    color="red"
                                                                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                                                    onClick={() => handleDelete(monitor.id)}
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
                            </Deferred>
                        </Table.Tbody>
                    </Table>
                </Paper>
            </Stack>

            <Modal opened={createOpened} onClose={closeCreate} title="Create Monitor" size="lg">
                <Deferred data="escalationPolicies" fallback={<Skeleton height={300} radius="md" />}>
                    <MonitorForm form={createForm} onSubmit={handleCreate} submitLabel="Create Monitor" escalationPolicies={escalationPolicies} />
                </Deferred>
            </Modal>

            <Modal opened={editOpened} onClose={closeEdit} title="Edit Monitor" size="lg">
                <MonitorForm form={editForm} onSubmit={handleUpdate} submitLabel="Update Monitor" escalationPolicies={escalationPolicies} />
            </Modal>
        </AppLayout>
    );
}

export default MonitorsIndex;
