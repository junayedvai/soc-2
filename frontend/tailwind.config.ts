import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 10px 35px rgba(0,0,0,0.55)',
        neon: '0 0 0 1px rgba(120,100,255,0.15), 0 0 28px rgba(120,100,255,0.25)'
      },
      backgroundImage: {
        'soc-gradient':
          'radial-gradient(1200px 600px at 20% 10%, rgba(130,90,255,0.25), transparent 60%), radial-gradient(900px 450px at 70% 20%, rgba(0,200,255,0.18), transparent 55%), radial-gradient(1000px 600px at 50% 85%, rgba(255,140,40,0.12), transparent 60%), linear-gradient(180deg, #070A12 0%, #04050B 100%)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config
