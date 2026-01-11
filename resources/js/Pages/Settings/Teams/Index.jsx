import React, { useState } from 'react';
import SettingsLayout from '../SettingsLayout';
import {
    Title,
    Text,
    Button,
    Table,
    Badge,
    Group,
    ActionIcon,
    Modal,
    TextInput,
    Select,
    Stack,
    Paper,
    Avatar,
    Tabs,
    rem,
    MultiSelect,
    Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { router } from '@inertiajs/react';
import { IconPlus, IconTrash, IconMailForward, IconUsers, IconUserShield, IconSettings, IconEye } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function TeamsIndex({ teams, monitors }) {
    const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
    const [inviteOpened, { open: openInvite, close: closeInvite }] = useDisclosure(false);
    const [monitorOpened, { open: openMonitor, close: closeMonitor }] = useDisclosure(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    const createForm = useForm({
        initialValues: { name: '' },
    });

    const inviteForm = useForm({
        initialValues: { email: '', name: '', password: '', role: 'member' },
    });

    const monitorForm = useForm({
        initialValues: { monitor_ids: [] },
    });

    const handleCreateTeam = (values) => {
        router.post('/settings/teams', values, {
            onSuccess: () => {
                notifications.show({ title: 'Success', message: 'Team created', color: 'green' });
                closeCreate();
                createForm.reset();
            }
        });
    };

    const handleInvite = (values) => {
        router.post(`/settings/teams/${selectedTeam.id}/invite`, values, {
            onSuccess: () => {
                notifications.show({ title: 'Sent', message: 'Invitation sent to ' + values.email, color: 'blue' });
                closeInvite();
                inviteForm.reset();
            },
            onError: (errors) => {
                notifications.show({ title: 'Error', message: errors.email, color: 'red' });
            }
        });
    };

    const handleRemoveMember = (teamId, userId) => {
        if (confirm('Are you sure you want to remove this member?')) {
            router.delete(`/settings/teams/${teamId}/members/${userId}`, {
                onSuccess: () => notifications.show({ title: 'Removed', message: 'Member removed from team', color: 'red' })
            });
        }
    };

    const handleOpenMonitorPermissions = (team, member) => {
        setSelectedTeam(team);
        setSelectedMember(member);
        monitorForm.setFieldValue('monitor_ids', member.monitor_ids || []);
        openMonitor();
    };

    const handleUpdateMonitors = (values) => {
        router.patch(`/settings/teams/${selectedTeam.id}/members/${selectedMember.id}/monitors`, values, {
            onSuccess: () => {
                notifications.show({ title: 'Updated', message: 'Monitor permissions updated', color: 'green' });
                closeMonitor();
            }
        });
    };

    const handleToggleRole = (teamId, userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'member' : 'admin';
        router.patch(`/settings/teams/${teamId}/members/${userId}/role`, { role: newRole }, {
            onSuccess: () => notifications.show({ title: 'Updated', message: `Role changed to ${newRole}`, color: 'blue' })
        });
    };

    const handleDeleteTeam = (teamId) => {
        if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
            router.delete(`/settings/teams/${teamId}`, {
                onSuccess: () => notifications.show({ title: 'Deleted', message: 'Team deleted successfully', color: 'red' })
            });
        }
    };

    const getRoleBadge = (role) => {
        const config = {
            admin: { color: 'blue', icon: IconUserShield, label: 'Admin' },
            member: { color: 'teal', icon: IconUsers, label: 'Member' },
        };
        const { color, icon: Icon, label } = config[role] || config.member;
        return (
            <Badge color={color} variant="light" leftSection={<Icon size={12} />}>
                {label}
            </Badge>
        );
    };

    return (
        <SettingsLayout activeTab="team">
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Title order={4}>Team Management</Title>
                        <Text c="dimmed" size="sm">Manage teams and member access to monitors</Text>
                    </div>
                    <Button size="xs" leftSection={<IconPlus size={14} />} onClick={openCreate}>
                        Create Team
                    </Button>
                </Group>

                {teams.length === 0 ? (
                    <Paper p="xl" withBorder style={{ textAlign: 'center' }}>
                        <Text c="dimmed">You are not part of any team yet.</Text>
                    </Paper>
                ) : (
                    teams.map((team) => (
                        <Paper key={team.id} shadow="sm" radius="md" withBorder p="md">
                            <Group justify="space-between" mb="md">
                                <Group>
                                    <Avatar color="indigo" radius="md">{team.name.substring(0, 2).toUpperCase()}</Avatar>
                                    <div>
                                        <Text fw={700} size="lg">{team.name}</Text>
                                        <Text size="xs" c="dimmed">Owned by {team.owner}</Text>
                                    </div>
                                </Group>
                                <Group>
                                    {team.is_admin && (
                                        <Button
                                            variant="light"
                                            size="xs"
                                            leftSection={<IconMailForward size={14} />}
                                            onClick={() => { setSelectedTeam(team); openInvite(); }}
                                        >
                                            Invite Member
                                        </Button>
                                    )}
                                    {team.is_admin && (
                                        <ActionIcon
                                            variant="light"
                                            color="red"
                                            onClick={() => handleDeleteTeam(team.id)}
                                            title="Delete Team"
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    )}
                                </Group>
                            </Group>

                            <Tabs defaultValue="members">
                                <Tabs.List>
                                    <Tabs.Tab value="members" leftSection={<IconUsers style={{ width: rem(14), height: rem(14) }} />}>
                                        Members ({team.members.length})
                                    </Tabs.Tab>
                                    <Tabs.Tab value="invitations" leftSection={<IconMailForward style={{ width: rem(14), height: rem(14) }} />}>
                                        Pending Invitations ({team.invitations.length})
                                    </Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="members" pt="xs">
                                    <Table verticalSpacing="sm">
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Member</Table.Th>
                                                <Table.Th>Role</Table.Th>
                                                <Table.Th>Monitor Access</Table.Th>
                                                <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {team.members.map((member) => (
                                                <Table.Tr key={member.id}>
                                                    <Table.Td>
                                                        <Group gap="sm">
                                                            <Avatar size="sm" radius="xl" color="gray">
                                                                {member.name.substring(0, 2).toUpperCase()}
                                                            </Avatar>
                                                            <div>
                                                                <Text size="sm" fw={500}>{member.name}</Text>
                                                                <Text size="xs" c="dimmed">{member.email}</Text>
                                                            </div>
                                                        </Group>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {team.is_admin ? (
                                                            <Switch
                                                                size="xs"
                                                                checked={member.role === 'admin'}
                                                                onChange={() => handleToggleRole(team.id, member.id, member.role)}
                                                                label={member.role === 'admin' ? 'Admin' : 'Member'}
                                                                disabled={member.id === team.owner_id}
                                                            />
                                                        ) : (
                                                            getRoleBadge(member.role)
                                                        )}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {member.role === 'admin' ? (
                                                            <Badge color="green" variant="light" size="sm">All Monitors</Badge>
                                                        ) : (
                                                            <Badge color="gray" variant="light" size="sm">
                                                                {member.monitor_ids?.length || 0} monitors
                                                            </Badge>
                                                        )}
                                                    </Table.Td>
                                                    <Table.Td style={{ textAlign: 'right' }}>
                                                        <Group gap="xs" justify="flex-end">
                                                            {team.is_admin && member.role === 'member' && (
                                                                <ActionIcon 
                                                                    color="blue" 
                                                                    variant="subtle" 
                                                                    onClick={() => handleOpenMonitorPermissions(team, member)}
                                                                    title="Manage monitor access"
                                                                >
                                                                    <IconSettings size={16} />
                                                                </ActionIcon>
                                                            )}
                                                            {team.is_admin && (
                                                                <ActionIcon 
                                                                    color="red" 
                                                                    variant="subtle" 
                                                                    onClick={() => handleRemoveMember(team.id, member.id)}
                                                                    title="Remove member"
                                                                >
                                                                    <IconTrash size={16} />
                                                                </ActionIcon>
                                                            )}
                                                        </Group>
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </Tabs.Panel>

                                <Tabs.Panel value="invitations" pt="xs">
                                    {team.invitations.length === 0 ? (
                                        <Paper p="md" withBorder>
                                            <Text size="sm" c="dimmed" ta="center">No pending invitations</Text>
                                        </Paper>
                                    ) : (
                                        <Table verticalSpacing="sm">
                                            <Table.Tbody>
                                                {team.invitations.map((inv) => (
                                                    <Table.Tr key={inv.id}>
                                                        <Table.Td>
                                                            <Text size="sm" fw={500}>{inv.email}</Text>
                                                            <Text size="xs" c="dimmed">Expires {inv.expires_at}</Text>
                                                        </Table.Td>
                                                        <Table.Td>{getRoleBadge(inv.role)}</Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    )}
                                </Tabs.Panel>
                            </Tabs>
                        </Paper>
                    ))
                )}
            </Stack>

            {/* Create Team Modal */}
            <Modal opened={createOpened} onClose={closeCreate} title="Create New Team">
                <form onSubmit={createForm.onSubmit(handleCreateTeam)}>
                    <TextInput label="Team Name" placeholder="Digital Panthers Inc." required {...createForm.getInputProps('name')} />
                    <Button type="submit" fullWidth mt="xl">Create Team</Button>
                </form>
            </Modal>

            {/* Invite Modal */}
            <Modal opened={inviteOpened} onClose={closeInvite} title={`Invite to ${selectedTeam?.name}`}>
                <form onSubmit={inviteForm.onSubmit(handleInvite)}>
                    <Stack gap="md">
                        <TextInput 
                            label="Email Address" 
                            placeholder="colleague@company.com" 
                            required 
                            {...inviteForm.getInputProps('email')} 
                        />
                        <TextInput 
                            label="Full Name" 
                            placeholder="John Doe" 
                            description="Only required if the user doesn't exist yet"
                            {...inviteForm.getInputProps('name')} 
                        />
                        <TextInput 
                            label="Temporary Password" 
                            placeholder="Min 8 characters" 
                            type="password"
                            description="Only required if the user doesn't exist yet"
                            {...inviteForm.getInputProps('password')} 
                        />
                        <Select
                            label="Role"
                            description="Admins have full access. Members need specific monitor permissions."
                            data={[
                                { value: 'admin', label: 'Admin - Full access to all monitors' },
                                { value: 'member', label: 'Member - Limited access (set monitors later)' },
                            ]}
                            {...inviteForm.getInputProps('role')}
                        />
                        <Button type="submit" fullWidth mt="md">Send Invitation</Button>
                    </Stack>
                </form>
            </Modal>

            {/* Monitor Permissions Modal */}
            <Modal 
                opened={monitorOpened} 
                onClose={closeMonitor} 
                title={`Monitor Access for ${selectedMember?.name}`}
                size="lg"
            >
                <form onSubmit={monitorForm.onSubmit(handleUpdateMonitors)}>
                    <Stack gap="md">
                        <Text size="sm" c="dimmed">
                            Select which monitors {selectedMember?.name} can view and manage.
                        </Text>
                        <MultiSelect
                            label="Accessible Monitors"
                            placeholder="Select monitors"
                            data={monitors.map(m => ({
                                value: m.id,
                                label: `${m.name} (${m.type})`,
                            }))}
                            searchable
                            clearable
                            {...monitorForm.getInputProps('monitor_ids')}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button variant="subtle" onClick={closeMonitor}>Cancel</Button>
                            <Button type="submit">Update Permissions</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </SettingsLayout>
    );
}

export default TeamsIndex;
