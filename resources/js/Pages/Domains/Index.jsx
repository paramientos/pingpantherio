import React, { useState } from 'react';
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
    Card,
    Modal,
    TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash, IconWorld, IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function DomainsIndex({ domains }) {
    const { auth } = usePage().props;
    const isReadOnly = auth.user.role !== 'admin';
    const [modalOpened, setModalOpened] = useState(false);

    const form = useForm({
        initialValues: {
            domain: '',
        },
        validate: {
            domain: (value) => (value.length < 3 ? 'Invalid domain' : null),
        },
    });

    const handleCreate = (values) => {
        router.post('/domains', values, {
            onSuccess: () => {
                setModalOpened(false);
                form.reset();
                notifications.show({
                    title: 'Success',
                    message: 'Domain added for monitoring',
                    color: 'green',
                });
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Stop monitoring this domain?')) {
            router.delete(`/domains/${id}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Deleted',
                        message: 'Domain monitoring removed',
                        color: 'red',
                    });
                },
            });
        }
    };

    const getExpiryBadge = (days) => {
        if (days === null) return <Badge color="gray">Unknown</Badge>;
        if (days < 7) return <Badge color="red">{days} days left</Badge>;
        if (days < 30) return <Badge color="orange">{days} days left</Badge>;
        return <Badge color="green">{days} days left</Badge>;
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            Domain Monitoring
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Track domain expiration dates and WHOIS changes
                        </Text>
                    </div>
                    {!isReadOnly && (
                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={() => setModalOpened(true)}
                        >
                            Add Domain
                        </Button>
                    )}
                </Group>

                <Card padding="0" radius="md">
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Domain</Table.Th>
                                <Table.Th>Expiration</Table.Th>
                                <Table.Th>Time Left</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Last Checked</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {domains.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Stack align="center" gap="md">
                                            <IconWorld size={40} stroke={1.5} color="gray" />
                                            <Text c="dimmed">No domains monitored yet.</Text>
                                        </Stack>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                domains.map((domain) => (
                                    <Table.Tr key={domain.id}>
                                        <Table.Td>
                                            <Text fw={600} size="sm">{domain.domain}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{domain.expires_at || 'Checking...'}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            {getExpiryBadge(domain.days_left)}
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={domain.is_active ? 'green' : 'gray'} variant="light">
                                                {domain.is_active ? 'Active' : 'Paused'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="xs" c="dimmed">{domain.last_checked || 'Never'}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            {!isReadOnly && (
                                                <ActionIcon
                                                    color="red"
                                                    variant="subtle"
                                                    onClick={() => handleDelete(domain.id)}
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            )}
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>
            </Stack>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Add Domain to Monitor"
                radius="md"
            >
                <form onSubmit={form.onSubmit(handleCreate)}>
                    <Stack gap="md">
                        <TextInput
                            label="Domain Name"
                            placeholder="example.com"
                            required
                            {...form.getInputProps('domain')}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button variant="subtle" onClick={() => setModalOpened(false)}>Cancel</Button>
                            <Button type="submit">Start Tracking</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </AppLayout>
    );
}

export default DomainsIndex;
