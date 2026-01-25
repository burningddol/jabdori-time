export const theme = {
  colors: {
    background: '#0a0a0a',
    surface: '#1a1a1a',
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    text: '#ffffff',
    textMuted: '#888888',
    textDim: '#666666',
    border: '#333333',
    error: '#ff4757',
  },
  fonts: {
    primary: "  system-ui",
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
  },
};

export type Theme = typeof theme;
