import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Title,
    Text,
    Button,
    Card,
    Group,
    Stack,
    ActionIcon,
    Badge,
    rem,
    Modal,
    TextInput,
    Textarea,
    Select,
    Timeline,
    Paper,
    Divider,
    NumberInput,
} from '@mantine/core';
import { useForm } from '@inertiajs/react';
import { IconPlus, IconTrash, IconChevronRight, IconClock, IconBell, IconSettingsAutomation } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { router, usePage } from '@inertiajs/react';

export default function EscalationPoliciesIndex({ policies, channels, schedules }) {
    const { auth } = usePage().props;
    const [opened, setOpened] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        rules: [{ alert_channel_id: '', on_call_schedule_id: '', delay_minutes: 0 }],
    });

    const addRule = () => {
        setData('rules', [...data.rules, { alert_channel_id: '', on_call_schedule_id: '', delay_minutes: 5 }]);
    };

    const removeRule = (index) => {
        setData('rules', data.rules.filter((_, i) => i !== index));
    };

    const updateRule = (index, field, value) => {
        const newRules = [...data.rules];
        newRules[index][field] = value;
        setData('rules', newRules);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('escalation-policies.store'), {
            onSuccess: () => {
                setOpened(false);
                reset();
                notifications.show({
                    title: 'Success',
                    message: 'Escalation policy created',
                    color: 'green',
                });
            },
        });
    };

    const handleDelete = (policyId) => {
        if (confirm('Are you sure you want to delete this policy?')) {
            router.delete(route('escalation-policies.destroy', policyId), {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Policy deleted successfully',
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
                            Escalation Policies
                        </Title>
                        <Text c="dimmed" size="sm">
                            Define chains of alerts to ensure critical issues are never missed.
                        </Text>
                    </div>

                    {auth.is_admin && (
                        <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
                            Create Policy
                        </Button>
                    )}
                </Group>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: rem(20) }}>
                    {policies.length === 0 ? (
                        <Card shadow="sm" radius="md" withBorder p="xl" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                            <IconSettingsAutomation size={48} stroke={1.5} color="gray" style={{ margin: '0 auto mb(16)' }} />
                            <Text fw={600} mt="md">No policies yet</Text>
                            <Text size="sm" c="dimmed" mb="xl">Escalation policies help you notify multiple channels in a sequence.</Text>
                            
                            {auth.is_admin && (
                                <Button variant="light" onClick={() => setOpened(true)}>Setup your first policy</Button>
                            )}
                        </Card>
                    ) : (
                        policies.map((policy) => (
                            <Card key={policy.id} shadow="sm" radius="md" withBorder p="lg">
                                <Group justify="space-between" mb="xs">
                                    <Text fw={700} size="lg">{policy.name}</Text>
                                    <Badge variant="outline">{policy.monitors_count} monitors</Badge>
                                </Group>
                                <Text size="sm" c="dimmed" mb="xl" lineClamp={2}>
                                    {policy.description || 'No description provided.'}
                                </Text>

                                <Divider mb="lg" />

                                <Text size="xs" fw={600} c="dimmed" mb="xs">ESCALATION STEPS</Text>
                                <Timeline bulletSize={24} lineWidth={2}>
                                    {policy.steps.map((step, index) => (
                                        <Timeline.Item
                                            key={step.id}
                                            bullet={<IconBell size={12} />}
                                            title={
                                                <Group gap="xs">
                                                    <Text size="sm" fw={600}>{step.channel_name}</Text>
                                                    <Badge size="xs" variant="dot">{step.channel_type}</Badge>
                                                </Group>
                                            }
                                        >
                                            <Text c="dimmed" size="xs">
                                                {index === 0 ? 'Immediately' : `After ${step.delay} minutes`}
                                            </Text>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>

                                {policy.monitors && policy.monitors.length > 0 && (
                                    <>
                                        <Divider my="lg" />
                                        <Text size="xs" fw={600} c="dimmed" mb="xs">ASSIGNED MONITORS</Text>
                                        <Stack gap="xs">
                                            {policy.monitors.slice(0, 3).map((monitor) => (
                                                <Group key={monitor.id} gap="xs">
                                                    <Badge size="xs" variant="dot" color="gray">{monitor.name}</Badge>
                                                </Group>
                                            ))}
                                            {policy.monitors.length > 3 && (
                                                <Text size="xs" c="dimmed">+{policy.monitors.length - 3} more</Text>
                                            )}
                                        </Stack>
                                    </>
                                )}

                                <Group justify="flex-end" mt="xl">
                                    <Button
                                        variant="subtle"
                                        color="red"
                                        size="xs"
                                        leftSection={<IconTrash size={14} />}
                                        onClick={() => handleDelete(policy.id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="light"
                                        size="xs"
                                        onClick={() => router.visit(route('escalation-policies.edit', policy.id))}
                                    >
                                        Edit Policy
                                    </Button>
                                </Group>
                            </Card>
                        ))
                    )}
                </div>

                <Modal opened={opened} onClose={() => setOpened(false)} title="Create Escalation Policy" size="lg">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="Policy Name"
                                placeholder="High Priority Services"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                            />
                            <Textarea
                                label="Description"
                                placeholder="Use this for mission-critical services..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                error={errors.description}
                            />

                            <Divider label="Alert Steps" labelPosition="center" my="md" />

                            <Stack gap="sm">
                                {data.rules.map((rule, index) => (
                                    <Paper key={index} withBorder p="sm">
                                        <Group align="flex-end" gap="sm">
                                            <div style={{ flex: 1 }}>
                                                <Select
                                                    label={index === 0 ? "First Step" : `Step ${index + 1}`}
                                                    placeholder="Channel or On-Call"
                                                    data={[
                                                        { group: 'Alert Channels', items: channels },
                                                        { group: 'On-Call Schedules', items: schedules },
                                                    ]}
                                                    value={rule.alert_channel_id || rule.on_call_schedule_id}
                                                    onChange={(val) => {
                                                        const isSchedule = schedules.some(s => s.value === val);
                                                        if (isSchedule) {
                                                            const newRules = [...data.rules];
                                                            newRules[index].alert_channel_id = null;
                                                            newRules[index].on_call_schedule_id = val;
                                                            setData('rules', newRules);
                                                        } else {
                                                            const newRules = [...data.rules];
                                                            newRules[index].alert_channel_id = val;
                                                            newRules[index].on_call_schedule_id = null;
                                                            setData('rules', newRules);
                                                        }
                                                    }}
                                                    required
                                                />
                                            </div>
                                            {index > 0 && (
                                                <div style={{ width: rem(120) }}>
                                                    <NumberInput
                                                        label="Wait (min)"
                                                        value={rule.delay_minutes}
                                                        onChange={(val) => updateRule(index, 'delay_minutes', val)}
                                                        min={1}
                                                        required
                                                    />
                                                </div>
                                            )}
                                            {data.rules.length > 1 && (
                                                <ActionIcon color="red" variant="light" size="lg" onClick={() => removeRule(index)}>
                                                    <IconTrash size={18} />
                                                </ActionIcon>
                                            )}
                                        </Group>
                                    </Paper>
                                ))}
                                <Button
                                    variant="subtle"
                                    leftSection={<IconPlus size={16} />}
                                    onClick={addRule}
                                    size="sm"
                                >
                                    Add another step
                                </Button>
                            </Stack>

                            <Group justify="flex-end" mt="xl">
                                <Button variant="default" onClick={() => setOpened(false)}>Cancel</Button>
                                <Button type="submit" loading={processing}>Create Policy</Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </Stack>
        </AppLayout>
    );
}
