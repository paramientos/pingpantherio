import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { themes } from './Themes/palettes';

const baseTheme = {
    primaryShade: 6,
    fontFamily: 'Outfit, Inter, sans-serif',
    fontFamilyMonospace: 'JetBrains Mono, Roboto Mono, Courier New, monospace',
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
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    transition: 'transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        borderColor: 'rgba(255,255,255,0.15)',
                    }
                }
            })
        },
        Paper: {
            styles: (theme) => ({
                root: {
                    backgroundColor: 'rgba(255,255,255,0.01)',
                    borderColor: 'rgba(255,255,255,0.08)',
                }
            })
        },
        Button: {
            defaultProps: {
                radius: 'md',
                fw: 700,
            },
        },
        AppShell: {
            styles: (theme) => ({
                main: {
                    backgroundColor: '#050505',
                },
                navbar: {
                    backgroundColor: '#050505',
                    borderRight: '1px solid rgba(255,255,255,0.08)',
                },
                header: {
                    backgroundColor: '#050505',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }
            })
        },
        Modal: {
            defaultProps: {
                overlayProps: {
                    backgroundOpacity: 0.55,
                    blur: 3,
                },
            },
        },
        Table: {
            styles: (theme) => ({
                thead: {
                    backgroundColor: 'rgba(255,255,255,0.02)',
                },
                th: {
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.7)',
                },
                tr: {
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }
            })
        }
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
