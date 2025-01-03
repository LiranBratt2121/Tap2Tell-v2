import { DefaultTheme } from 'styled-components'

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            primary: string;
            secondery: string
            text: string;
        };
        fonts: {
            main: string;
        };
        fontSizes: {
            smaller: string;
            small: string;
            medium: string;
            bigger: string;
            large: string;
        };
    }
}

export const theme: DefaultTheme = {
    colors: {
        primary: '#FF8C42',
        secondery: '#8ED081',
        text: "#f5f5f5",
    },
    fonts: {
        main: 'Arial, sans-serif',
    },
    fontSizes: {
        smaller: '0.55rem',
        small: '0.8rem',
        medium: '1.5rem',
        bigger: '2rem',
        large: '3rem',
    },
};