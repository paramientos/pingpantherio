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
    PasswordInput,
    Select,
    Stack,
    Paper,
    Avatar,
    rem,
    Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { router } from '@inertiajs/react';
import { IconPlus, IconTrash, IconPencil, IconLock, IconCheck, IconX, IconRefresh } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function UsersIndex({ users, roles }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [editingUser, setEditingUser] = useState(null);

    const generateRandomPassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let retVal = "";

        for (let i = 0; i < 12; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        return retVal;
    };

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
            role: 'user',
            must_change_password: true,
        },
        validate: {
            name: (val) => (val.length < 2 ? 'Name is too short' : null),
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val, values) => (!editingUser && val.length < 8 ? 'Password must be at least 8 characters' : null),
        },
    });

    const handleOpenCreate = () => {
        setEditingUser(null);
        form.reset();
        form.setFieldValue('password', generateRandomPassword());
        open();
    };

    const handleSubmit = (values) => {
        if (editingUser) {
            router.put(`/settings/users/${editingUser.id}`, values, {
                onSuccess: () => {
                    notifications.show({ title: 'Success', message: 'User updated', color: 'green' });
                    handleClose();
                }
            });
        } else {
            router.post('/settings/users', values, {
                onSuccess: () => {
                    notifications.show({ title: 'Success', message: 'User created', color: 'green' });
                    handleClose();
                }
            });
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        form.setValues({
            name: user.name,
            email: user.email,
            role: user.role,
            must_change_password: user.must_change_password,
        });
        open();
    };

    const handleClose = () => {
        close();
        setEditingUser(null);
        form.reset();
    };

    const handleDelete = (user) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(`/settings/users/${user.id}`, {
                onSuccess: () => notifications.show({ title: 'Deleted', message: 'User removed', color: 'red' })
            });
        }
    };

    return (
        <SettingsLayout activeTab="users">
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Title order={4}>User Management</Title>
                        <Text c="dimmed" size="sm">Manage global system users and roles</Text>
                    </div>
                    <Button size="xs" leftSection={<IconPlus size={14} />} onClick={open}>
                        Create User
                    </Button>
                </Group>

                <Table verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>User</Table.Th>
                            <Table.Th>Role</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Created</Table.Th>
                            <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {users.map((user) => (
                            <Table.Tr key={user.id}>
                                <Table.Td>
                                    <Group gap="sm">
                                        <Avatar size="sm" radius="xl" color="indigo">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </Avatar>
                                        <div>
                                            <Text size="sm" fw={500}>{user.name}</Text>
                                            <Text size="xs" c="dimmed">{user.email}</Text>
                                        </div>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Badge variant="light" color={user.role === 'admin' ? 'blue' : 'gray'}>
                                        {user.role.toUpperCase()}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    {user.must_change_password ? (
                                        <Badge variant="dot" color="orange">Password Change Required</Badge>
                                    ) : (
                                        <Badge variant="dot" color="green">Active</Badge>
                                    )}
                                </Table.Td>
                                <Table.Td>
                                    <Text size="xs" c="dimmed">{user.created_at}</Text>
                                </Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>
                                    <Group gap="xs" justify="flex-end">
                                        <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(user)}>
                                            <IconPencil size={16} />
                                        </ActionIcon>
                                        <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(user)}>
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Stack>

            <Modal opened={opened} onClose={handleClose} title={editingUser ? 'Edit User' : 'Create New User'}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        <TextInput label="Name" placeholder="John Doe" required {...form.getInputProps('name')} />
                        <TextInput label="Email" placeholder="john@example.com" required disabled={!!editingUser} {...form.getInputProps('email')} />
                        {!editingUser && (
                            <TextInput
                                label="Temporary Password"
                                placeholder="Enter password or use generated one"
                                description="Admin can see and copy this password"
                                required
                                rightSection={
                                    <ActionIcon 
                                        variant="subtle" 
                                        color="gray" 
                                        onClick={() => form.setFieldValue('password', generateRandomPassword())}
                                        title="Generate random password"
                                    >
                                        <IconRefresh size={16} />
                                    </ActionIcon>
                                }
                                {...form.getInputProps('password')}
                            />
                        )}
                        <Select
                            label="Role"
                            data={[
                                { value: 'admin', label: 'Admin - Full System Access' },
                                { value: 'user', label: 'User - Restricted to Teams' },
                            ]}
                            {...form.getInputProps('role')}
                        />
                        <Switch
                            label="Force password change on next login"
                            {...form.getInputProps('must_change_password', { type: 'checkbox' })}
                        />
                        <Button type="submit" fullWidth mt="md">
                            {editingUser ? 'Update User' : 'Create User'}
                        </Button>
                    </Stack>
                </form>
            </Modal>
        </SettingsLayout>
    );
}
