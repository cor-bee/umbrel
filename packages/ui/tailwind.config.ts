import tailwindContainerQueries from '@tailwindcss/container-queries'
import tailwindTypography from '@tailwindcss/typography'
import {mapValues} from 'remeda'
import tailwindCssAnimate from 'tailwindcss-animate'
import defaultTheme from 'tailwindcss/defaultTheme'
import {PluginAPI} from 'tailwindcss/types/config'

import {screens} from './src/utils/tw'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './stories/**/*.{js,ts,jsx,tsx}'],
	future: {
		// This allows ring-brand/40 (ring color with opacity to work correctly)
		// https://github.com/tailwindlabs/tailwindcss/issues/9016#issuecomment-1205713065
		respectDefaultRingColorOpacity: true,
	},
	theme: {
		fontFamily: {
			sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
			mono: ['Roboto', ...defaultTheme.fontFamily.mono],
		},
		container: {
			center: true,
			padding: '2rem',
		},
		screens: mapValues(screens, (value) => value + 'px'),
		extend: {
			flexShrink: {
				// Used if you want to shrink the item totally if no room
				full: '9999',
			},
			borderRadius: {
				// Using numbers instead of sm, md, lg because easier to add radii in between later
				3: '3px',
				4: '4px',
				5: '5px',
				6: '6px',
				8: '8px',
				10: '10px',
				12: '12px',
				15: '15px',
				17: '17px',
				20: '20px',
				24: '24px',
			},
			colors: {
				// Extracted from background
				brand: 'hsl(var(--color-brand) / <alpha-value>)',
				'brand-lighter': 'hsl(var(--color-brand-lighter) / <alpha-value>)',
				'brand-lightest': 'hsl(var(--color-brand-lightest) / <alpha-value>)',
				//
				destructive: '#E03E3E',
				destructive2: '#E22C2C',
				'destructive2-lighter': '#F53737',
				'destructive2-lightest': '#F45A5A',
				success: '#299E16',
				'success-light': '#51CB41',
				'dialog-content': '#1E1E1E',
			},
			borderWidth: {
				px: '1px',
				hpx: '0.5px',
			},
			boxShadow: {
				dock: '1.06058px 0px 0px 0px rgba(255, 255, 255, 0.04) inset, -1.06058px 0px 0px 0px rgba(255, 255, 255, 0.04) inset, 0px 1.06058px 0px 0px rgba(255, 255, 255, 0.20) inset, 0px 0.53029px 0px 0px rgba(255, 255, 255, 0.10) inset, 0px 4.04029px 24.24174px 0px rgba(0, 0, 0, 0.56)',
				'glass-button':
					'1px 0px 0px 0px rgba(255, 255, 255, 0.04) inset, -1px 0px 0px 0px rgba(255, 255, 255, 0.04) inset, 0px 1px 0px 0px rgba(255, 255, 255, 0.20) inset, 0px 0.5px 0px 0px rgba(255, 255, 255, 0.10) inset',
				widget:
					'0px 20px 30px 0px rgba(0, 0, 0, 0.30), 0 1px 0 0 rgba(255, 255, 255, 0.2) inset, 1px 0 0 0 rgba(255, 255, 255, 0.04) inset, -1px 0 0 0 rgba(255, 255, 255, 0.04) inset',
				'context-menu':
					'1.05px 0px 0px 0px rgba(255, 255, 255, 0.04) inset, -1.05px 0px 0px 0px rgba(255, 255, 255, 0.04) inset, 0px 0.525px 0px 0px rgba(255, 255, 255, 0.10) inset, 0px 24px 36px 0px rgba(0, 0, 0, 0.50)',
				'sheet-shadow': '2px 2px 2px 0px rgba(255, 255, 255, 0.05) inset',
				dropdown:
					'0px 60px 24px -40px rgba(0, 0, 0, 0.25), 1px 1px 0px 0px rgba(255, 255, 255, 0.08) inset, -1px -1px 1px 0px rgba(0, 0, 0, 0.20) inset',
				dialog: '0px 20px 36px 0px rgba(0, 0, 0, 0.25), 0px 1px 1px 0px rgba(255, 255, 255, 0.1) inset',
				'button-highlight': '0px 1px 0px 0px rgba(255, 255, 255, 0.3) inset',
				'button-highlight-hpx': '0px 0.5px 0px 0px rgba(255, 255, 255, 0.3) inset',
				'button-highlight-soft': '0px 1px 0px 0px rgba(255, 255, 255, 0.1) inset',
				'button-highlight-soft-hpx': '0px 0.5px 0px 0px rgba(255, 255, 255, 0.1) inset',
				'immersive-dialog-close':
					'0px 32px 32px 0px rgba(0, 0, 0, 0.32), 1px 1px 1px 0px rgba(255, 255, 255, 0.08) inset',
				'radio-outline': '0 0 0 1px rgba(255, 255, 255, 0.2) inset',
			},
			dropShadow: {
				'desktop-label': '0px 2px 4px rgba(0, 0, 0, 0.60)',
			},
			opacity: {
				3: '0.03',
				4: '0.04',
				6: '0.06',
			},
			fontSize: {
				11: '11px',
				12: '12px',
				13: '13px',
				14: '14px',
				15: '15px',
				16: '16px',
				17: '17px',
				19: '19px',
				24: '24px',
				32: '32px',
				36: '36px',
				48: '48px',
				56: '56px',
			},
			backdropBlur: {
				'4xl': '180px',
			},
			lineHeight: {
				'inter-trimmed': '0.73',
			},
			lineClamp: {
				10: '10',
			},
			letterSpacing: {
				'1': '0.01em',
				'2': '0.02em',
				'3': '0.03em',
				'4': '0.04em',
			},
			ringWidth: {
				3: '3px',
				6: '6px',
			},
			aspectRatio: {
				'2.25': '225 / 100',
				'1.6': '160 / 100',
				'1.9': '190 / 100',
			},
			keyframes: {
				'accordion-down': {
					from: {height: '0px'},
					to: {height: 'var(--radix-accordion-content-height)'},
				},
				'accordion-up': {
					from: {height: 'var(--radix-accordion-content-height)'},
					to: {height: '0px'},
				},
				// Keyframes from:
				// https://css-tricks.com/snippets/css/shake-css-keyframe-animation/
				shake: {
					'10%, 90%': {
						transform: 'translate3d(-1px, 0, 0)',
					},
					'20%, 80%': {
						transform: 'translate3d(2px, 0, 0)',
					},
					'30%, 50%, 70%': {
						transform: 'translate3d(-4px, 0, 0)',
					},
					'40%, 60%': {
						transform: 'translate3d(4px, 0, 0)',
					},
				},
				'sliding-loader': {
					'0%, 100%': {
						left: '-30%',
					},
					'50%': {
						left: '100%',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				shake: 'shake 0.7s ease-out both',
				'sliding-loader': 'sliding-loader 1s ease infinite',
			},
			typography: () => ({
				neutral: {
					css: {
						'--tw-prose-invert-bullets': 'rgb(255 255 255 / 50%)',
						'--tw-prose-invert-pre-bg': 'rgb(255 255 255 / 10%)',
					},
				},
			}),
		},
	},
	plugins: [tailwindCssAnimate, tailwindContainerQueries, tailwindTypography, utilPlugin],
}

function utilPlugin(plugin: PluginAPI) {
	plugin.addUtilities({
		'.absolute-center': {
			position: 'absolute',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
		},
	})
}
