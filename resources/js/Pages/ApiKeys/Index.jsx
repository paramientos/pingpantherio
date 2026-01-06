import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { usePage, router, Link } from '@inertiajs/react';
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
    Alert,
    CopyButton,
    Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash, IconKey, IconCopy, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function ApiKeysIndex({ apiKeys }) {
    const { flash } = usePage().props;
    const [createModalOpened, setCreateModalOpened] = useState(false);
    const [newKey, setNewKey] = useState(flash?.newKey || null);

    const form = useForm({
        initialValues: {
            name: '',
            expires_at: '',
        },
        validate: {
            name: (value) => (value.length < 3 ? 'Name must have at least 3 characters' : null),
        },
    });

    const handleCreate = (values) => {
        router.post('/api-keys', values, {
            onSuccess: (page) => {
                setCreateModalOpened(false);
                form.reset();
                if (page.props.flash?.newKey) {
                    setNewKey(page.props.flash.newKey);
                }
                notifications.show({
                    title: 'Success',
                    message: 'API Key generated successfully',
                    color: 'green',
                });
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
            router.delete(`/api-keys/${id}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Deleted',
                        message: 'API Key has been revoked',
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
                            API Keys
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Manage your personal access tokens to interact with the PingPanther API
                        </Text>
                    </div>
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={() => setCreateModalOpened(true)}
                    >
                        Generate New Key
                    </Button>
                </Group>

                {newKey && (
                    <Alert
                        variant="light"
                        color="blue"
                        title="New API Key Generated"
                        icon={<IconAlertCircle size={16} />}
                        withCloseButton
                        onClose={() => setNewKey(null)}
                    >
                        <Text size="sm" mb="md">
                            Please copy your new API key now. You won't be able to see it again!
                        </Text>
                        <Group gap="xs">
                            <TextInput
                                value={newKey}
                                readOnly
                                style={{ flex: 1 }}
                                styles={{ input: { fontFamily: 'monospace' } }}
                            />
                            <CopyButton value={newKey}>
                                {({ copied, copy }) => (
                                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                        <ActionIcon color={copied ? 'teal' : 'gray'} variant="light" onClick={copy} size="lg">
                                            {copied ? <IconCheck size={20} /> : <IconCopy size={20} />}
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </CopyButton>
                        </Group>
                    </Alert>
                )}

                <Card padding="0" radius="md">
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Key Preview</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Last Used</Table.Th>
                                <Table.Th>Expires</Table.Th>
                                <Table.Th>Created</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {apiKeys.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Stack align="center" gap="md">
                                            <IconKey size={40} stroke={1.5} color="gray" />
                                            <Text c="dimmed">No API keys found. Generate one to start using the API.</Text>
                                        </Stack>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                apiKeys.map((key) => (
                                    <Table.Tr key={key.id}>
                                        <Table.Td>
                                            <Text fw={600} size="sm">{key.name}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="xs" ff="monospace">{key.key_preview}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={key.is_active ? 'green' : 'gray'} variant="light">
                                                {key.is_active ? 'Active' : 'Revoked'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="xs" c="dimmed">{key.last_used_at || 'Never'}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="xs" c="dimmed">{key.expires_at || 'Never'}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="xs" c="dimmed">{key.created_at}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <ActionIcon
                                                color="red"
                                                variant="subtle"
                                                onClick={() => handleDelete(key.id)}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>
            </Stack>

            <Modal
                opened={createModalOpened}
                onClose={() => setCreateModalOpened(false)}
                title="Generate New API Key"
                radius="md"
            >
                <form onSubmit={form.onSubmit(handleCreate)}>
                    <Stack gap="md">
                        <TextInput
                            label="Key Name"
                            placeholder="e.g. CI/CD Pipeline"
                            required
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            label="Expires At"
                            placeholder="Optional"
                            type="date"
                            {...form.getInputProps('expires_at')}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button variant="subtle" onClick={() => setCreateModalOpened(false)}>Cancel</Button>
                            <Button type="submit">Generate Key</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </AppLayout>
    );
}

export default ApiKeysIndex;
