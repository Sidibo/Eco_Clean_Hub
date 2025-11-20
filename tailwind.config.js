/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* slate-200 */
        input: "var(--color-input)", /* white */
        ring: "var(--color-ring)", /* blue-600 */
        background: "var(--color-background)", /* slate-50 */
        foreground: "var(--color-foreground)", /* slate-800 */
        primary: {
          DEFAULT: "var(--color-primary)", /* blue-600 */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* emerald-600 */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* slate-100 */
          foreground: "var(--color-muted-foreground)", /* slate-500 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* violet-600 */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* white */
          foreground: "var(--color-popover-foreground)", /* slate-800 */
        },
        card: {
          DEFAULT: "var(--color-card)", /* white */
          foreground: "var(--color-card-foreground)", /* slate-800 */
        },
        success: {
          DEFAULT: "var(--color-success)", /* emerald-500 */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber-500 */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* white */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'civic-xs': ['0.75rem', { lineHeight: '1rem' }],
        'civic-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'civic-base': ['1rem', { lineHeight: '1.5rem' }],
        'civic-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'civic-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'civic-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'civic-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      spacing: {
        'civic-xs': '0.5rem',
        'civic-sm': '0.75rem',
        'civic-md': '1rem',
        'civic-lg': '1.5rem',
        'civic-xl': '2rem',
        'civic-2xl': '3rem',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "civic-pulse": "civic-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "civic-fade-in": "civic-fade-in 0.2s ease-out",
        "civic-slide-in": "civic-slide-in 0.3s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "civic-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.6" },
        },
        "civic-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "civic-slide-in": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        'civic': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'civic-lg': '0 10px 25px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        'civic': '8px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}