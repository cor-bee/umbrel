import {cva, VariantProps} from 'class-variance-authority'
import {AnimatePresence, motion} from 'framer-motion'
import * as React from 'react'
import {TbAlertCircle, TbEye, TbEyeOff} from 'react-icons/tb'
import {usePreviousDistinct} from 'react-use'

import {cn} from '@/shadcn-lib/utils'
import {tw} from '@/utils/tw'

const inputVariants = cva(
	'flex w-full border-px md:border-hpx border-white/10 bg-white/4 hover:bg-white/6 px-5 py-2 text-15 font-medium -tracking-1 transition-colors duration-300 placeholder:text-white/30 focus-visible:placeholder:text-white/40 text-white/40 focus-visible:text-white focus-visible:bg-white/10 focus-visible:outline-none focus-visible:border-white/50 disabled:cursor-not-allowed disabled:opacity-40',
	{
		variants: {
			variant: {
				default: '',
				destructive: 'text-destructive2-lightest border-destructive2-lightest',
			},
			// `input` element already has a `size` attribute so we need a different name
			sizeVariant: {
				default: 'h-12 rounded-full',
				short: 'h-9 rounded-full',
				'short-square': 'h-9 rounded-8 px-2.5 text-14 font-normal',
			},
		},
		defaultVariants: {
			variant: 'default',
			sizeVariant: 'default',
		},
	},
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
	onValueChange?: (value: string) => void
}

export function Labeled({children, label}: {children: React.ReactNode; label: string}) {
	return (
		<label>
			<div className='mb-1.5 px-[5px] text-12 -tracking-2 text-white/50'>{label}</div>
			{children}
		</label>
	)
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({className, type, variant, sizeVariant, onChange, onValueChange, ...props}, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants({variant, sizeVariant}), className)}
				ref={ref}
				onChange={(e) => {
					onChange?.(e)
					onValueChange?.(e.target.value)
				}}
				{...props}
			/>
		)
	},
)
Input.displayName = 'Input'

// NOTE: If too many props start getting added to this, best to convert to something like this:
// https://www.radix-ui.com/primitives/docs/components/form
export function PasswordInput({
	value,
	label,
	onValueChange,
	error,
	autoFocus,
	sizeVariant,
	inputRef,
	className,
}: {
	value?: string
	/** Calling it a label rather than a placeholder */
	label?: string
	onValueChange?: (value: string) => void
	error?: string
	autoFocus?: boolean
	sizeVariant?: VariantProps<typeof inputVariants>['sizeVariant']
	inputRef?: React.Ref<HTMLInputElement>
	className?: string
}) {
	const [showPassword, setShowPassword] = React.useState(false)
	return (
		<div className={className}>
			<div className={cn(iconRightClasses.root)}>
				<Input
					ref={inputRef}
					variant={error ? 'destructive' : undefined}
					placeholder={label}
					type={showPassword ? 'text' : 'password'}
					className={iconRightClasses.input}
					sizeVariant={sizeVariant}
					value={value}
					onChange={(e) => onValueChange?.(e.target.value)}
					autoFocus={autoFocus}
				/>
				<button
					// Prevent tabbing to this button to prevent accidentally showing the password
					tabIndex={-1}
					type='button'
					className={iconRightClasses.button}
					onClick={() => setShowPassword((prev) => !prev)}
				>
					{showPassword ? <TbEyeOff className={iconRightClasses.icon} /> : <TbEye className={iconRightClasses.icon} />}
				</button>
			</div>
			<AnimatedInputError>{error}</AnimatedInputError>
		</div>
	)
}

export function AnimatedInputError({children}: {children: React.ReactNode}) {
	const [showShake, setShowShake] = React.useState(false)
	const prev = usePreviousDistinct(children)

	React.useEffect(() => {
		if (prev !== children) {
			setShowShake(true)
		}
	}, [children, prev])

	return (
		<AnimatePresence>
			{children && (
				<motion.div
					className={showShake ? 'animate-shake' : undefined}
					onAnimationEnd={() => setShowShake(false)}
					initial={{
						height: 0,
						opacity: 0,
					}}
					animate={{
						height: 'auto',
						className: 'mt-1',
						opacity: 1,
					}}
					exit={{
						height: 0,
						opacity: 0,
					}}
				>
					<InputError>{children}</InputError>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export function InputError({children}: {children: React.ReactNode}) {
	return (
		<div className='flex items-center gap-1 p-1 text-13 font-normal -tracking-2 text-destructive2-lightest'>
			<TbAlertCircle className='h-4 w-4 shrink-0' />
			{children}
		</div>
	)
}

// Grouping like this to because they all depend on each other
/**
 * Classes for
 */
const iconRightClasses = {
	root: tw`relative`,
	input: tw`pr-11`,
	// Using `text-white opacity-40` instead of `text-white/40` because the latter applies to strokes and displays incorrectly
	button: tw`absolute inset-y-0 right-0 h-full pl-2 pr-4 text-white opacity-40 outline-none hover:opacity-80 transition-opacity`,
	icon: tw`h-5 w-5`,
}
