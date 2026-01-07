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
    Textarea,
    MultiSelect,
    Paper,
    Divider,
    ActionIcon,
} from '@mantine/core';
import { useForm, router } from '@inertiajs/react';
import { IconPlus, IconTrash, IconFileText, IconDeviceFloppy, IconChevronRight } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function PlaybookIndex({ playbooks, monitors }) {
    const [opened, setOpened] = useState(false);
    const [editingPlaybook, setEditingPlaybook] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        content: '',
        monitor_ids: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPlaybook) {
            put(route('playbooks.update', editingPlaybook.id), {
                onSuccess: () => {
                    setOpened(false);
                    setEditingPlaybook(null);
                    reset();
                    notifications.show({ title: 'Success', message: 'Playbook updated', color: 'green' });
                },
            });
        } else {
            post(route('playbooks.store'), {
                onSuccess: () => {
                    setOpened(false);
                    reset();
                    notifications.show({ title: 'Success', message: 'Playbook created', color: 'green' });
                },
            });
        }
    };

    const handleEdit = (playbook) => {
        setEditingPlaybook(playbook);
        setData({
            name: playbook.name,
            content: playbook.content,
            monitor_ids: playbook.monitors ? playbook.monitors.map(m => m.id) : [],
        });
        setOpened(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this playbook?')) {
            router.delete(route('playbooks.destroy', id), {
                onSuccess: () => {
                    notifications.show({ title: 'Success', message: 'Playbook deleted', color: 'green' });
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
                            Incident Playbooks
                        </Title>
                        <Text c="dimmed" size="sm">
                            Step-by-step guides for your team to handle monitor failures efficiently.
                        </Text>
                    </div>
                    <Button leftSection={<IconPlus size={16} />} onClick={() => { setEditingPlaybook(null); reset(); setOpened(true); }}>
                        Create Playbook
                    </Button>
                </Group>

                <Grid gutter="md">
                    {playbooks.map((playbook) => (
                        <Grid.Col key={playbook.id} span={{ base: 12, md: 6 }}>
                            <Card shadow="sm" radius="md" withBorder p="lg">
                                <Group justify="space-between" mb="xs">
                                    <Text fw={700} size="lg">{playbook.name}</Text>
                                    <Badge variant="light" color="indigo">
                                        {playbook.monitors_count} Monitors
                                    </Badge>
                                </Group>

                                <Text size="sm" c="dimmed" lineClamp={3} mb="md" style={{ fontFamily: 'monospace' }}>
                                    {playbook.content.substring(0, 150)}...
                                </Text>

                                <Divider mb="md" variant="dotted" />

                                <Group justify="flex-end">
                                    <Button variant="subtle" size="xs" onClick={() => handleEdit(playbook)}>
                                        Edit
                                    </Button>
                                    <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(playbook.id)}>
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </Card>
                        </Grid.Col>
                    ))}

                    {playbooks.length === 0 && (
                        <Grid.Col span={12}>
                            <Card shadow="sm" radius="md" withBorder p="xl" style={{ textAlign: 'center' }}>
                                <IconFileText size={48} stroke={1.5} color="gray" style={{ margin: '0 auto 16px' }} />
                                <Text fw={600} mb="xs">No playbooks created yet</Text>
                                <Text size="sm" c="dimmed" mb="xl">
                                    Document how to resolve incidents and attach them to your monitors.
                                </Text>
                                <Button variant="light" onClick={() => setOpened(true)}>Create your first playbook</Button>
                            </Card>
                        </Grid.Col>
                    )}
                </Grid>

                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title={editingPlaybook ? "Edit Playbook" : "Create New Playbook"}
                    size="xl"
                >
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="Playbook Name"
                                placeholder="Database Connection Recovery Guide"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />

                            <Textarea
                                label="Response Instructions (Markdown)"
                                description="Step-by-step guide for on-call engineers."
                                placeholder="1. SSH into the server...\n2. Check logs at /var/log/...\n3. Restart service..."
                                minRows={10}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                error={errors.content}
                                required
                                style={{ fontFamily: 'monospace' }}
                            />

                            <MultiSelect
                                label="Assign to Monitors"
                                description="Select monitors that should use this playbook."
                                placeholder="Pick monitors"
                                data={monitors}
                                value={data.monitor_ids}
                                onChange={(val) => setData('monitor_ids', val)}
                                searchable
                                clearable
                            />

                            <Group justify="flex-end" mt="xl">
                                <Button variant="default" onClick={() => setOpened(false)}>Cancel</Button>
                                <Button type="submit" loading={processing} leftSection={<IconDeviceFloppy size={18} />}>
                                    {editingPlaybook ? "Update Playbook" : "Save Playbook"}
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </Stack>
        </AppLayout>
    );
}
