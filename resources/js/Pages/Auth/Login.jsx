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
    Code,
    Box
} from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'admin@pingpanther.io',
        password: 'password',
        remember: false,
    });

    const fillDemoCredentials = () => {
        setData({
            email: 'admin@pingpanther.io',
            password: 'password',
            remember: false,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <Box
                style={{
                    minHeight: '100vh',
                    background: '#050505',
                    backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 75%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background Pattern */}
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        pointerEvents: 'none'
                    }}
                />

                <Container size={440} style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                    <Stack align="center" mb={40}>
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <Group gap="xs" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <ActionIcon
                                    variant="gradient"
                                    gradient={{ from: 'orange', to: 'red', deg: 135 }}
                                    size={50}
                                    radius="md"
                                >
                                    <IconBolt size={28} />
                                </ActionIcon>
                                <div>
                                    <Title order={2} fw={900} style={{ letterSpacing: '-1px', lineHeight: 1 }}>
                                        Ping<span style={{ color: 'var(--mantine-color-orange-6)' }}>Panther</span>
                                    </Title>
                                    <Text size="xs" c="dimmed" fw={600} ls={1} tt="uppercase">
                                        Command Center
                                    </Text>
                                </div>
                            </Group>
                        </Link>
                    </Stack>

                    <Paper
                        p={40}
                        radius="lg"
                        style={{
                            background: 'rgba(20, 20, 20, 0.7)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                        }}
                    >
                        <Title order={3} ta="center" mb="xl" fw={800} c="white">
                            Welcome Back
                        </Title>

                        {status && (
                            <Paper p="xs" mb="md" bg="rgba(0, 255, 0, 0.1)" c="green" ta="center" fz="sm" fw={500} radius="md">
                                {status}
                            </Paper>
                        )}

                        <form onSubmit={submit}>
                            <Stack gap="md">
                                <TextInput
                                    label="Email Address"
                                    placeholder="admin@pingpanther.io"
                                    required
                                    size="md"
                                    radius="md"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                    styles={{
                                        input: {
                                            backgroundColor: 'rgba(0,0,0,0.3)',
                                            borderColor: 'rgba(255,255,255,0.1)',
                                            color: 'white'
                                        },
                                        label: { color: '#888', marginBottom: 4 }
                                    }}
                                />

                                <PasswordInput
                                    label="Password"
                                    placeholder="••••••••"
                                    required
                                    size="md"
                                    radius="md"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    styles={{
                                        input: {
                                            backgroundColor: 'rgba(0,0,0,0.3)',
                                            borderColor: 'rgba(255,255,255,0.1)',
                                            color: 'white'
                                        },
                                        label: { color: '#888', marginBottom: 4 }
                                    }}
                                />

                                <Group justify="space-between" mt={4}>
                                    <Checkbox
                                        label="Remember me"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.currentTarget.checked)}
                                        styles={{ label: { color: '#888' } }}
                                        color="orange"
                                    />
                                    <Anchor href="/" size="sm" c="dimmed">
                                        Forgot password?
                                    </Anchor>
                                </Group>

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="md"
                                    loading={processing}
                                    color="orange"
                                    radius="md"
                                    mt="xs"
                                    fw={700}
                                    style={{ transition: 'transform 0.1s' }}
                                    onClick={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                                >
                                    Sign In
                                </Button>

                                <Divider label="Demo Access" labelPosition="center" my="sm" color="rgba(255,255,255,0.1)" />

                                <Paper p="sm" bg="rgba(255,255,255,0.03)" radius="md">
                                    <Text size="xs" c="dimmed" ta="center" mb={4}>Demo Credentials:</Text>
                                    <Group justify="center" gap="lg">
                                        <Code color="orange" bg="transparent" fw={700}>admin@pingpanther.io</Code>
                                        <Code color="orange" bg="transparent" fw={700}>password</Code>
                                    </Group>
                                </Paper>
                            </Stack>
                        </form>
                    </Paper>

                    <Text ta="center" mt="xl" c="dimmed" size="sm">
                        Don't have an installation?{' '}
                        <Anchor component={Link} href="/" fw={700} c="orange">
                            Get Started
                        </Anchor>
                    </Text>
                </Container>
            </Box>
        </>
    );
}
