import React from 'react';
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
    Checkbox,
    Stack,
    Paper,
    Code,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { router } from '@inertiajs/react';
import { IconPlus, IconTrash, IconWebhook, IconKey } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function WebhooksIndex({ webhooks }) {
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            name: '',
            url: '',
            events: ['incident.started', 'incident.resolved'],
            is_active: true,
        },
    });

    const handleSubmit = (values) => {
        router.post('/webhooks', values, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Webhook added successfully',
                    color: 'green',
                });
                close();
                form.reset();
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this webhook?')) {
            router.delete(`/webhooks/${id}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Deleted',
                        message: 'Webhook removed',
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
                        <Title order={2} fw={900}>Outgoing Webhooks</Title>
                        <Text c="dimmed" size="sm">Receive real-time notifications to your own endpoints</Text>
                    </div>
                    <Button leftSection={<IconPlus size={16} />} onClick={open}>
                        Add Webhook
                    </Button>
                </Group>

                <Paper shadow="sm" radius="md" withBorder>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Target URL</Table.Th>
                                <Table.Th>Events</Table.Th>
                                <Table.Th>Secret</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {webhooks.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                        <Text c="dimmed">No webhooks configured yet.</Text>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                webhooks.map((webhook) => (
                                    <Table.Tr key={webhook.id}>
                                        <Table.Td><Text fw={600}>{webhook.name}</Text></Table.Td>
                                        <Table.Td><Text size="xs" c="dimmed">{webhook.url}</Text></Table.Td>
                                        <Table.Td>
                                            <Group gap={4}>
                                                {webhook.events.map(e => (
                                                    <Badge key={e} size="xs" variant="outline">{e}</Badge>
                                                ))}
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <IconKey size={14} color="gray" />
                                                <Text size="xs" ff="monospace">••••••••</Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={webhook.is_active ? 'green' : 'gray'} variant="light">
                                                {webhook.is_active ? 'Active' : 'Disabled'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <ActionIcon color="red" variant="subtle" onClick={() => handleDelete(webhook.id)}>
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Paper>

                <Paper p="md" radius="md" withBorder bg="gray.0">
                    <Group align="flex-start">
                        <IconWebhook size={24} color="blue" />
                        <div style={{ flex: 1 }}>
                            <Text fw={600} size="sm">Webhook Documentation</Text>
                            <Text size="xs" c="dimmed" mt={4}>
                                We send a JSON payload with <Code>X-PingPanther-Signature</Code> header.
                                Verify it using HMAC-SHA256 with your secret token.
                            </Text>
                        </div>
                    </Group>
                </Paper>
            </Stack>

            <Modal opened={opened} onClose={close} title="Add New Webhook" size="lg">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        <TextInput
                            label="Friendly Name"
                            placeholder="My Internal API"
                            required
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            label="Payload URL"
                            placeholder="https://api.yourdomain.com/webhooks"
                            required
                            {...form.getInputProps('url')}
                        />

                        <Text size="sm" fw={500} mt="sm">Trigger Events</Text>
                        <Checkbox.Group {...form.getInputProps('events')}>
                            <Group mt="xs">
                                <Checkbox value="incident.started" label="Incident Started" />
                                <Checkbox value="incident.resolved" label="Incident Resolved" />
                            </Group>
                        </Checkbox.Group>

                        <Group justify="flex-end" mt="xl">
                            <Button variant="default" onClick={close}>Cancel</Button>
                            <Button type="submit">Create Webhook</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </AppLayout>
    );
}

export default WebhooksIndex;
