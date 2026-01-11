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
    Select,
    NumberInput,
    Paper,
    Divider,
    ActionIcon,
    Table,
    Avatar,
} from '@mantine/core';
import { useForm, router, usePage } from '@inertiajs/react';
import { IconPlus, IconTrash, IconCalendarStats, IconUserCheck, IconClock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function OnCallIndex({ schedules, teamMembers }) {
    const { auth } = usePage().props;
    const [opened, setOpened] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        timezone: 'UTC',
        rotations: [
            { user_id: '', duration_days: 7 }
        ],
    });

    const addRotationRow = () => {
        setData('rotations', [...data.rotations, { user_id: '', duration_days: 7 }]);
    };

    const removeRotationRow = (index) => {
        const newRotations = [...data.rotations];
        newRotations.splice(index, 1);
        setData('rotations', newRotations);
    };

    const updateRotation = (index, field, value) => {
        const newRotations = [...data.rotations];
        newRotations[index][field] = value;
        setData('rotations', newRotations);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('on-call.store'), {
            onSuccess: () => {
                setOpened(false);
                reset();
                notifications.show({ title: 'Success', message: 'On-call schedule created', color: 'green' });
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            router.delete(route('on-call.destroy', id), {
                onSuccess: () => {
                    notifications.show({ title: 'Success', message: 'Schedule deleted', color: 'green' });
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
                            On-Call Schedules
                        </Title>
                        <Text c="dimmed" size="sm">
                            Manage team rotations and ensure someone is always ready to respond to alerts.
                        </Text>
                    </div>

                    {auth.is_admin && (
                        <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
                            Create Schedule
                        </Button>
                    )}
                </Group>

                <Grid gutter="md">
                    {schedules.map((schedule) => (
                        <Grid.Col key={schedule.id} span={{ base: 12, md: 6 }}>
                            <Card shadow="sm" radius="md" withBorder p="lg">
                                <Group justify="space-between" mb="xs">
                                    <Text fw={700} size="lg">{schedule.name}</Text>
                                    <Badge color="gray" variant="light">{schedule.timezone}</Badge>
                                </Group>

                                <Paper withBorder p="md" radius="sm" mb="md">
                                    <Group justify="space-between">
                                        <Group gap="sm">
                                            <IconUserCheck size={20} style={{ color: 'var(--mantine-primary-color-filled)' }} />
                                            <div>
                                                <Text size="xs" fw={700} c="dimmed">CURRENT ON-CALL</Text>
                                                <Text size="sm" fw={600}>{schedule.current_on_call}</Text>
                                            </div>
                                        </Group>
                                        <IconClock size={20} color="gray" />
                                    </Group>
                                </Paper>

                                <Text size="xs" fw={700} c="dimmed" mb="xs">ROTATION ORDER</Text>
                                <Stack gap={4}>
                                    {schedule.rotations.map((rot, idx) => (
                                        <Group key={rot.id} justify="space-between" wrap="nowrap">
                                            <Group gap="xs">
                                                <Text size="xs" c="dimmed">{idx + 1}.</Text>
                                                <Text size="sm">{rot.user.name}</Text>
                                            </Group>
                                            <Text size="xs" c="dimmed">{rot.duration_days} days</Text>
                                        </Group>
                                    ))}
                                </Stack>

                                <Divider my="md" />

                                <Group justify="flex-end">
                                    <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(schedule.id)}>
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </Card>
                        </Grid.Col>
                    ))}

                    {schedules.length === 0 && (
                        <Grid.Col span={12}>
                            <Card shadow="sm" radius="md" withBorder p="xl" style={{ textAlign: 'center' }}>
                                <IconCalendarStats size={48} stroke={1.5} color="gray" style={{ margin: '0 auto 16px' }} />
                                <Text fw={600} mb="xs">No on-call schedules yet</Text>
                                <Text size="sm" c="dimmed" mb="xl">
                                    Set up rotations to automatically manage alert assignments among your team.
                                </Text>

                                {auth.is_admin && (
                                    <Button variant="light" onClick={() => setOpened(true)}>Set up first schedule</Button>
                                )}
                            </Card>
                        </Grid.Col>
                    )}
                </Grid>

                <Modal opened={opened} onClose={() => setOpened(false)} title="Create On-Call Schedule" size="lg">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="Schedule Name"
                                placeholder="Engineering Primary"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />

                            <Select
                                label="Timezone"
                                data={['UTC', 'Europe/Istanbul', 'America/New_York', 'Europe/London']}
                                value={data.timezone}
                                onChange={(val) => setData('timezone', val)}
                                required
                            />

                            <Divider label="Rotation Steps" labelPosition="center" my="sm" />

                            {data.rotations.map((rotation, index) => (
                                <Group key={index} align="flex-end" grow>
                                    <Select
                                        label={index === 0 ? "Team Member" : null}
                                        placeholder="Select user"
                                        data={teamMembers}
                                        value={rotation.user_id}
                                        onChange={(val) => updateRotation(index, 'user_id', val)}
                                        required
                                    />
                                    <NumberInput
                                        label={index === 0 ? "Shift (Days)" : null}
                                        value={rotation.duration_days}
                                        onChange={(val) => updateRotation(index, 'duration_days', val)}
                                        min={1}
                                        required
                                    />
                                    <ActionIcon
                                        color="red"
                                        variant="subtle"
                                        onClick={() => removeRotationRow(index)}
                                        disabled={data.rotations.length === 1}
                                        mb={4}
                                    >
                                        <IconTrash size={18} />
                                    </ActionIcon>
                                </Group>
                            ))}

                            <Button variant="light" leftSection={<IconPlus size={16} />} onClick={addRotationRow}>
                                Add Member to Rotation
                            </Button>

                            <Group justify="flex-end" mt="xl">
                                <Button variant="default" onClick={() => setOpened(false)}>Cancel</Button>
                                <Button type="submit" loading={processing}>Create Schedule</Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </Stack>
        </AppLayout>
    );
}
