import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#2D3720',
        olive: '#4A5C1A',
        fern: '#6B8024',
        sage: '#8DA44C',
        amber: '#C97D1A',
        gold: '#D4A84B',
        honey: '#F0C46A',
        cream: '#F5F0E8',
        linen: '#EDE8DE',
        sand: '#DDD8CC',
        stone: '#9E9888',
        driftwood: '#7A7463',
        charcoal: '#3E3E35',
        teal: '#2E8B70',
        coral: '#E8593C',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
