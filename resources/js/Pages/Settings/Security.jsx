import React from 'react';
import SettingsLayout from './SettingsLayout';
import { Stack, Table, Badge, Button, Title, Text, Group, Paper, ActionIcon, Alert, rem } from '@mantine/core';
import { router } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { IconDeviceDesktop, IconTrash, IconInfoCircle, IconDeviceMobile } from '@tabler/icons-react';

export default function Security({ sessions }) {
    const handleLogout = (id) => {
        if (confirm('Are you sure you want to log out this session?')) {
            router.delete(`/settings/security/sessions/${id}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Session ended',
                        message: 'The selected session has been logged out.',
                        color: 'blue',
                    });
                },
            });
        }
    };

    return (
        <SettingsLayout activeTab="security">
            <Stack gap="xl">
                <div>
                    <Title order={4} mb={4}>Active Sessions</Title>
                    <Text size="sm" c="dimmed">These are the devices that are currently logged into your account. You can log out of any of them if you don't recognize them.</Text>
                </div>

                <Paper withBorder radius="md">
                    <Table verticalSpacing="md" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Device / OS</Table.Th>
                                <Table.Th>IP Address</Table.Th>
                                <Table.Th>Last Active</Table.Th>
                                <Table.Th style={{ width: rem(100) }}></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {sessions.map((session) => (
                                <Table.Tr key={session.id}>
                                    <Table.Td>
                                        <Group gap="sm">
                                            {session.platform === 'iOS' || session.platform === 'Android' ? (
                                                <IconDeviceMobile size={20} color="gray" />
                                            ) : (
                                                <IconDeviceDesktop size={20} color="gray" />
                                            )}
                                            <div>
                                                <Group gap="xs">
                                                    <Text size="sm" fw={600}>{session.browser || 'Unknown Browser'}</Text>
                                                    {session.is_current_device && (
                                                        <Badge color="green" variant="light" size="xs">This device</Badge>
                                                    )}
                                                </Group>
                                                <Text size="xs" c="dimmed">{session.platform || 'Unknown OS'}</Text>
                                            </div>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm" ff="monospace">{session.ip_address}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{session.last_active}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        {!session.is_current_device && (
                                            <ActionIcon
                                                color="red"
                                                variant="subtle"
                                                onClick={() => handleLogout(session.id)}
                                                title="Log out session"
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        )}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Paper>

                <Alert icon={<IconInfoCircle size={16} />} title="Security Tip" color="indigo" variant="light">
                    If you see a device you don't recognize, we recommend changing your password immediately in the Profile tab and logging out of all other sessions.
                </Alert>
            </Stack>
        </SettingsLayout>
    );
}
