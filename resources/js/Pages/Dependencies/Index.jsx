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
    Select,
    Paper,
    Divider,
    ThemeIcon,
    ActionIcon,
    Tooltip,
} from '@mantine/core';
import { useForm, router } from '@inertiajs/react';
import {
    IconPlus,
    IconTrash,
    IconBinaryTree,
    IconArrowRight,
    IconAlertTriangle,
    IconCircleCheck,
    IconCircleX,
    IconHierarchy2
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function DependencyIndex({ monitors, allMonitors }) {
    const [opened, setOpened] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        monitor_id: '',
        depends_on_monitor_id: '',
        relationship_type: 'depends_on',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('dependencies.store'), {
            onSuccess: () => {
                setOpened(false);
                reset();
                notifications.show({
                    title: 'Success',
                    message: 'Dependency relationship established',
                    color: 'green',
                });
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this dependency?')) {
            router.delete(route('dependencies.destroy', id), {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Dependency removed',
                        color: 'green',
                    });
                },
            });
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'up') return <IconCircleCheck size={16} color="var(--mantine-color-green-6)" />;
        return <IconCircleX size={16} color="var(--mantine-color-red-6)" />;
    };

    const getImpactLevel = (dependentsCount) => {
        if (dependentsCount === 0) return { label: 'Low', color: 'gray' };
        if (dependentsCount < 3) return { label: 'Medium', color: 'orange' };
        return { label: 'High', color: 'red' };
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <div>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            Dependency Mapping
                        </Title>
                        <Text c="dimmed" size="sm">
                            Map relationships between your monitors to see the potential impact of a failure.
                        </Text>
                    </div>
                    <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
                        New Relationship
                    </Button>
                </Group>

                <Grid gutter="md">
                    {monitors.map((monitor) => (
                        <Grid.Col key={monitor.id} span={{ base: 12, md: 6 }}>
                            <Card shadow="sm" radius="md" withBorder p="lg">
                                <Group justify="space-between" mb="md">
                                    <Group gap="sm">
                                        {getStatusIcon(monitor.status)}
                                        <Text fw={700} size="lg">{monitor.name}</Text>
                                    </Group>
                                    <Badge
                                        color={getImpactLevel(monitor.dependents.length).color}
                                        variant="light"
                                    >
                                        Impact: {getImpactLevel(monitor.dependents.length).label}
                                    </Badge>
                                </Group>

                                <Divider mb="md" variant="dotted" />

                                <Grid gutter="sm">
                                    <Grid.Col span={6}>
                                        <Text size="xs" fw={700} c="dimmed" mb="xs" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Depends on
                                        </Text>
                                        <Stack gap={4}>
                                            {monitor.dependencies.length > 0 ? monitor.dependencies.map((dep) => (
                                                <Paper key={dep.id} withBorder p="xs" radius="sm">
                                                    <Group justify="space-between" gap="xs">
                                                        <Group gap={6} style={{ flex: 1 }}>
                                                            {getStatusIcon(dep.status)}
                                                            <Text size="xs" fw={600} truncate>{dep.name}</Text>
                                                        </Group>
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="red"
                                                            size="xs"
                                                            onClick={() => handleDelete(dep.id)}
                                                        >
                                                            <IconTrash size={12} />
                                                        </ActionIcon>
                                                    </Group>
                                                </Paper>
                                            )) : (
                                                <Text size="xs" c="dimmed" italic>No dependencies</Text>
                                            )}
                                        </Stack>
                                    </Grid.Col>

                                    <Grid.Col span={6}>
                                        <Text size="xs" fw={700} c="dimmed" mb="xs" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Impacts
                                        </Text>
                                        <Stack gap={4}>
                                            {monitor.dependents.length > 0 ? monitor.dependents.map((dep) => (
                                                <Paper key={dep.id} withBorder p="xs" radius="sm" bg="gray.0">
                                                    <Group gap={6}>
                                                        {getStatusIcon(dep.status)}
                                                        <Text size="xs" fw={600} truncate>{dep.name}</Text>
                                                    </Group>
                                                </Paper>
                                            )) : (
                                                <Text size="xs" c="dimmed" italic>No dependents</Text>
                                            )}
                                        </Stack>
                                    </Grid.Col>
                                </Grid>

                                {monitor.status !== 'up' && monitor.dependents.length > 0 && (
                                    <Alert
                                        icon={<IconAlertTriangle size={16} />}
                                        color="red"
                                        mt="md"
                                        p="xs"
                                        title={<Text size="xs" fw={700}>CRITICAL IMPACT</Text>}
                                    >
                                        <Text size="xs">
                                            This monitor is DOWN and affecting {monitor.dependents.length} other service(s).
                                        </Text>
                                    </Alert>
                                )}
                            </Card>
                        </Grid.Col>
                    ))}

                    {monitors.length === 0 && (
                        <Grid.Col span={12}>
                            <Card shadow="sm" radius="md" withBorder p="xl" style={{ textAlign: 'center' }}>
                                <IconBinaryTree size={48} stroke={1.5} color="gray" style={{ margin: '0 auto 16px' }} />
                                <Text fw={600} mb="xs">No relationships defined</Text>
                                <Text size="sm" c="dimmed" mb="xl">
                                    Define dependencies between your services to enable impact analysis.
                                </Text>
                                <Button variant="light" onClick={() => setOpened(true)}>Map your first dependency</Button>
                            </Card>
                        </Grid.Col>
                    )}
                </Grid>

                <Modal opened={opened} onClose={() => setOpened(false)} title="Add Dependency Relationship" size="md">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <Select
                                label="Source Monitor"
                                description="The service that has a dependency"
                                placeholder="Select monitor"
                                data={allMonitors}
                                value={data.monitor_id}
                                onChange={(val) => setData('monitor_id', val)}
                                error={errors.monitor_id}
                                required
                            />

                            <Group justify="center" my="xs">
                                <ThemeIcon size="lg" radius="xl" variant="light">
                                    <IconArrowRight size={20} />
                                </ThemeIcon>
                            </Group>

                            <Select
                                label="Depends on"
                                description="The service it relies upon"
                                placeholder="Select monitor"
                                data={allMonitors}
                                value={data.depends_on_monitor_id}
                                onChange={(val) => setData('depends_on_monitor_id', val)}
                                error={errors.depends_on_monitor_id}
                                required
                            />

                            <Select
                                label="Relationship Type"
                                data={[
                                    { value: 'depends_on', label: 'Depends on (Logical Dependency)' },
                                    { value: 'impacts', label: 'Impacts (Direct Effect)' },
                                    { value: 'related', label: 'Related (Informational)' },
                                ]}
                                value={data.relationship_type}
                                onChange={(val) => setData('relationship_type', val)}
                                required
                            />

                            <Group justify="flex-end" mt="xl">
                                <Button variant="default" onClick={() => setOpened(false)}>Cancel</Button>
                                <Button type="submit" loading={processing}>Establish Link</Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </Stack>
        </AppLayout>
    );
}
