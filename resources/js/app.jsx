import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { themes } from './Themes/palettes';

const baseTheme = {
    primaryShade: 6,
    fontFamily: 'Outfit, Inter, sans-serif',
    headings: {
        fontFamily: 'Outfit, Inter, sans-serif',
        fontWeight: '900',
    },
    defaultRadius: 'md',
    components: {
        Card: {
            defaultProps: {
                shadow: 'sm',
                withBorder: true,
            },
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.01)' : 'var(--mantine-color-white)',
                    borderColor: theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'var(--mantine-color-gray-2)',
                }
            })
        },
        Paper: {
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.01)' : 'var(--mantine-color-white)',
                    borderColor: theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'var(--mantine-color-gray-2)',
                }
            })
        },
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
    },
};

const ThemeWrapper = ({ children }) => {
    const activeTheme = themes.panther;
    const colorScheme = 'dark';

    const theme = createTheme({
        ...baseTheme,
        primaryColor: activeTheme.primaryColor || 'orange',
        colors: {
            ...activeTheme.colors,
            dark: activeTheme.colors.dark
        }
    });

    return (
        <MantineProvider theme={theme} defaultColorScheme={colorScheme} forceColorScheme={colorScheme}>
            <Notifications position="top-right" zIndex={1000} />
            {children}
        </MantineProvider>
    );
};

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
            <ThemeWrapper initialPage={props.initialPage}>
                <App {...props} />
            </ThemeWrapper>
        );
    },
    progress: {
        color: '#6366f1',
        showSpinner: true,
    },
});
