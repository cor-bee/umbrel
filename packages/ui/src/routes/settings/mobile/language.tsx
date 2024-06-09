import {useId, useState} from 'react'

import {listClass, ListRadioItem} from '@/components/ui/list'
import {languages, SupportedLanguageCode, useLanguage} from '@/hooks/use-language'
import {useSettingsDialogProps} from '@/routes/settings/_components/shared'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/shadcn-components/ui/drawer'
import {t} from '@/utils/i18n'
import {sleep} from '@/utils/misc'

export function LanguageDrawer() {
	const title = t('language')
	const dialogProps = useSettingsDialogProps()
	const [activeCode, setActiveCode] = useLanguage()
	const [tempCode, setTempCode] = useState(activeCode)

	const changeLanguage = async (code: SupportedLanguageCode) => {
		// Using this janky approach with a temp code because we want to show feedback right away
		// and also close the dialog (which updates the page URL), so the timeout causes the page refresh to happen
		// at the desired url
		setTempCode(code)
		// Delay so user can see the checkmark
		await sleep(200)
		dialogProps.onOpenChange(false)
		setTimeout(() => setActiveCode(code), 200)
	}

	const radioName = useId()

	return (
		<Drawer {...dialogProps}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{t('language.select-description')}</DrawerDescription>
				</DrawerHeader>

				<div className={listClass}>
					{languages.map(({code, name}) => (
						<ListRadioItem
							key={code}
							name={radioName}
							checked={tempCode === code}
							onSelect={() => changeLanguage(code)}
						>
							{name}
						</ListRadioItem>
					))}
				</div>
				{/* empty `DrawerFooter` adding bottom spacing */}
				<DrawerFooter></DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
