import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Title,
    Text,
    Table,
    Badge,
    Group,
    Stack,
    Card,
    Progress,
    rem,
    Tooltip,
    ActionIcon,
    Alert,
} from '@mantine/core';
import { IconShieldCheck, IconAlertTriangle, IconShieldX, IconExternalLink, IconInfoCircle } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

export default function SslIndex({ monitors }) {
    const getStatusColor = (monitor) => {
        if (monitor.ssl_days_until_expiry <= 7) return 'red';
        if (monitor.ssl_days_until_expiry <= 14) return 'orange';
        if (monitor.ssl_days_until_expiry <= 30) return 'yellow';
        return 'green';
    };

    const getStatusIcon = (monitor) => {
        if (monitor.ssl_days_until_expiry <= 7) return <IconShieldX size={20} />;
        if (monitor.ssl_days_until_expiry <= 14) return <IconAlertTriangle size={20} />;
        return <IconShieldCheck size={20} />;
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <div>
                    <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                        SSL Certificate Center
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Monitor and manage SSL certificates for all your services in one place.
                    </Text>
                </div>

                {monitors.some(m => m.is_critical) && (
                    <Alert icon={<IconShieldX size={16} />} title="Critical Expiration Warning" color="red" variant="light">
                        One or more certificates are expiring within 7 days. Please renew them to avoid service disruption.
                    </Alert>
                )}

                <Card padding="0" radius="md">
                    <Table verticalSpacing="md" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Monitor / Host</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Expiration</Table.Th>
                                <Table.Th>Days Left</Table.Th>
                                <Table.Th>Issuer</Table.Th>
                                <Table.Th style={{ width: rem(80) }}></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {monitors.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Stack align="center" gap="md">
                                            <IconShieldCheck size={40} stroke={1.5} color="gray" />
                                            <Text c="dimmed">No monitors with SSL tracking enabled found.</Text>
                                        </Stack>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                monitors.map((monitor) => (
                                    <Table.Tr key={monitor.id}>
                                        <Table.Td>
                                            <div>
                                                <Text fw={600} size="sm">{monitor.name}</Text>
                                                <Text size="xs" c="dimmed" truncate>{monitor.url}</Text>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Badge
                                                    color={getStatusColor(monitor)}
                                                    variant="light"
                                                    leftSection={getStatusIcon(monitor)}
                                                >
                                                    {monitor.ssl_days_until_expiry > 30 ? 'Healthy' : monitor.ssl_days_until_expiry > 7 ? 'Expiring' : 'Critical'}
                                                </Badge>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{monitor.ssl_expires_at}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <div style={{ width: rem(120) }}>
                                                <Group justify="space-between" mb={4}>
                                                    <Text size="xs" fw={700} c={getStatusColor(monitor)}>
                                                        {monitor.ssl_days_until_expiry} days
                                                    </Text>
                                                </Group>
                                                <Progress
                                                    value={Math.min(100, (monitor.ssl_days_until_expiry / 90) * 100)}
                                                    color={getStatusColor(monitor)}
                                                    size="sm"
                                                    radius="xl"
                                                />
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="xs" c="dimmed">{monitor.ssl_issuer || 'Unknown'}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Tooltip label="View Monitor">
                                                <ActionIcon
                                                    component={Link}
                                                    href={`/monitors/${monitor.id}`}
                                                    variant="subtle"
                                                    color="gray"
                                                >
                                                    <IconExternalLink size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>

                <Alert icon={<IconInfoCircle size={16} />} title="How it works" color="indigo" variant="light">
                    PingPanther automatically checks the SSL certificate status of your HTTPS monitors every 24 hours.
                    You can enable SSL tracking in each monitor's settings.
                </Alert>
            </Stack>
        </AppLayout>
    );
}
