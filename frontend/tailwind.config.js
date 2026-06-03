/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#1a1a1a',
        surface: '#f9fafb',
        card: '#ffffff',
        'card-foreground': '#1a1a1a',
        primary: '#1e40af',
        'primary-foreground': '#ffffff',
        'primary-hover': '#1e3a8a',
        'primary-light': '#dbeafe',
        success: '#15803d',
        'success-light': '#dcfce7',
        error: '#ef4444',
        'error-light': '#fee2e2',
        warning: '#f59e0b',
        'warning-light': '#fef3c7',
        info: '#3b82f6',
        'info-light': '#dbeafe',
        muted: '#f3f4f6',
        'muted-foreground': '#6b7280',
        border: '#e5e7eb',
        'input-background': '#f9fafb',
      },
      fontFamily: {
        display: ['Fraunces'],
        body: ['Manrope'],
      },
      borderRadius: {
        lg: '8px',
      },
    },
  },
  plugins: [],
};
