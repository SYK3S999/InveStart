/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  "./pages/**/*.{ts,tsx}",
	  "./components/**/*.{ts,tsx}",
	  "./app/**/*.{ts,tsx}",
	  "./src/**/*.{ts,tsx}",
	  "*.{js,ts,jsx,tsx,mdx}",
	],
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
			boxShadow: {
				"neumorphic": "4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(255, 255, 255, 0.7)",
				"neumorphic-hover": "inset 2px 2px 5px rgba(0, 0, 0, 0.15), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
			  },
			  colors: {
				cream: { 50: "#FDFBF7" }, // Adjust as needed
			  },
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
			50: "#EFF6FF",
			100: "#DBEAFE",
			200: "#BFDBFE",
			300: "#93C5FD",
			400: "#60A5FA",
			500: "#3B82F6", // Main primary color
			600: "#2563EB",
			700: "#1D4ED8",
			800: "#1E40AF",
			900: "#1E3A8A",
			950: "#172554",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
			50: "#F0FDFA",
			100: "#CCFBF1",
			200: "#99F6E4",
			300: "#5EEAD4",
			400: "#2DD4BF",
			500: "#14B8A6", // Main secondary color
			600: "#0D9488",
			700: "#0F766E",
			800: "#115E59",
			900: "#134E4A",
			950: "#042F2E",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
			50: "#FFF7ED",
			100: "#FFEDD5",
			200: "#FED7AA",
			300: "#FDBA74",
			400: "#FB923C",
			500: "#F97316", // Main accent color
			600: "#EA580C",
			700: "#C2410C",
			800: "#9A3412",
			900: "#7C2D12",
			950: "#431407",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		fontFamily: {
			sans: ["Cairo", "sans-serif"],
			amiri: ["var(--font-amiri)"],
			tajawal: ['Tajawal', 'sans-serif'],
		  },
		boxShadow: {
		  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
		  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
		  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
		  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
		  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
		  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
		},
		keyframes: {
		  "accordion-down": {
			from: { height: 0 },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: 0 },
		  },
		  fadeIn: {
			from: { opacity: 0 },
			to: { opacity: 1 },
		  },
		  slideUp: {
			from: { transform: "translateY(20px)", opacity: 0 },
			to: { transform: "translateY(0)", opacity: 1 },
		  },
		  pulse: {
			"0%, 100%": { opacity: 1 },
			"50%": { opacity: 0.7 },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		  "fade-in": "fadeIn 0.5s ease-in-out",
		  "slide-up": "slideUp 0.5s ease-out",
		  pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
		},
		backgroundImage: {
		  "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
		  "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
		  "hero-pattern": "url('/pattern-bg.svg')",
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  }
  
  