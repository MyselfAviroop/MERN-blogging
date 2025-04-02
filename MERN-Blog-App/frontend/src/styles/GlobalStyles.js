import { createGlobalStyle } from 'styled-components';
import { theme } from './theme.js';

export const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: ${theme.typography.fontFamily};
        background-color: ${theme.colors.background};
        color: ${theme.colors.text};
        line-height: ${theme.typography.body.lineHeight};
        font-size: ${theme.typography.body.fontSize};
    }

    h1, h2, h3, h4, h5, h6 {
        color: ${theme.colors.primary};
        margin-bottom: ${theme.spacing.md};
    }

    h1 {
        font-size: ${theme.typography.h1.fontSize};
        font-weight: ${theme.typography.h1.fontWeight};
        line-height: ${theme.typography.h1.lineHeight};
    }

    h2 {
        font-size: ${theme.typography.h2.fontSize};
        font-weight: ${theme.typography.h2.fontWeight};
        line-height: ${theme.typography.h2.lineHeight};
    }

    h3 {
        font-size: ${theme.typography.h3.fontSize};
        font-weight: ${theme.typography.h3.fontWeight};
        line-height: ${theme.typography.h3.lineHeight};
    }

    p {
        margin-bottom: ${theme.spacing.md};
        color: ${theme.colors.textLight};
    }

    a {
        color: ${theme.colors.secondary};
        text-decoration: none;
        transition: color ${theme.transitions.fast};
        
        &:hover {
            color: ${theme.colors.accent};
        }
    }

    button {
        cursor: pointer;
        border: none;
        background: none;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
    }

    input, textarea, select {
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        background: none;
        border: 1px solid ${theme.colors.border};
        border-radius: ${theme.borderRadius.md};
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        transition: all ${theme.transitions.fast};

        &:focus {
            outline: none;
            border-color: ${theme.colors.secondary};
            box-shadow: 0 0 0 2px rgba(9, 132, 227, 0.1);
        }
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 ${theme.spacing.md};
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        border-radius: ${theme.borderRadius.md};
        font-weight: 500;
        transition: all ${theme.transitions.fast};
        cursor: pointer;

        &-primary {
            background: ${theme.colors.gradient.primary};
            color: white;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: ${theme.shadows.md};
            }
        }

        &-secondary {
            background: ${theme.colors.gradient.secondary};
            color: white;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: ${theme.shadows.md};
            }
        }

        &-outline {
            border: 2px solid ${theme.colors.secondary};
            color: ${theme.colors.secondary};
            
            &:hover {
                background: ${theme.colors.secondary};
                color: white;
            }
        }
    }

    .card {
        background: ${theme.colors.surface};
        border-radius: ${theme.borderRadius.lg};
        padding: ${theme.spacing.lg};
        box-shadow: ${theme.shadows.sm};
        transition: all ${theme.transitions.normal};

        &:hover {
            transform: translateY(-4px);
            box-shadow: ${theme.shadows.md};
        }
    }

    .form-group {
        margin-bottom: ${theme.spacing.lg};
    }

    .alert {
        padding: ${theme.spacing.md};
        border-radius: ${theme.borderRadius.md};
        margin-bottom: ${theme.spacing.md};

        &-success {
            background: rgba(0, 184, 148, 0.1);
            color: ${theme.colors.success};
            border: 1px solid ${theme.colors.success};
        }

        &-error {
            background: rgba(214, 48, 49, 0.1);
            color: ${theme.colors.error};
            border: 1px solid ${theme.colors.error};
        }
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid ${theme.colors.surface};
        border-top-color: ${theme.colors.secondary};
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`; 