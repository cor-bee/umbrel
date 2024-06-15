import {useEffect, useState} from 'react'
import {
	RiExpandRightFill,
	RiKeyLine,
	RiLogoutCircleRLine,
	RiPulseLine,
	RiRestartLine,
	RiShutDownLine,
	RiUserLine,
} from 'react-icons/ri'
import {TbServer, TbSettingsMinus, TbTool, TbWifi} from 'react-icons/tb'
import {useNavigate, useParams} from 'react-router-dom'

import {Card} from '@/components/ui/card'
import {CopyableField} from '@/components/ui/copyable-field'
import {CoverMessage, CoverMessageParagraph} from '@/components/ui/cover-message'
import {IconButton} from '@/components/ui/icon-button'
import {IconButtonLink} from '@/components/ui/icon-button-link'
import {Loading} from '@/components/ui/loading'
import {SETTINGS_SYSTEM_CARDS_ID} from '@/constants'
import {useCpuTemp} from '@/hooks/use-cpu-temp'
import {useTorEnabled} from '@/hooks/use-tor-enabled'
import {DesktopPreviewFrame} from '@/modules/desktop/desktop-preview'
import {DesktopPreviewConnected} from '@/modules/desktop/desktop-preview-basic'
import {WifiListRowConnectedDescription} from '@/modules/wifi/wifi-list-row-connected-description'
import {LanguageDropdownContent, LanguageDropdownTrigger} from '@/routes/settings/_components/language-dropdown'
import {SettingsSummary} from '@/routes/settings/_components/settings-summary'
import {DropdownMenu} from '@/shadcn-components/ui/dropdown-menu'
import {Switch} from '@/shadcn-components/ui/switch'
import {trpcReact} from '@/trpc/trpc'
import {useLinkToDialog} from '@/utils/dialog'
import {t} from '@/utils/i18n'
import {firstNameFromFullName} from '@/utils/misc'

import {CpuCardContent} from './cpu-card-content'
import {CpuTempCardContent} from './cpu-temp-card-content'
import {ListRow} from './list-row'
import {MemoryCardContent} from './memory-card-content'
import {ContactSupportLink} from './shared'
import {SoftwareUpdateListRow} from './software-update-list-row'
import {StorageCardContent} from './storage-card-content'
import {WallpaperPicker} from './wallpaper-picker'

export function SettingsContent() {
	const navigate = useNavigate()
	const linkToDialog = useLinkToDialog()
	const [langOpen, setLangOpen] = useState(false)

	const tor = useTorEnabled()
	const cpuTemp = useCpuTemp()

	const [userQ, wifiSupportedQ, is2faEnabledQ] = trpcReact.useQueries((t) => [
		t.user.get(),
		t.wifi.supported(),
		t.user.is2faEnabled(),
	])

	const hiddenServiceQ = trpcReact.system.hiddenService.useQuery(undefined, {
		enabled: tor.enabled,
	})

	const {settingsDialog} = useParams<{settingsDialog: 'wallpaper' | 'language' | 'software-update'}>()

	// Scroll to hash
	useEffect(() => {
		if (location.hash) {
			const el = document.querySelector(location.hash)
			if (el) {
				el.scrollIntoView({behavior: 'instant', block: 'center'})
			}
		}
	}, [])

	return (
		<div className='animate-in fade-in'>
			<div className='grid w-full gap-x-[30px] gap-y-[20px] lg:grid-cols-[280px_auto]'>
				<div className='flex items-center justify-center'>
					<DesktopPreviewFrame>
						<DesktopPreviewConnected />
					</DesktopPreviewFrame>
				</div>
				<Card className='flex flex-wrap items-center justify-between gap-5'>
					<div>
						<h2 className='text-24 font-bold leading-none -tracking-4'>
							{userQ.data?.name && `${firstNameFromFullName(userQ.data?.name)}’s`}{' '}
							<span className='opacity-40'>{t('umbrel')}</span>
						</h2>
						<div className='pt-5' />
						<SettingsSummary />
					</div>
					<div className='flex w-full flex-col items-stretch gap-2.5 md:w-auto md:flex-row'>
						<IconButtonLink to={linkToDialog('logout')} size='xl' icon={RiLogoutCircleRLine}>
							{t('logout')}
						</IconButtonLink>
						<IconButtonLink to={linkToDialog('restart')} size='xl' icon={RiRestartLine}>
							{t('restart')}
						</IconButtonLink>
						<IconButtonLink to={linkToDialog('shutdown')} size='xl' text='destructive' icon={RiShutDownLine}>
							{t('shut-down')}
						</IconButtonLink>
					</div>
				</Card>
				<div className='flex flex-col gap-3'>
					<Card>
						<StorageCardContent />
					</Card>
					{/* Choosing middle card because we wanna scroll to center to likely see them all */}
					<Card id={SETTINGS_SYSTEM_CARDS_ID}>
						<MemoryCardContent />
					</Card>
					<Card>
						<CpuCardContent />
					</Card>
					<Card>
						<CpuTempCardContent warning={cpuTemp.warning} tempInCelcius={cpuTemp.temp} />
					</Card>
					<div className='mx-auto'>
						<IconButtonLink icon={RiPulseLine} to={linkToDialog('live-usage')}>
							{t('open-live-usage')}
						</IconButtonLink>
					</div>
					<div className='flex-1' />
					<ContactSupportLink className='max-lg:hidden' />
				</div>
				<Card className='umbrel-divide-y overflow-hidden !py-0'>
					<ListRow title={t('account')} description={t('account-description')}>
						<div className='flex flex-wrap gap-2 pt-3'>
							<IconButtonLink to={'account/change-name'} icon={RiUserLine}>
								{t('change-name')}
							</IconButtonLink>
							<IconButtonLink to={'account/change-password'} icon={RiKeyLine}>
								{t('change-password')}
							</IconButtonLink>
						</div>
					</ListRow>
					<ListRow
						title={t('wallpaper')}
						description={t('wallpaper-description')}
						isActive={settingsDialog === 'wallpaper'}
					>
						{/* -mx-2 so that when last item is active, it right aligns with other list row buttons, and first item aligns on mobile when picker wrapped down */}
						{/* w-full to prevent overflow issues */}
						<div className='-mx-2 max-w-full'>
							<WallpaperPicker />
						</div>
					</ListRow>
					{wifiSupportedQ.data ? (
						<WifiSupportedListRow />
					) : (
						<ListRow title={t('wifi')} description={t('wifi-description')}>
							<Switch checked={false} onCheckedChange={() => navigate('wifi-unsupported')} />
						</ListRow>
					)}
					<ListRow title={t('2fa')} description={t('2fa-description')} disabled={is2faEnabledQ.isLoading}>
						<Switch checked={is2faEnabledQ.data} onCheckedChange={() => navigate('2fa')} />
					</ListRow>
					<ListRow title={t('remote-tor-access')} description={t('tor-description')} disabled={tor.isLoading}>
						<div className='flex flex-wrap gap-3'>
							{tor.enabled && <CopyableField narrow value={hiddenServiceQ.data ?? ''} />}
							<Switch
								checked={tor.enabled}
								onCheckedChange={(checked) => (checked ? navigate('tor') : tor.setEnabled(false))}
							/>
						</div>
					</ListRow>
					{tor.isMutLoading && (
						<CoverMessage>
							<Loading>{t('tor.disable.progress')}</Loading>
							<CoverMessageParagraph>{t('tor.disable.description')}</CoverMessageParagraph>
						</CoverMessage>
					)}
					<ListRow title={t('migration-assistant')} description={t('migration-assistant-description')}>
						{/* We could use an IconButtonLink but then the ` from `ListRow` wouldn't work */}
						<IconButton icon={RiExpandRightFill} onClick={() => navigate('migration-assistant')}>
							{t('migrate')}
						</IconButton>
					</ListRow>
					{/* TODO: Uncomment and enable after fixing translations  */}
					<ListRow
						title={t('language')}
						description={t('language-description')}
						onClick={() => setLangOpen(true)}
						isActive={settingsDialog === 'language'}
					>
						<DropdownMenu open={langOpen} onOpenChange={setLangOpen}>
							<LanguageDropdownTrigger />
							<LanguageDropdownContent />
						</DropdownMenu>
					</ListRow>
					{/* <ListRow title={t('app-store.title')} description={t('app-store.description')}>
						<IconButton icon={RiEqualizerLine} onClick={() => navigate(linkToDialog('app-store-preferences'))}>
							{t('preferences')}
						</IconButton>
					</ListRow> */}
					<ListRow title={t('troubleshoot')} description={t('troubleshoot-description')}>
						<IconButton icon={TbTool} onClick={() => navigate('troubleshoot')}>
							{t('troubleshoot')}
						</IconButton>
					</ListRow>
					<ListRow title={t('device-info')} description={t('device-info-description')}>
						<IconButton icon={TbServer} onClick={() => navigate('device-info')}>
							{t('device-info.view-info')}
						</IconButton>
					</ListRow>
					<ListRow title={t('advanced-settings')} description={t('advanced-settings-description')}>
						<IconButtonLink icon={TbSettingsMinus} to='/settings/advanced'>
							{t('open')}
						</IconButtonLink>
					</ListRow>
					<SoftwareUpdateListRow isActive={settingsDialog === 'software-update'} />
					{/* <ListRow title={t('factory-reset')} description={t('factory-reset.desc')}>
						<IconButton text='destructive' icon={TbRotate2} onClick={() => navigate('/factory-reset')}>
							{t('factory-reset.reset')}
						</IconButton>
					</ListRow> */}
				</Card>
				<ContactSupportLink className='lg:hidden' />
			</div>
		</div>
	)
}

function WifiSupportedListRow() {
	const navigate = useNavigate()
	const wifiQ = trpcReact.wifi.connected.useQuery()

	return wifiQ.data?.status === 'connected' ? (
		<ListRow
			title={t('wifi')}
			description={<WifiListRowConnectedDescription network={wifiQ.data} />}
			disabled={wifiQ.isLoading}
		>
			<IconButtonLink to={'wifi'} icon={TbWifi}>
				{t('wifi-view-networks')}
			</IconButtonLink>
		</ListRow>
	) : (
		<ListRow title={t('wifi')} description={t('wifi-description')} disabled={wifiQ.isLoading}>
			<Switch checked={false} onCheckedChange={() => navigate('wifi')} />
		</ListRow>
	)
}
