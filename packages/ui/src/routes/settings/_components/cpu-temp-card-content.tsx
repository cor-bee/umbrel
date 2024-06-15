import {AnimatedNumber} from '@/components/ui/animated-number'
import {SegmentedControl} from '@/components/ui/segmented-control'
import {useIsMobile} from '@/hooks/use-is-mobile'
import {tempDescriptions, tempDescriptionsKeyed, TempUnit, useTempUnit} from '@/hooks/use-temp-unit'
import {cn} from '@/shadcn-lib/utils'
import {t} from '@/utils/i18n'
import {isCpuTooHot} from '@/utils/system'
import {celciusToFahrenheit, tempWarningToColor, tempWarningToMessage} from '@/utils/temperature'

import {cardErrorClass, cardSecondaryValueClass, cardTitleClass, cardValueClass} from './shared'

export function CpuTempCardContent({
	tempInCelcius,
	defaultUnit,
	warning,
}: {
	tempInCelcius?: number
	defaultUnit?: TempUnit
	warning?: string
}) {
	const [unit, setUnit] = useTempUnit(defaultUnit)

	const tempNumber = unit === 'c' ? tempInCelcius : celciusToFahrenheit(tempInCelcius)
	const tempUnitLabel = tempDescriptionsKeyed[unit].label
	const tempMessage = tempNumber === 69 ? t('temp.nice') : tempWarningToMessage(warning)

	// 60% opacity to base 16
	const opacity = (60).toString(16)
	const isUnknown = tempNumber === undefined

	const isMobile = useIsMobile()

	return (
		<div className='flex flex-col gap-4'>
			<div className={cardTitleClass}>{t('temperature')}</div>
			<div className='flex flex-wrap-reverse items-center justify-between gap-2'>
				<div className='flex shrink-0 flex-col gap-2.5'>
					<div className={cardValueClass}>
						{isUnknown ? '--' : <AnimatedNumber to={tempNumber} />} {tempUnitLabel}
					</div>
					<div className='flex items-center gap-2'>
						<div
							className={cn('h-[5px] w-[5px] rounded-full ring-3', !isUnknown && 'animate-pulse')}
							style={
								{
									backgroundColor: tempWarningToColor(warning),
									'--tw-ring-color': tempWarningToColor(warning) + opacity,
								} as React.CSSProperties // forcing because of `--tw-ring-color`
							}
						/>
						<div className={cn(cardSecondaryValueClass, 'leading-inter-trimmed')}>{tempMessage}</div>
					</div>
				</div>
				<SegmentedControl
					size={isMobile ? 'sm' : 'default'}
					variant='primary'
					tabs={tempDescriptions}
					value={unit}
					onValueChange={setUnit}
				/>
			</div>
			{isCpuTooHot(warning) && <span className={cardErrorClass}>{t('temperature.too-hot-suggestion')}</span>}
		</div>
	)
}
