import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
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
    ThemeIcon,
} from '@mantine/core';
import { IconPlus, IconTrash, IconBellRinging, IconSettingsAutomation } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function AlertRulesIndex({ rules }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this alert rule?')) {
            router.delete(`/alert-rules/${id}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Deleted',
                        message: 'Alert rule has been removed',
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
                            Advanced Alerting
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Create complex alert rules with thresholds and durations
                        </Text>
                    </div>
                    <Button
                        component={Link}
                        href="/alert-rules/create"
                        leftSection={<IconPlus size={16} />}
                    >
                        Create Alert Rule
                    </Button>
                </Group>

                <Card padding="0" radius="md">
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Condition</Table.Th>
                                <Table.Th>Threshold</Table.Th>
                                <Table.Th>Duration</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {rules.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Stack align="center" gap="md">
                                            <IconBellRinging size={40} stroke={1.5} color="gray" />
                                            <Text c="dimmed">No advanced alert rules configured yet.</Text>
                                        </Stack>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                rules.map((rule) => (
                                    <Table.Tr key={rule.id}>
                                        <Table.Td>
                                            <Text fw={600} size="sm">{rule.name}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light" color="blue">
                                                {rule.condition_type.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{rule.condition_value} {rule.condition_type === 'response_time' ? 'ms' : ''}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{rule.duration ? `${rule.duration} mins` : 'Immediate'}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={rule.is_active ? 'green' : 'gray'} variant="light">
                                                {rule.is_active ? 'Active' : 'Disabled'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <ActionIcon
                                                color="red"
                                                variant="subtle"
                                                onClick={() => handleDelete(rule.id)}
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
        </AppLayout>
    );
}

export default AlertRulesIndex;
