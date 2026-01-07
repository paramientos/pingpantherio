import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Title,
    Text,
    Button,
    Card,
    Group,
    Stack,
    Badge,
    Grid,
    Modal,
    TextInput,
    NumberInput,
    Paper,
    Divider,
    ThemeIcon,
    ActionIcon,
    Table,
    Tooltip,
} from '@mantine/core';
import { useForm, router } from '@inertiajs/react';
import {
    IconPlus,
    IconTrash,
    IconSwords,
    IconCircleCheck,
    IconCircleX,
    IconBolt,
    IconExternalLink
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function CompetitorIndex({ competitors }) {
    const [opened, setOpened] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        url: '',
        company_name: '',
        interval: 300,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('competitors.store'), {
            onSuccess: () => {
                setOpened(false);
                reset();
                notifications.show({
                    title: 'Success',
                    message: 'Competitor monitor added',
                    color: 'green',
                });
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this competitor?')) {
            router.delete(route('competitors.destroy', id), {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Competitor removed',
                        color: 'green',
                    });
                },
            });
        }
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <div>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            Competitive Monitoring
                        </Title>
                        <Text c="dimmed" size="sm">
                            Keep an eye on your rivals. Track their uptime and response times to stay ahead.
                        </Text>
                    </div>
                    <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
                        Add Competitor
                    </Button>
                </Group>

                <Card shadow="sm" radius="md" withBorder p="0">
                    <Table verticalSpacing="md" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Competitor</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Response Time</Table.Th>
                                <Table.Th>Last Checked</Table.Th>
                                <Table.Th style={{ width: 100 }}></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {competitors.length > 0 ? competitors.map((competitor) => (
                                <Table.Tr key={competitor.id}>
                                    <Table.Td>
                                        <Group gap="sm">
                                            <div>
                                                <Text size="sm" fw={700}>{competitor.name}</Text>
                                                <Text size="xs" c="dimmed">{competitor.company_name || 'Individual URL'}</Text>
                                            </div>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        {competitor.is_up === null ? (
                                            <Badge variant="dot" color="gray">Pending</Badge>
                                        ) : competitor.is_up ? (
                                            <Badge variant="dot" color="green">ONLINE</Badge>
                                        ) : (
                                            <Badge variant="dot" color="red">OFFLINE</Badge>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap={4}>
                                            <IconBolt size={14} style={{ color: 'var(--mantine-primary-color-filled)' }} />
                                            <Text size="sm" fw={600}>{competitor.response_time || '0'}ms</Text>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="xs" c="dimmed">
                                            {competitor.last_checked_at ? new Date(competitor.last_checked_at).toLocaleString() : 'Never'}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <Tooltip label="Open URL">
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="gray"
                                                    component="a"
                                                    href={competitor.url}
                                                    target="_blank"
                                                >
                                                    <IconExternalLink size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                            <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(competitor.id)}>
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            )) : (
                                <Table.Tr>
                                    <Table.Td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Stack align="center" gap="md">
                                            <IconSwords size={48} stroke={1.5} color="gray" />
                                            <Text fw={600}>No competitors tracked yet</Text>
                                            <Text size="sm" c="dimmed">Add your rivals to see how you perform against them.</Text>
                                        </Stack>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>

                <Modal opened={opened} onClose={() => setOpened(false)} title="Add Competitor to Track" size="md">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="Name"
                                placeholder="Main Rival API"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />
                            <TextInput
                                label="URL"
                                placeholder="https://api.competitor.com/health"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                error={errors.url}
                                required
                            />
                            <TextInput
                                label="Company Name"
                                placeholder="Acme Corp"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                error={errors.company_name}
                            />
                            <NumberInput
                                label="Check Interval (seconds)"
                                value={data.interval}
                                onChange={(val) => setData('interval', val)}
                                min={60}
                                error={errors.interval}
                                required
                            />

                            <Group justify="flex-end" mt="xl">
                                <Button variant="default" onClick={() => setOpened(false)}>Cancel</Button>
                                <Button type="submit" loading={processing}>Start Tracking</Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </Stack>
        </AppLayout>
    );
}
