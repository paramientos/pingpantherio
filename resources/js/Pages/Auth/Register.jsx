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
    Stack,
    Anchor,
    Divider,
    ActionIcon,
} from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

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
                        Create your account
                    </Title>

                    <form onSubmit={submit}>
                        <Stack gap="md">
                            <TextInput
                                label="Name"
                                placeholder="John Doe"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                            />

                            <TextInput
                                label="Email"
                                placeholder="your@email.com"
                                required
                                type="email"
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

                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                error={errors.password_confirmation}
                            />

                            <Button type="submit" fullWidth loading={processing} mt="md">
                                Create account
                            </Button>
                        </Stack>
                    </form>

                    <Divider label="or" labelPosition="center" my="lg" />

                    <Text c="dimmed" size="sm" ta="center">
                        Already have an account?{' '}
                        <Anchor component={Link} href={route('login')} fw={600}>
                            Sign in
                        </Anchor>
                    </Text>
                </Paper>
            </Container>
        </>
    );
}
