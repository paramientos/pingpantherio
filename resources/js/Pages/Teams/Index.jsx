import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
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
    Modal,
    TextInput,
    Select,
    Tabs,
    Avatar,
} from '@mantine/core';
import { IconPlus, IconUserPlus, IconMail, IconUsers, IconShieldCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function TeamsIndex({ teams }) {
    const [createModalOpened, setCreateModalOpened] = useState(false);
    const [inviteModalOpened, setInviteModalOpened] = useState(false);
    const [activeTeam, setActiveTeam] = useState(teams[0]);

    const teamForm = useForm({ name: '' });
    const inviteForm = useForm({ email: '', role: 'member' });

    const handleCreateTeam = (e) => {
        e.preventDefault();
        teamForm.post('/teams', {
            onSuccess: () => {
                setCreateModalOpened(false);
                teamForm.reset();
                notifications.show({ title: 'Success', message: 'Team created', color: 'green' });
            },
        });
    };

    const handleInviteMember = (e) => {
        e.preventDefault();
        inviteForm.post(`/teams/${activeTeam.id}/invite`, {
            onSuccess: () => {
                setInviteModalOpened(false);
                inviteForm.reset();
                notifications.show({ title: 'Sent', message: 'Invitation sent successfully', color: 'blue' });
            },
        });
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            Team Management
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Manage team members, roles and pending invitations
                        </Text>
                    </div>
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={() => setCreateModalOpened(true)}
                    >
                        Create Team
                    </Button>
                </Group>

                {teams.length === 0 ? (
                    <Card padding="xl" radius="md" withBorder style={{ textAlign: 'center' }}>
                        <Stack align="center" gap="md">
                            <IconUsers size={48} stroke={1.5} color="gray" />
                            <Text size="lg" fw={500}>No teams found</Text>
                            <Button variant="light" onClick={() => setCreateModalOpened(true)}>Create Your First Team</Button>
                        </Stack>
                    </Card>
                ) : (
                    <Tabs value={activeTeam?.id} onChange={(id) => setActiveTeam(teams.find(t => t.id === id))}>
                        <Tabs.List mb="md">
                            {teams.map(team => (
                                <Tabs.Tab key={team.id} value={team.id}>{team.name}</Tabs.Tab>
                            ))}
                        </Tabs.List>

                        {teams.map(team => (
                            <Tabs.Panel key={team.id} value={team.id}>
                                <Stack gap="md">
                                    <Group justify="space-between">
                                        <Text fw={700} size="xl">{team.name} Members</Text>
                                        <Button
                                            variant="light"
                                            leftSection={<IconUserPlus size={16} />}
                                            onClick={() => setInviteModalOpened(true)}
                                        >
                                            Invite Member
                                        </Button>
                                    </Group>

                                    <Card padding="0" radius="md">
                                        <Table striped verticalSpacing="md">
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>User</Table.Th>
                                                    <Table.Th>Email</Table.Th>
                                                    <Table.Th>Role</Table.Th>
                                                    <Table.Th>Status</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {team.members.map(member => (
                                                    <Table.Tr key={member.id}>
                                                        <Table.Td>
                                                            <Group gap="sm">
                                                                <Avatar radius="xl" size="sm" color="blue">
                                                                    {member.name.charAt(0)}
                                                                </Avatar>
                                                                <Text size="sm" fw={600}>{member.name}</Text>
                                                            </Group>
                                                        </Table.Td>
                                                        <Table.Td><Text size="sm" c="dimmed">{member.email}</Text></Table.Td>
                                                        <Table.Td>
                                                            <Badge variant="dot" color={member.role === 'owner' ? 'red' : 'blue'}>
                                                                {member.role.toUpperCase()}
                                                            </Badge>
                                                        </Table.Td>
                                                        <Table.Td><Badge color="green" variant="light">Active</Badge></Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    </Card>
                                </Stack>
                            </Tabs.Panel>
                        ))}
                    </Tabs>
                )}
            </Stack>

            <Modal opened={createModalOpened} onClose={() => setCreateModalOpened(false)} title="Create New Team">
                <form onSubmit={handleCreateTeam}>
                    <Stack gap="md">
                        <TextInput label="Team Name" placeholder="e.g. Engineering Team" required value={teamForm.data.name} onChange={e => teamForm.setData('name', e.target.value)} />
                        <Button type="submit" fullWidth loading={teamForm.processing}>Create Team</Button>
                    </Stack>
                </form>
            </Modal>

            <Modal opened={inviteModalOpened} onClose={() => setInviteModalOpened(false)} title={`Invite to ${activeTeam?.name}`}>
                <form onSubmit={handleInviteMember}>
                    <Stack gap="md">
                        <TextInput label="Email Address" placeholder="colleague@company.com" required value={inviteForm.data.email} onChange={e => inviteForm.setData('email', e.target.value)} />
                        <Select label="Role" data={[{ value: 'admin', label: 'Admin' }, { value: 'member', label: 'Member' }, { value: 'viewer', label: 'Viewer' }]} value={inviteForm.data.role} onChange={val => inviteForm.setData('role', val)} />
                        <Button type="submit" fullWidth loading={inviteForm.processing}>Send Invitation</Button>
                    </Stack>
                </form>
            </Modal>
        </AppLayout>
    );
}

export default TeamsIndex;
