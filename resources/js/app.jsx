import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
    primaryColor: 'indigo',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    headings: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        fontWeight: '700',
    },
    defaultRadius: 'md',
    colors: {
        indigo: [
            '#eef2ff',
            '#e0e7ff',
            '#c7d2fe',
            '#a5b4fc',
            '#818cf8',
            '#6366f1',
            '#4f46e5',
            '#4338ca',
            '#3730a3',
            '#312e81',
        ],
        dark: [
            '#C1C2C5',
            '#A6A7AB',
            '#909296',
            '#5c5f66',
            '#373A40',
            '#2C2E33',
            '#25262b',
            '#1A1B1E',
            '#141517',
            '#0f1114',
        ],
    },
    components: {
        Card: {
            defaultProps: {
                shadow: 'sm',
                withBorder: true,
            },
        },
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
    },
});

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Global keyboard shortcut for Spotlight
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('open-spotlight'));
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        root.render(
            <MantineProvider theme={theme} forceColorScheme="light">
                <Notifications position="top-right" zIndex={1000} />
                <App {...props} />
            </MantineProvider>
        );
    },
    progress: {
        color: '#6366f1',
        showSpinner: true,
    },
});
