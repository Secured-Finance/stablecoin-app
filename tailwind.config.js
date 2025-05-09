const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./src/**/*.{ts,tsx,js,jsx}', './public/index.html'],
    theme: {
        boxShadow: {
            dropdown: '0px 16px 64px -48px rgba(31, 47, 70, 0.4)',
            sidenav: '0px 46px 64px 0px rgba(31, 47, 70, 0.4)',
            card: '0px 4px 32px 0px rgba(100, 116, 139, 0.1)',
            stats: '0px 4px 32px 0px rgba(102, 109, 180, 0.15)',
        },
        extend: {
            lineHeight: {
                '3.5': '14px',
                '4.5': '18px',
                '5.5': '22px',
                '11': '44px',
                '12': '48px',
                '14': '56px',
                '16': '64px',
                '18': '72px',
                '20': '80px',
                '24': '96px',
                '28': '112px',
            },
            transitionProperty: {
                width: 'width',
                height: 'height',
            },
            colors: {
                primary: {
                    '50': '#E5F4FF',
                    '300': '#66BDFF',
                    '500': '#0091FF',
                    '700': '#005799',
                },
                secondary: {
                    '300': '#FFD35A',
                    '500': '#EACC00',
                    '700': '#8D6700',
                },
                tertiary: {
                    '300': '#EDCBFF',
                    '500': '#BD47FB',
                    '700': '#8919C4',
                },
                success: {
                    '300': '#AAE8B0',
                    '500': '#5CD167',
                    '700': '#0F921B',
                },
                warning: {
                    '300': '#FFDB93',
                    '500': '#FAAD14',
                    '700': '#C58300',
                    '900': '#BD7003',
                },
                error: {
                    '300': '#FF9FAE',
                    '500': '#FF658A',
                    '700': '#C30C38',
                    '900': '#A50114',
                },
                neutral: {
                    '1': '#141416',
                    '2': '#23262F',
                    '3': '#353945',
                    '4': '#777E91',
                    '5': '#B1B5C4',
                    '6': '#E6E8EC',
                    '7': '#F4F5F6',
                    '8': '#FCFCFD',
                    '50': '#FBFAFC',
                    '100': '#F1F5F9',
                    '200': '#E2E8F0',
                    '300': '#CBD5E1',
                    '400': '#94A3B8',
                    '500': '#64748B',
                    '600': '#475569',
                    '700': '#334155',
                    '800': '#1E293B',
                    '900': '#002133',
                    DEFAULT: '#353945',
                },
                black: {
                    '10': 'rgba(0, 0, 0, 0.1)',
                    '20': 'rgba(0, 0, 0, 0.2)',
                    '30': 'rgba(0, 0, 0, 0.3)',
                    '40': 'rgba(0, 0, 0, 0.4)',
                    '50': 'rgba(0, 0, 0, 0.5)',
                    '60': 'rgba(0, 0, 0, 0.6)',
                    '70': 'rgba(0, 0, 0, 0.7)',
                    '80': 'rgba(0, 0, 0, 0.8)',
                    '90': 'rgba(0, 0, 0, 0.9)',
                    DEFAULT: '#000000',
                },
                white: {
                    '5': 'rgba(255, 255, 255, 0.05)',
                    '10': 'rgba(255, 255, 255, 0.1)',
                    '20': 'rgba(255, 255, 255, 0.2)',
                    '30': 'rgba(255, 255, 255, 0.3)',
                    '40': 'rgba(255, 255, 255, 0.4)',
                    '50': 'rgba(255, 255, 255, 0.5)',
                    '60': 'rgba(255, 255, 255, 0.6)',
                    '70': 'rgba(255, 255, 255, 0.7)',
                    '80': 'rgba(255, 255, 255, 0.8)',
                    '90': 'rgba(255, 255, 255, 0.9)',
                    DEFAULT: '#FFFFFF',
                },
                tooltip: {
                    success: '#0C474C',
                    warning: '#422F09',
                    error: '#4A1220',
                },
            },
        },
        fontFamily: {
            primary: ['GT Super Display', ...defaultTheme.fontFamily.serif],
            secondary: [
                'Suisse International',
                ...defaultTheme.fontFamily.sans,
            ],
            tertiary: ['Roboto Mono', ...defaultTheme.fontFamily.sans],
            numerical: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
        },
        screens: {
            tablet: '768px',
            laptop: '1024px',
            desktop: '1440px',
            largeDesktop: '1920px',
        },
        fontSize: {
            '2.5': '10px',
            '3': '12px',
            '3.5': '14px',
            '4': '16px',
            '4.5': '18px',
            '5': '20px',
            '5.5': '22px',
            '6': '24px',
            '7': '28px',
            '8': '32px',
            '9': '36px',
            '10': '40px',
            '11': '44px',
            '12': '48px',
            '14': '56px',
            '16': '64px',
            '18': '72px',
            '22': '88px',
            '24': '96px',
            '26': '104px',
            base: '16px',
            sm: '14px',
            xs: '12px',
        },
    },
    safelist: [
        'fade-enter',
        'fade-enter-active',
        'fade-exit',
        'fade-exit-active',
    ],
};
