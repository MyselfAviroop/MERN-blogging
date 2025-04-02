export const theme = {
    colors: {
        primary: '#2D3436',
        secondary: '#0984E3',
        accent: '#00B894',
        background: '#FFFFFF',
        surface: '#F5F6FA',
        text: '#2D3436',
        textLight: '#636E72',
        error: '#D63031',
        success: '#00B894',
        warning: '#FDCB6E',
        border: '#DFE6E9',
        gradient: {
            primary: 'linear-gradient(135deg, #0984E3 0%, #00B894 100%)',
            secondary: 'linear-gradient(135deg, #2D3436 0%, #636E72 100%)',
            accent: 'linear-gradient(135deg, #00B894 0%, #00CEC9 100%)'
        }
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        h1: {
            fontSize: '3.5rem',
            fontWeight: 700,
            lineHeight: 1.2
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 600,
            lineHeight: 1.3
        },
        h3: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.4
        },
        body: {
            fontSize: '1rem',
            lineHeight: 1.6
        },
        small: {
            fontSize: '0.875rem',
            lineHeight: 1.5
        }
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        xxl: '3rem'
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        full: '9999px'
    },
    shadows: {
        sm: '0 2px 4px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)',
        xl: '0 20px 25px rgba(0,0,0,0.15)'
    },
    transitions: {
        fast: '0.2s ease',
        normal: '0.3s ease',
        slow: '0.5s ease'
    },
    breakpoints: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1280px'
    }
}; 