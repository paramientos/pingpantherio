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
import { useForm, router } from '@inertiajs/react';
import { IconPlus, IconTrash, IconBell } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function EscalationPoliciesEdit({ policy, channels, schedules }) {
    const { data, setData, put, processing, errors } = useForm({
        name: policy.name || '',
        description: policy.description || '',
        rules: policy.rules || [{ alert_channel_id: '', delay_minutes: 0 }],
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
        put(route('escalation-policies.update', policy.id), {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Escalation policy updated',
                    color: 'green',
                });
            },
        });
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <div>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            Edit Escalation Policy
                        </Title>
                        <Text c="dimmed" size="sm">
                            Update your alert escalation chain.
                        </Text>
                    </div>
                    <Button variant="default" onClick={() => router.visit('/escalation-policies')}>
                        Back to Policies
                    </Button>
                </Group>

                <Card shadow="sm" radius="md" withBorder p="xl">
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
                                    <Paper key={index} withBorder p="sm" bg="gray.0">
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
                                <Button variant="default" onClick={() => router.visit('/escalation-policies')}>Cancel</Button>
                                <Button type="submit" loading={processing}>Update Policy</Button>
                            </Group>
                        </Stack>
                    </form>
                </Card>
            </Stack>
        </AppLayout>
    );
}
