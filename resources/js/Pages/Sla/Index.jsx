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
    Progress,
    Grid,
    Modal,
    Select,
    TextInput,
    NumberInput,
    RingProgress,
    Paper,
    Divider,
    Alert,
} from '@mantine/core';
import { useForm, router } from '@inertiajs/react';
import { IconPlus, IconTrash, IconCheck, IconX, IconAlertTriangle, IconTarget, IconClock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function SlaIndex({ slas, monitors }) {
    const [opened, setOpened] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        monitor_id: '',
        name: '',
        uptime_target: 99.9,
        max_downtime_minutes_monthly: 43,
        response_time_target: null,
        period: 'monthly',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sla.store'), {
            onSuccess: () => {
                setOpened(false);
                reset();
                notifications.show({
                    title: 'Success',
                    message: 'SLA configuration created',
                    color: 'green',
                });
            },
        });
    };

    const handleDelete = (slaId) => {
        if (confirm('Are you sure you want to delete this SLA configuration?')) {
            router.delete(route('sla.destroy', slaId), {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'SLA configuration deleted',
                        color: 'green',
                    });
                },
            });
        }
    };

    const getComplianceColor = (isCompliant) => isCompliant ? 'green' : 'red';
    const getUptimeColor = (uptime, target) => {
        if (uptime >= target) return 'green';
        if (uptime >= target - 1) return 'yellow';
        return 'red';
    };

    const criticalSlas = slas.filter(s => !s.is_compliant);

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <div>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            SLA Tracking
                        </Title>
                        <Text c="dimmed" size="sm">
                            Monitor service level agreements and uptime targets
                        </Text>
                    </div>
                    <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
                        Add SLA
                    </Button>
                </Group>

                {criticalSlas.length > 0 && (
                    <Alert icon={<IconAlertTriangle size={16} />} title="SLA Violations" color="red" variant="light">
                        {criticalSlas.length} SLA{criticalSlas.length > 1 ? 's are' : ' is'} currently out of compliance.
                    </Alert>
                )}

                <Grid gutter="md">
                    {slas.map((sla) => (
                        <Grid.Col key={sla.id} span={{ base: 12, md: 6, lg: 4 }}>
                            <Card shadow="sm" radius="md" withBorder p="lg" style={{ height: '100%' }}>
                                <Group justify="space-between" mb="md">
                                    <div style={{ flex: 1 }}>
                                        <Text fw={700} size="lg">{sla.name}</Text>
                                        <Text size="sm" c="dimmed">{sla.monitor_name}</Text>
                                    </div>
                                    <Badge
                                        color={getComplianceColor(sla.is_compliant)}
                                        variant="light"
                                        leftSection={sla.is_compliant ? <IconCheck size={14} /> : <IconX size={14} />}
                                    >
                                        {sla.is_compliant ? 'Compliant' : 'Violation'}
                                    </Badge>
                                </Group>

                                <Divider mb="md" />

                                <Stack gap="md">
                                    <div>
                                        <Group justify="space-between" mb="xs">
                                            <Group gap="xs">
                                                <IconTarget size={18} style={{ color: 'var(--mantine-primary-color-filled)' }} />
                                                <Text size="xs" fw={600} c="dimmed">UPTIME TARGET</Text>
                                            </Group>
                                            <Text size="xs" fw={700}>{sla.uptime_target}%</Text>
                                        </Group>
                                        <RingProgress
                                            size={140}
                                            thickness={14}
                                            sections={[
                                                {
                                                    value: sla.current_uptime,
                                                    color: getUptimeColor(sla.current_uptime, sla.uptime_target)
                                                }
                                            ]}
                                            label={
                                                <div style={{ textAlign: 'center' }}>
                                                    <Text fw={700} size="xl">{sla.current_uptime}%</Text>
                                                    <Text size="xs" c="dimmed">Current</Text>
                                                </div>
                                            }
                                            style={{ margin: '0 auto' }}
                                        />
                                    </div>

                                    {sla.max_downtime_minutes && (
                                        <Paper withBorder p="sm" radius="md">
                                            <Group gap="xs" mb="xs">
                                                <IconClock size={18} style={{ color: 'var(--mantine-color-orange-filled)' }} />
                                                <Text size="xs" fw={600} c="dimmed">DOWNTIME BUDGET</Text>
                                            </Group>
                                            <Progress
                                                value={(sla.current_downtime_minutes / sla.max_downtime_minutes) * 100}
                                                color={sla.current_downtime_minutes > sla.max_downtime_minutes ? 'red' : 'blue'}
                                                size="lg"
                                                radius="xl"
                                            />
                                            <Group justify="space-between" mt="xs">
                                                <Text size="xs" c="dimmed">
                                                    {sla.current_downtime_minutes} / {sla.max_downtime_minutes} min
                                                </Text>
                                                <Text size="xs" fw={700} c={sla.current_downtime_minutes > sla.max_downtime_minutes ? 'red' : 'blue'}>
                                                    {Math.max(0, sla.max_downtime_minutes - sla.current_downtime_minutes)} min left
                                                </Text>
                                            </Group>
                                        </Paper>
                                    )}

                                    <Badge variant="outline" fullWidth>
                                        Period: {sla.period.charAt(0).toUpperCase() + sla.period.slice(1)}
                                    </Badge>
                                </Stack>

                                <Group justify="flex-end" mt="xl">
                                    <Button
                                        variant="subtle"
                                        color="red"
                                        size="xs"
                                        leftSection={<IconTrash size={14} />}
                                        onClick={() => handleDelete(sla.id)}
                                    >
                                        Delete
                                    </Button>
                                </Group>
                            </Card>
                        </Grid.Col>
                    ))}

                    {slas.length === 0 && (
                        <Grid.Col span={12}>
                            <Card shadow="sm" radius="md" withBorder p="xl" style={{ textAlign: 'center' }}>
                                <IconTarget size={48} stroke={1.5} color="gray" style={{ margin: '0 auto 16px' }} />
                                <Text fw={600} mb="xs">No SLA configurations yet</Text>
                                <Text size="sm" c="dimmed" mb="xl">
                                    Set uptime targets and track compliance for your critical services.
                                </Text>
                                <Button variant="light" onClick={() => setOpened(true)}>Create your first SLA</Button>
                            </Card>
                        </Grid.Col>
                    )}
                </Grid>

                <Modal opened={opened} onClose={() => setOpened(false)} title="Add SLA Configuration" size="lg">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <Select
                                label="Monitor"
                                placeholder="Select a monitor"
                                data={monitors}
                                value={data.monitor_id}
                                onChange={(val) => setData('monitor_id', val)}
                                error={errors.monitor_id}
                                required
                            />
                            <TextInput
                                label="SLA Name"
                                placeholder="Production API SLA"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />
                            <NumberInput
                                label="Uptime Target (%)"
                                description="e.g., 99.9% for three nines"
                                value={data.uptime_target}
                                onChange={(val) => setData('uptime_target', val)}
                                min={0}
                                max={100}
                                step={0.1}
                                decimalScale={2}
                                error={errors.uptime_target}
                                required
                            />
                            <NumberInput
                                label="Max Downtime (minutes/month)"
                                description="Optional: e.g., 43 minutes for 99.9%"
                                value={data.max_downtime_minutes_monthly}
                                onChange={(val) => setData('max_downtime_minutes_monthly', val)}
                                min={0}
                                error={errors.max_downtime_minutes_monthly}
                            />
                            <Select
                                label="Period"
                                data={[
                                    { value: 'daily', label: 'Daily' },
                                    { value: 'weekly', label: 'Weekly' },
                                    { value: 'monthly', label: 'Monthly' },
                                ]}
                                value={data.period}
                                onChange={(val) => setData('period', val)}
                                error={errors.period}
                                required
                            />

                            <Group justify="flex-end" mt="xl">
                                <Button variant="default" onClick={() => setOpened(false)}>Cancel</Button>
                                <Button type="submit" loading={processing}>Create SLA</Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </Stack>
        </AppLayout>
    );
}
