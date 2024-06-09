import {cva} from 'class-variance-authority'
import {useContext} from 'react'

import {cn} from '@/shadcn-lib/utils'
import {tw} from '@/utils/tw'

import {BackdropBlurVariantContext} from './backdrop-blur-context'

export const widgetContainerCva = cva(
	cn(
		tw`bg-neutral-800/60 rounded-12 md:rounded-20 w-[var(--widget-w)] h-[var(--widget-h)] shrink-0 flex flex-col gap-2 cursor-default text-left`,
		// animations
		tw`transition-[transform,box-shadow] duration-300 hover:scale-105`,
	),
	// ^-- Using `tw` to force vscode to recognize the tailwind classes
	{
		variants: {
			variant: {
				'with-backdrop-blur':
					'bg-neutral-900/70 backdrop-blur-xl backdrop-saturate-150 backdrop-brightness-[1.25] contrast-more:backdrop-blur-none contrast-more:bg-neutral-900 backdrop-saturate-[300%] shadow-widget',
				default: 'bg-neutral-900/80 shadow-widget',
			},
		},
		defaultVariants: {
			variant: 'with-backdrop-blur',
		},
	},
)

export const widgetTextCva = cva('text-11 md:text-13 leading-snug font-semibold -tracking-2 truncate', {
	variants: {
		opacity: {
			primary: 'opacity-80',
			secondary: 'opacity-50',
			tertiary: 'opacity-25',
		},
	},
})

type WidgetContainerButtonProps = React.ComponentPropsWithoutRef<'button'>
type WidgetContainerDivProps = React.ComponentPropsWithoutRef<'div'>
type WidgetContainerProps = WidgetContainerButtonProps | WidgetContainerDivProps

/** Make the widget a button if we pass an `onClick` */
export const WidgetContainer: React.FC<WidgetContainerProps> = ({className, ...props}) => {
	const variant = useContext(BackdropBlurVariantContext)

	// Forcing the correct types for `props`
	// Only allow `onClick` to do something if it's truthy
	if ('onClick' in props) {
		const p = props as WidgetContainerButtonProps
		return (
			<button
				className={cn(
					widgetContainerCva({variant}),
					'cursor-pointer ring-white/25 focus:outline-none focus-visible:ring-6 active:scale-95',
					className,
				)}
				{...p}
			/>
		)
	} else {
		const p = props as WidgetContainerDivProps
		return <div className={cn(widgetContainerCva({variant}), className)} {...p} />
	}
}
