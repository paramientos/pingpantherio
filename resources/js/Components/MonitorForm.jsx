import React from 'react';
import {
    TextInput,
    Select,
    NumberInput,
    Switch,
    Stack,
    Group,
    Button,
    TagsInput,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

function MonitorForm({ form, onSubmit, submitLabel }) {
    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack gap="md">
                <TextInput
                    label="Monitor Name"
                    placeholder="My Website"
                    description="A friendly name for your monitor"
                    required
                    {...form.getInputProps('name')}
                />

                <TextInput
                    label="URL"
                    placeholder="https://example.com"
                    description="The URL or IP address to monitor"
                    required
                    {...form.getInputProps('url')}
                />

                <Select
                    label="Monitor Type"
                    description="Choose the type of monitoring"
                    data={[
                        { value: 'http', label: 'HTTP(S) - Monitor website availability' },
                        { value: 'ping', label: 'Ping - Check server reachability' },
                        { value: 'port', label: 'Port - Monitor specific port' },
                        { value: 'keyword', label: 'Keyword - Check for specific content' },
                    ]}
                    {...form.getInputProps('type')}
                />

                <Group grow>
                    <NumberInput
                        label="Check Interval"
                        description="How often to check (seconds)"
                        min={60}
                        max={3600}
                        suffix=" seconds"
                        {...form.getInputProps('interval')}
                    />

                    <NumberInput
                        label="Timeout"
                        description="Request timeout (seconds)"
                        min={5}
                        max={60}
                        suffix=" seconds"
                        {...form.getInputProps('timeout')}
                    />
                </Group>

                {form.values.type === 'http' && (
                    <>
                        <Select
                            label="HTTP Method"
                            description="Request method to use"
                            data={[
                                { value: 'GET', label: 'GET' },
                                { value: 'POST', label: 'POST' },
                                { value: 'PUT', label: 'PUT' },
                                { value: 'DELETE', label: 'DELETE' },
                                { value: 'PATCH', label: 'PATCH' },
                            ]}
                            {...form.getInputProps('method')}
                        />

                        <TextInput
                            label="Custom Headers (JSON)"
                            placeholder='{"Authorization": "Bearer token"}'
                            description="Optional custom HTTP headers in JSON format"
                            {...form.getInputProps('headers')}
                        />

                        <Switch
                            label="Verify SSL Certificate"
                            description="Enable SSL certificate verification"
                            {...form.getInputProps('verify_ssl', { type: 'checkbox' })}
                        />

                        <Switch
                            label="Monitor SSL Certificate"
                            description="Track SSL certificate expiry and get alerts"
                            {...form.getInputProps('check_ssl', { type: 'checkbox' })}
                        />
                    </>
                )}

                {form.values.type === 'keyword' && (
                    <TextInput
                        label="Keyword"
                        placeholder="Success"
                        description="The keyword to search for in the response"
                        required
                        {...form.getInputProps('keyword')}
                    />
                )}

                {form.values.type === 'port' && (
                    <NumberInput
                        label="Port Number"
                        placeholder="80"
                        description="The port number to monitor"
                        min={1}
                        max={65535}
                        required
                        {...form.getInputProps('port')}
                    />
                )}

                <TextInput
                    label="Group"
                    placeholder="Production"
                    description="Organize monitors into groups"
                    {...form.getInputProps('group')}
                />

                <TagsInput
                    label="Tags"
                    placeholder="Enter tags"
                    description="Add tags for better organization"
                    {...form.getInputProps('tags')}
                />

                <Group justify="flex-end" mt="md">
                    <Button type="submit" leftSection={<IconPlus size={16} />}>
                        {submitLabel}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}

export default MonitorForm;
