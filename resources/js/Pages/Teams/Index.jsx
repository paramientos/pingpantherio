import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { router } from '@inertiajs/react';
import { IconPlus, IconTrash, IconMailForward, IconUsers, IconUserShield, IconShieldCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function TeamsIndex({ teams }) {
    const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
    const [inviteOpened, { open: openInvite, close: closeInvite }] = useDisclosure(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const createForm = useForm({
        initialValues: { name: '' },
    });

    const inviteForm = useForm({
        initialValues: { email: '', role: 'member' },
    });

    const handleCreateTeam = (values) => {
        router.post('/teams', values, {
            onSuccess: () => {
                notifications.show({ title: 'Success', message: 'Team created', color: 'green' });
                closeCreate();
                createForm.reset();
            }
        });
    };

    const handleInvite = (values) => {
        router.post(`/teams/${selectedTeam.id}/invite`, values, {
            onSuccess: () => {
                notifications.show({ title: 'Sent', message: 'Invitation sent to ' + values.email, color: 'blue' });
                closeInvite();
                inviteForm.reset();
            }
        });
    };

    const handleRemoveMember = (teamId, userId) => {
        if (confirm('Are you sure you want to remove this member?')) {
            router.delete(`/teams/${teamId}/members/${userId}`, {
                onSuccess: () => notifications.show({ title: 'Removed', message: 'Member removed from team', color: 'red' })
            });
        }
    };

    const getRoleBadge = (role) => {
        const config = {
            owner: { color: 'violet', icon: IconShieldCheck, label: 'Owner' },
            admin: { color: 'blue', icon: IconUserShield, label: 'Admin' },
            member: { color: 'teal', icon: IconUsers, label: 'Member' },
            viewer: { color: 'gray', icon: IconUsers, label: 'Viewer' },
        };
        const { color, icon: Icon, label } = config[role] || config.member;
        return (
            <Badge color={color} variant="light" leftSection={<Icon size={12} />}>
                {label}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Title order={2} fw={900}>Team Management</Title>
                        <Text c="dimmed" size="sm">Manage your organizations and collaborate with your team</Text>
                    </div>
                    <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
                        Create New Team
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
                                {team.is_owner && (
                                    <Button
                                        variant="light"
                                        size="xs"
                                        leftSection={<IconMailForward size={14} />}
                                        onClick={() => { setSelectedTeam(team); openInvite(); }}
                                    >
                                        Invite Member
                                    </Button>
                                )}
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
                                                    <Table.Td>{getRoleBadge(member.role)}</Table.Td>
                                                    <Table.Td style={{ textAlign: 'right' }}>
                                                        {team.is_owner && member.role !== 'owner' && (
                                                            <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveMember(team.id, member.id)}>
                                                                <IconTrash size={16} />
                                                            </ActionIcon>
                                                        )}
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </Tabs.Panel>

                                <Tabs.Panel value="invitations" pt="xs">
                                    <Table verticalSpacing="sm">
                                        <Table.Tbody>
                                            {team.invitations.length === 0 ? (
                                                <Table.Tr><Table.Td><Text size="xs" c="dimmed" ta="center" py="md">No pending invitations.</Text></Table.Td></Table.Tr>
                                            ) : (
                                                team.invitations.map((inv) => (
                                                    <Table.Tr key={inv.id}>
                                                        <Table.Td>
                                                            <Text size="sm" fw={500}>{inv.email}</Text>
                                                            <Text size="xs" c="dimmed">Expires {inv.expires_at}</Text>
                                                        </Table.Td>
                                                        <Table.Td>{getRoleBadge(inv.role)}</Table.Td>
                                                        <Table.Td style={{ textAlign: 'right' }}>
                                                            {/* Cancel invitation could be added here */}
                                                        </Table.Td>
                                                    </Table.Tr>
                                                ))
                                            )}
                                        </Table.Tbody>
                                    </Table>
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
                        <TextInput label="Email Address" placeholder="colleague@company.com" required {...inviteForm.getInputProps('email')} />
                        <Select
                            label="Role"
                            data={[
                                { value: 'admin', label: 'Admin - Full access to all monitors' },
                                { value: 'member', label: 'Member - Can edit monitors' },
                                { value: 'viewer', label: 'Viewer - Read-only' },
                            ]}
                            {...inviteForm.getInputProps('role')}
                        />
                        <Button type="submit" fullWidth mt="md">Send Invitation</Button>
                    </Stack>
                </form>
            </Modal>
        </AppLayout>
    );
}

export default TeamsIndex;
