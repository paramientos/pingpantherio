import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Paper,
    Title,
    Text,
    TextInput,
    PasswordInput,
    Button,
    Checkbox,
    Group,
    Stack,
    Anchor,
    Divider,
    ActionIcon,
} from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <Container size={420} my={100}>
                <Stack align="center" mb="xl">
                    <ActionIcon
                        variant="gradient"
                        gradient={{ from: 'indigo', to: 'violet', deg: 135 }}
                        size={60}
                        radius="md"
                    >
                        <IconBolt size={32} />
                    </ActionIcon>
                    <div style={{ textAlign: 'center' }}>
                        <Title order={1} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            Ping<span style={{ color: 'var(--mantine-color-indigo-6)' }}>Panther</span>
                        </Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Uptime Monitoring Platform
                        </Text>
                    </div>
                </Stack>

                <Paper shadow="md" p={30} radius="md" withBorder>
                    <Title order={2} ta="center" mb="md" fw={700}>
                        Welcome back!
                    </Title>

                    {status && (
                        <Text c="green" size="sm" ta="center" mb="md">
                            {status}
                        </Text>
                    )}

                    <form onSubmit={submit}>
                        <Stack gap="md">
                            <TextInput
                                label="Email"
                                placeholder="your@email.com"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                            />

                            <PasswordInput
                                label="Password"
                                placeholder="Your password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                error={errors.password}
                            />

                            <Group justify="space-between">
                                <Checkbox
                                    label="Remember me"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.currentTarget.checked)}
                                />

                                {canResetPassword && (
                                    <Anchor component={Link} href={route('password.request')} size="sm">
                                        Forgot password?
                                    </Anchor>
                                )}
                            </Group>

                            <Button type="submit" fullWidth loading={processing}>
                                Sign in
                            </Button>
                        </Stack>
                    </form>

                    <Divider label="or" labelPosition="center" my="lg" />

                    <Text c="dimmed" size="sm" ta="center">
                        Don't have an account?{' '}
                        <Anchor component={Link} href={route('register')} fw={600}>
                            Create account
                        </Anchor>
                    </Text>
                </Paper>
            </Container>
        </>
    );
}
