import React from 'react';
import SettingsLayout from './SettingsLayout';
import { Stack, TextInput, Button, Title, Text, Divider, Group, Paper, Alert } from '@mantine/core';
import { useForm, usePage } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';

export default function Profile({ user }) {
    const { props } = usePage();

    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updateProfile = (e) => {
        e.preventDefault();
        profileForm.patch('/profile', {
            preserveScroll: true,
            onSuccess: () => {
                notifications.show({
                    title: 'Profile Updated',
                    message: 'Your profile information has been saved.',
                    color: 'green',
                });
            },
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.put('/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                notifications.show({
                    title: 'Password Updated',
                    message: 'Your password has been changed successfully.',
                    color: 'green',
                });
            },
            onError: (errors) => {
                if (errors.password) {
                    passwordForm.reset('password', 'password_confirmation');
                }
                if (errors.current_password) {
                    passwordForm.reset('current_password');
                }
            },
        });
    };

    return (
        <SettingsLayout activeTab="profile">
            <Stack gap="xl">
                {/* Profile Information */}
                <form onSubmit={updateProfile}>
                    <Stack gap="lg">
                        <div>
                            <Title order={4} mb={4}>Profile Information</Title>
                            <Text size="sm" c="dimmed">Update your account's profile information and email address.</Text>
                        </div>

                        <Group grow align="flex-start">
                            <TextInput
                                label="Name"
                                placeholder="Your name"
                                required
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                error={profileForm.errors.name}
                            />
                            <TextInput
                                label="Email"
                                placeholder="your@email.com"
                                required
                                value={profileForm.data.email}
                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                error={profileForm.errors.email}
                            />
                        </Group>

                        <Group justify="flex-end">
                            <Button type="submit" loading={profileForm.processing}>
                                Save Profile
                            </Button>
                        </Group>
                    </Stack>
                </form>

                <Divider />

                {/* Update Password */}
                <form onSubmit={updatePassword}>
                    <Stack gap="lg">
                        <div>
                            <Title order={4} mb={4}>Update Password</Title>
                            <Text size="sm" c="dimmed">Ensure your account is using a long, random password to stay secure.</Text>
                        </div>

                        <Stack gap="sm" maw={400}>
                            <TextInput
                                label="Current Password"
                                type="password"
                                required
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                error={passwordForm.errors.current_password}
                            />
                            <TextInput
                                label="New Password"
                                type="password"
                                required
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                error={passwordForm.errors.password}
                            />
                            <TextInput
                                label="Confirm Password"
                                type="password"
                                required
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                error={passwordForm.errors.password_confirmation}
                            />
                        </Stack>

                        <Group justify="flex-end">
                            <Button type="submit" loading={passwordForm.processing}>
                                Change Password
                            </Button>
                        </Group>
                    </Stack>
                </form>

                <Divider />

                {/* Danger Zone */}
                <Stack gap="lg">
                    <div>
                        <Title order={4} c="red" mb={4}>Danger Zone</Title>
                        <Text size="sm" c="dimmed">Once you delete your account, there is no going back. Please be certain.</Text>
                    </div>

                    <Paper p="md" radius="md" withBorder style={{ borderStyle: 'dashed', borderColor: 'var(--mantine-color-red-6)' }}>
                        <Group justify="space-between">
                            <div>
                                <Text fw={600} size="sm">Delete Account</Text>
                                <Text size="xs" c="dimmed">Permanently delete your account and all of your content.</Text>
                            </div>
                            <Button color="red" variant="light">Delete Account</Button>
                        </Group>
                    </Paper>
                </Stack>
            </Stack>
        </SettingsLayout>
    );
}
