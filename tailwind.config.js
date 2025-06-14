/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.css',
  ],
  safelist: [
    'grid', 'grid-cols-3', 'grid-cols-1', 'gap-8',
    'w-16', 'w-[60px]', 'text-xl', 'h-[32px]', 'max-w-[1600px]', 'w-[1600px]',
  ],
  theme: {
    extend: {
      transitionProperty: {
      'transform': 'transform',
      'opacity': 'opacity',
      'all': 'all',
    },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#536C4A',
        accent: '#B0BF93',
      },
      keyframes: {
        glitchShake: {
      '0%': { transform: 'translate(0, 0)' },
      '20%': { transform: 'translate(-2px, 2px)' },
      '40%': { transform: 'translate(2px, -2px)' },
      '60%': { transform: 'translate(-1px, 1px)' },
      '80%': { transform: 'translate(1px, -1px)' },
      '100%': { transform: 'translate(0, 0)' },
    },
        pacPath: {
          '0%': {
            transform: 'translate(-40px, 0) rotate(0deg)', // ← движется вправо
          },
          '60%': {
            transform: 'translate(calc(1100px - 40px), 0) rotate(0deg)', // всё ещё вправо
          },
          '65%': {
            transform: 'translate(calc(1100px - 40px), 0) rotate(-90deg)', // поворот вверх
          },
          '100%': {
            transform: 'translate(calc(1100px - 40px), -900px) rotate(-90deg)', // вверх
          },
        },
        breath: {
          '0%,100%': { transform: 'scale(1)', opacity: 0.8 },
          '50%': { transform: 'scale(1.35)', opacity: 1 },
        },
        breathLeaf: {
          '0%,100%': { transform: 'scale(1) rotate(0deg)', opacity: 0.8 },
          '50%': { transform: 'scale(1.25) rotate(-8deg)', opacity: 1 },
        },

        pacFade: {
          '0%, 20%': { opacity: 1 },
          '21%, 35%': { opacity: 0.5 },
          '37%, 100%': { opacity: 1 },

                  },
                         trailWipe: {
      '0%': { width: '0px', opacity: 1 },
      '80%': { width: '1100px', opacity: 1 },
      '100%': { width: '1100px', opacity: 0 },
    },
      },
      animation: {
        pacPath: 'pacPath 40s ease-in-out infinite',
        pacFade: 'pacFade 40s linear infinite',
        pacPathFade: 'pacPath 40s ease-in-out infinite, pacFade 40s linear infinite',
        trailWipe: 'trailWipe 40s ease-out forwards',
        breath: 'breath 1.8s ease-in-out infinite',
        breathLeaf: 'breathLeaf 1.8s ease-in-out infinite',
            glitchShake: 'glitchShake 0.3s linear infinite',

      },
    },
  },
  plugins: [],
}