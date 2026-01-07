import React from 'react';
import SettingsLayout from '../SettingsLayout';
import {
    Title,
    Text,
    Table,
    Badge,
    Group,
    Stack,
    Card,
    Pagination,
    Accordion,
    Code,
} from '@mantine/core';
import { IconHistory, IconUser, IconDeviceDesktop, IconActivity } from '@tabler/icons-react';

function AuditLogsIndex({ logs }) {
    const getEventColor = (event) => {
        switch (event.toLowerCase()) {
            case 'created': return 'green';
            case 'updated': return 'blue';
            case 'deleted': return 'red';
            case 'login': return 'teal';
            default: return 'gray';
        }
    };

    return (
        <SettingsLayout activeTab="audit-logs">
            <Stack gap="xl">
                <div>
                    <Title order={4}>Security Audit Logs</Title>
                    <Text c="dimmed" size="xs">Workspace activity history</Text>
                </div>

                <Card padding="0" radius="md">
                    <Table verticalSpacing="md" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>User / Event</Table.Th>
                                <Table.Th>Action & Target</Table.Th>
                                <Table.Th>Source IP</Table.Th>
                                <Table.Th>When</Table.Th>
                                <Table.Th>Details</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {logs.data.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Stack align="center" gap="md">
                                            <IconHistory size={40} stroke={1.5} color="gray" />
                                            <Text c="dimmed">No audit logs found.</Text>
                                        </Stack>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                logs.data.map((log) => (
                                    <Table.Tr key={log.id}>
                                        <Table.Td>
                                            <Group gap="sm">
                                                <Badge size="xs" color={getEventColor(log.event)} variant="filled">
                                                    {log.event.toUpperCase()}
                                                </Badge>
                                                <Text size="sm" fw={600}>{log.user_name}</Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <IconActivity size={14} color="gray" />
                                                <Text size="sm" c="dimmed">{log.target}</Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="xs" ff="monospace">{log.ip_address}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="xs" c="dimmed">{log.created_at}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            {Object.keys(log.details.new || {}).length > 0 && (
                                                <Accordion variant="separated" chevronSize="xs">
                                                    <Accordion.Item value="details" style={{ border: 'none' }}>
                                                        <Accordion.Control style={{ padding: 0 }}>
                                                            <Text size="xs" c="blue">View Changes</Text>
                                                        </Accordion.Control>
                                                        <Accordion.Panel>
                                                            <Stack gap="xs">
                                                                <Text size="xs" fw={700}>New Values:</Text>
                                                                <Code block>{JSON.stringify(log.details.new, null, 2)}</Code>
                                                            </Stack>
                                                        </Accordion.Panel>
                                                    </Accordion.Item>
                                                </Accordion>
                                            )}
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>

                <Group justify="center" mt="md">
                    <Pagination total={logs.last_page} value={logs.current_page} />
                </Group>
            </Stack>
        </SettingsLayout>
    );
}

export default AuditLogsIndex;
