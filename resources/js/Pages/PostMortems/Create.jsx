import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Grid,
    Title,
    Text,
    Button,
    Card,
    Group,
    Stack,
    TextInput,
    Textarea,
    Select,
    Paper,
    Divider,
    Alert,
} from '@mantine/core';
import { useForm, Link } from '@inertiajs/react';
import {
    IconFilePlus,
    IconAlertCircle,
    IconArrowLeft,
    IconDeviceFloppy
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function PostMortemCreate({ incident }) {
    const { data, setData, post, processing, errors } = useForm({
        incident_id: incident.id,
        title: `Post-Mortem: ${incident.monitor.name} Downtime`,
        summary: '',
        root_cause: '',
        resolution_steps: '',
        preventive_measures: '',
        severity: 'medium',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('post-mortems.store'), {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Post-mortem report published',
                    color: 'green',
                });
            },
        });
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
                            href="/incidents"
                            mb="sm"
                        >
                            Back to Incidents
                        </Button>
                        <Title order={2} fw={900} style={{ letterSpacing: '-0.5px' }}>
                            Generate Post-Mortem
                        </Title>
                        <Text c="dimmed" size="sm">
                            Document the root cause and resolution for incident on <strong>{incident.monitor.name}</strong>.
                        </Text>
                    </div>
                </Group>

                <form onSubmit={handleSubmit}>
                    <Grid gutter="xl">
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Stack gap="md">
                                <Card shadow="sm" radius="md" withBorder p="xl">
                                    <Stack gap="md">
                                        <TextInput
                                            label="Report Title"
                                            placeholder="Incident Analysis: Database Connection Failure"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            error={errors.title}
                                            required
                                        />

                                        <Textarea
                                            label="Executive Summary"
                                            description="Briefly describe what happened and the impact."
                                            placeholder="At 10:00 AM, the API went down due to..."
                                            minRows={4}
                                            value={data.summary}
                                            onChange={(e) => setData('summary', e.target.value)}
                                            error={errors.summary}
                                            required
                                        />

                                        <Divider my="sm" />

                                        <Textarea
                                            label="Root Cause"
                                            description="Technical details of why the incident occurred."
                                            placeholder="The database connection pool was exhausted because..."
                                            minRows={4}
                                            value={data.root_cause}
                                            onChange={(e) => setData('root_cause', e.target.value)}
                                            error={errors.root_cause}
                                        />

                                        <Textarea
                                            label="Resolution Steps"
                                            description="How was the issue fixed?"
                                            placeholder="1. Restarted the DB nodes\n2. Increased pool size..."
                                            minRows={4}
                                            value={data.resolution_steps}
                                            onChange={(e) => setData('resolution_steps', e.target.value)}
                                            error={errors.resolution_steps}
                                        />

                                        <Textarea
                                            label="Preventive Measures"
                                            description="What will be done to prevent this in the future?"
                                            placeholder="Implement better connection pooling monitoring..."
                                            minRows={4}
                                            value={data.preventive_measures}
                                            onChange={(e) => setData('preventive_measures', e.target.value)}
                                            error={errors.preventive_measures}
                                        />
                                    </Stack>
                                </Card>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Stack gap="md">
                                <Card shadow="sm" radius="md" withBorder p="xl">
                                    <Title order={5} mb="md">Metadata</Title>
                                    <Stack gap="sm">
                                        <Select
                                            label="Incident Severity"
                                            data={[
                                                { value: 'low', label: 'Low (Minor impact)' },
                                                { value: 'medium', label: 'Medium (Noticeable)' },
                                                { value: 'high', label: 'High (Severe)' },
                                                { value: 'critical', label: 'Critical (Outage)' },
                                            ]}
                                            value={data.severity}
                                            onChange={(val) => setData('severity', val)}
                                            required
                                        />

                                        <Paper withBorder p="sm" radius="sm">
                                            <Text size="xs" fw={700} mb={4}>INCIDENT INFO</Text>
                                            <Text size="xs"><strong>Monitor:</strong> {incident.monitor.name}</Text>
                                            <Text size="xs"><strong>Started:</strong> {new Date(incident.started_at).toLocaleString()}</Text>
                                            <Text size="xs"><strong>Resolved:</strong> {incident.resolved_at ? new Date(incident.resolved_at).toLocaleString() : 'N/A'}</Text>
                                        </Paper>

                                        <Button
                                            type="submit"
                                            fullWidth
                                            mt="md"
                                            loading={processing}
                                            leftSection={<IconDeviceFloppy size={18} />}
                                        >
                                            Publish Report
                                        </Button>
                                    </Stack>
                                </Card>

                                <Alert icon={<IconAlertCircle size={16} />} title="Post-Mortem Policy" color="blue">
                                    <Text size="xs">
                                        Post-mortems should be written within 24 hours of resolution. Be blameless and focus on technical facts.
                                    </Text>
                                </Alert>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </form>
            </Stack>
        </AppLayout>
    );
}
