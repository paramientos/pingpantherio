import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Title,
    Text,
    Button,
    Card,
    Group,
    Stack,
    Badge,
    Paper,
    Divider,
    Grid,
    ThemeIcon,
    ActionIcon,
} from '@mantine/core';
import { Link } from '@inertiajs/react';
import {
    IconArrowLeft,
    IconPrinter,
    IconFileText,
    IconAlertCircle,
    IconSearch,
    IconUser,
    IconClock
} from '@tabler/icons-react';

export default function PostMortemShow({ postMortem }) {
    const getSeverityColor = (severity) => {
        const colors = {
            low: 'gray',
            medium: 'blue',
            high: 'orange',
            critical: 'red',
        };
        return colors[severity] || 'gray';
    };

    return (
        <AppLayout>
            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <div>
                        <Button
                            variant="subtle"
                            color="gray"
                            leftSection={<IconArrowLeft size={16} />}
                            component={Link}
                            href="/post-mortems"
                            mb="sm"
                        >
                            Back to Reports
                        </Button>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            {postMortem.title}
                        </Title>
                    </div>
                    <Button variant="default" leftSection={<IconPrinter size={16} />} onClick={() => window.print()}>
                        Print Report
                    </Button>
                </Group>

                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack gap="xl">
                            <section>
                                <Title order={4} mb="md">Executive Summary</Title>
                                <Text style={{ whiteSpace: 'pre-wrap' }}>{postMortem.summary}</Text>
                            </section>

                            {postMortem.root_cause && (
                                <section>
                                    <Title order={4} mb="md">Root Cause Analysis</Title>
                                    <Paper withBorder p="lg" radius="md">
                                        <Text style={{ whiteSpace: 'pre-wrap' }}>{postMortem.root_cause}</Text>
                                    </Paper>
                                </section>
                            )}

                            {postMortem.resolution_steps && (
                                <section>
                                    <Title order={4} mb="md">Resolution & Recovery</Title>
                                    <Text style={{ whiteSpace: 'pre-wrap' }}>{postMortem.resolution_steps}</Text>
                                </section>
                            )}

                            {postMortem.preventive_measures && (
                                <section>
                                    <Title order={4} mb="md">Preventive Measures</Title>
                                    <Paper withBorder p="lg" radius="md" bg="blue.0" style={{ borderColor: 'var(--mantine-color-blue-2)' }}>
                                        <Text style={{ whiteSpace: 'pre-wrap' }}>{postMortem.preventive_measures}</Text>
                                    </Paper>
                                </section>
                            )}
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack gap="md" style={{ position: 'sticky', top: rem(20) }}>
                            <Card shadow="sm" radius="md" withBorder p="xl">
                                <Title order={5} mb="xl">Record Details</Title>

                                <Stack gap="lg">
                                    <Group justify="space-between">
                                        <Text size="xs" fw={700} c="dimmed">SEVERITY</Text>
                                        <Badge color={getSeverityColor(postMortem.severity)} variant="light">
                                            {postMortem.severity.toUpperCase()}
                                        </Badge>
                                    </Group>

                                    <Divider />

                                    <Group wrap="nowrap" gap="sm">
                                        <ThemeIcon size="md" radius="xl" variant="light" color="gray">
                                            <IconUser size={16} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="xs" fw={700} c="dimmed">AUTHOR</Text>
                                            <Text size="sm" fw={600}>{postMortem.creator.name}</Text>
                                        </div>
                                    </Group>

                                    <Group wrap="nowrap" gap="sm">
                                        <ThemeIcon size="md" radius="xl" variant="light" color="gray">
                                            <IconClock size={16} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="xs" fw={700} c="dimmed">PUBLISHED</Text>
                                            <Text size="sm" fw={600}>{new Date(postMortem.published_at).toLocaleString()}</Text>
                                        </div>
                                    </Group>

                                    <Divider />

                                    <div>
                                        <Text size="xs" fw={700} c="dimmed" mb="xs">AFFECTED MONITOR</Text>
                                        <Paper withBorder p="sm" radius="sm">
                                            <Text size="sm" fw={700}>{postMortem.incident.monitor.name}</Text>
                                            <Text size="xs" c="dimmed" truncate>{postMortem.incident.monitor.url}</Text>
                                        </Paper>
                                    </div>
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Stack>
        </AppLayout>
    );
}
