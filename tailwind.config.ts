import type { Config } from "tailwindcss";

export default {
	darkMode: "class", // Disable automatic dark mode detection
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
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
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Accessible interactive colors
				interactive: {
					primary: 'hsl(var(--interactive-primary))',
					'primary-hover': 'hsl(var(--interactive-primary-hover))',
					secondary: 'hsl(var(--interactive-secondary))',
					'secondary-hover': 'hsl(var(--interactive-secondary-hover))'
				},
				// Wisdom Empire custom colors - locked brand palette
				wisdom: {
					gold: 'hsl(var(--wisdom-gold))',
					blue: 'hsl(var(--wisdom-blue))',
					cultural: 'hsl(var(--wisdom-cultural))',
					navy: 'hsl(var(--wisdom-navy))',
					'light-gold': 'hsl(var(--wisdom-light-gold))',
					'dark-blue': 'hsl(var(--wisdom-dark-blue))'
				}
			},
			backgroundImage: {
				'gradient-wisdom': 'var(--gradient-wisdom)',
				'gradient-cultural': 'var(--gradient-cultural)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-nav': 'var(--gradient-nav)',
			},
			boxShadow: {
				'wisdom': 'var(--shadow-wisdom)',
				'cultural': 'var(--shadow-cultural)',
				'elevated': 'var(--shadow-elevated)',
				'card': 'var(--shadow-card)',
				'card-hover': 'var(--shadow-card-hover)',
			},
			fontFamily: {
				'wisdom': 'var(--font-wisdom)',
				'cultural': 'var(--font-cultural)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px 5px rgba(244, 63, 94, 0.4)'
					},
					'50%': {
						boxShadow: '0 0 30px 10px rgba(244, 63, 94, 0.6)'
					}
				},
				'heartbeat': {
					'0%, 100%': {
						transform: 'scale(1)'
					},
					'25%': {
						transform: 'scale(1.2)'
					},
					'50%': {
						transform: 'scale(1)'
					},
					'75%': {
						transform: 'scale(1.1)'
					}
				},
				'tab-bounce': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-2px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
				'tab-bounce': 'tab-bounce 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
