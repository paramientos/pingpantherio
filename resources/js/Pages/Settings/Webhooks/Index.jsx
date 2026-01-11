import React from 'react';
import SettingsLayout from '../SettingsLayout';
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
        router.post('/settings/webhooks', values, {
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
            router.delete(`/settings/webhooks/${id}`, {
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
        <SettingsLayout activeTab="webhooks">
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Title order={4}>Outgoing Webhooks</Title>
                        <Text c="dimmed" size="xs">Receive real-time notifications</Text>
                    </div>
                    <Button size="xs" leftSection={<IconPlus size={14} />} onClick={open}>
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

                <Paper p="md" radius="md" withBorder>
                    <Stack gap="md">
                        <Group align="flex-start">
                            <IconWebhook size={24} style={{ color: 'var(--mantine-primary-color-filled)' }} />
                            <div style={{ flex: 1 }}>
                                <Text fw={600} size="sm">Webhook Security & Verification</Text>
                                <Text size="xs" c="dimmed" mt={4}>
                                    All webhook requests include a signature for verification
                                </Text>
                            </div>
                        </Group>

                        <div>
                            <Text size="sm" fw={500} mb="xs">Request Headers</Text>
                            <Code block>
                                {`X-PingPanther-Event: incident.started
X-PingPanther-Signature: abc123...
X-PingPanther-Delivery: unique-job-id`}
                            </Code>
                        </div>

                        <div>
                            <Text size="sm" fw={500} mb="xs">Payload Example</Text>
                            <Code block>
                                {`{
  "event": "incident.started",
  "timestamp": 1736598000,
  "data": {
    "monitor_id": 1,
    "monitor_name": "API Server",
    "error": "Connection timeout"
  }
}`}
                            </Code>
                        </div>

                        <div>
                            <Text size="sm" fw={500} mb="xs">Signature Verification (Node.js)</Text>
                            <Code block>
                                {`const crypto = require('crypto');

function verifySignature(req, secret) {
  const signature = req.headers['x-pingpanther-signature'];
  const timestamp = req.body.timestamp;
  const payload = JSON.stringify(req.body);
  
  const expected = crypto
    .createHmac('sha256', secret)
    .update(timestamp + '.' + payload)
    .digest('hex');
  
  return signature === expected;
}`}
                            </Code>
                        </div>

                        <div>
                            <Text size="sm" fw={500} mb="xs">Signature Verification (PHP)</Text>
                            <Code block>
                                {`$signature = $_SERVER['HTTP_X_PINGPANTHER_SIGNATURE'];
$payload = file_get_contents('php://input');
$data = json_decode($payload, true);
$timestamp = $data['timestamp'];

$expected = hash_hmac(
    'sha256',
    $timestamp . '.' . $payload,
    $secretToken
);

if (!hash_equals($expected, $signature)) {
    http_response_code(401);
    exit('Invalid signature');
}`}
                            </Code>
                        </div>

                        <div>
                            <Text size="sm" fw={500} mb="xs">Signature Verification (Python)</Text>
                            <Code block>
                                {`import hmac
import hashlib
import json

def verify_signature(request, secret):
    signature = request.headers.get('X-PingPanther-Signature')
    payload = request.get_data(as_text=True)
    data = json.loads(payload)
    timestamp = data['timestamp']
    
    expected = hmac.new(
        secret.encode(),
        f"{timestamp}.{payload}".encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected)`}
                            </Code>
                        </div>
                    </Stack>
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
        </SettingsLayout>
    );
}

export default WebhooksIndex;
