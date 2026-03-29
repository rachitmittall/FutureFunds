export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        ff: {
          bg: '#0B0F19',
          card: '#141820',
          sidebar: '#080B12',
          border: '#1E2433',
          neon: '#00FF94',
          blue: '#3B82F6',
          danger: '#FF4B4B',
          gold: '#F59E0B',
          silver: '#94A3B8',
          text: '#FFFFFF',
          textSec: '#94A3B8',
          textMuted: '#4B5563',
        }
      },
      boxShadow: {
        md: '0 10px 20px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3)',
        lg: '0 20px 40px rgba(0, 0, 0, 0.5), 0 8px 14px rgba(0, 0, 0, 0.4)',
        glow: '0 0 20px rgba(0, 255, 148, 0.1)',
        'glow-strong': '0 0 30px rgba(0, 255, 148, 0.5)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.1)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.1)',
        'glow-silver': '0 0 20px rgba(148, 163, 184, 0.1)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.1)',
        'glow-red': '0 0 20px rgba(255, 75, 75, 0.1)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(0, 255, 148, 0.0)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 148, 0.35)' },
        },
        bgGradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 420ms ease-out both',
        glow: 'glow 1.6s ease-in-out infinite',
        'bg-gradient': 'bgGradient 15s ease infinite',
      },
    },
  },
  plugins: [],
}

