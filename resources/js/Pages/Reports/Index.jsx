import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router, usePage } from '@inertiajs/react';
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
import { IconPlus, IconDots, IconTrash, IconFileAnalytics, IconMail, IconClock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function ReportsIndex({ reports }) {
    const { auth } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this report schedule?')) {
            router.delete(`/reports/${id}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Deleted',
                        message: 'Report schedule has been removed',
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
                            Uptime Reports
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Configure automated reports sent directly to your email
                        </Text>
                    </div>
                    <Button
                        component={Link}
                        href="/reports/create"
                        leftSection={<IconPlus size={16} />}
                    >
                        Create Report
                    </Button>
                </Group>

                <Card padding="0" radius="md">
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Type</Table.Th>
                                <Table.Th>Frequency</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Last Sent</Table.Th>
                                <Table.Th>Next Send</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {reports.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Stack align="center" gap="md">
                                            <IconFileAnalytics size={40} stroke={1.5} color="gray" />
                                            <Text c="dimmed">No automated reports scheduled yet.</Text>
                                        </Stack>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                reports.map((report) => (
                                    <Table.Tr key={report.id}>
                                        <Table.Td>
                                            <Text fw={600} size="sm">{report.name}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light" color="blue">{report.type.replace('_', ' ').toUpperCase()}</Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light" color="orange">{report.frequency.toUpperCase()}</Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={report.is_active ? 'green' : 'gray'} variant="light">
                                                {report.is_active ? 'Active' : 'Paused'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <IconMail size={14} color="gray" />
                                                <Text size="xs" c="dimmed">{report.last_sent_at || 'Never'}</Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <IconClock size={14} color="gray" />
                                                <Text size="xs" c="dimmed">{report.next_send_at}</Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <ActionIcon
                                                color="red"
                                                variant="subtle"
                                                onClick={() => handleDelete(report.id)}
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

export default ReportsIndex;
