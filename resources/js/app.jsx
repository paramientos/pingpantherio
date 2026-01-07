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

const ThemeWrapper = ({ children, initialPage }) => {
    const userThemeName = initialPage.props.auth?.user?.settings?.preferences?.theme || 'panther';
    const activeTheme = themes[userThemeName] || themes.panther;
    const colorScheme = activeTheme.type === 'light' ? 'light' : 'dark';

    const theme = createTheme({
        ...baseTheme,
        primaryColor: activeTheme.primaryColor || 'blue',
        colors: {
            ...activeTheme.colors,
            // Ensure dark scale is always present for components that rely on it
            dark: activeTheme.dark || [
                '#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40',
                '#2C2E33', '#25262b', '#1A1B1E', '#141517', '#101113'
            ],
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
