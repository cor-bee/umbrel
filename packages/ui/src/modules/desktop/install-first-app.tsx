import {ReactNode} from 'react'
import {Link, useLocation} from 'react-router-dom'

import UmbrelLogo from '@/assets/umbrel-logo'
import {AppIcon} from '@/components/app-icon'
import {ButtonLink} from '@/components/ui/button-link'
import {DockSpacer} from '@/modules/desktop/dock'
import {useAvailableApps} from '@/providers/available-apps'
import {cn} from '@/shadcn-lib/utils'
import {RegistryApp} from '@/trpc/trpc'
import {t} from '@/utils/i18n'
import {tw} from '@/utils/tw'

export function InstallFirstApp() {
	const {pathname} = useLocation()
	const isHome = pathname === '/'

	if (!isHome) return null

	const title = t('install-your-first-app')

	return (
		<div className={cn('relative z-10 flex min-h-[100dvh] flex-col items-center duration-300 animate-in fade-in')}>
			<div className='pt-14' />
			<UmbrelLogo />
			<div className='pt-5' />
			<h1
				className='-translate-y-2 text-center text-3xl font-bold leading-tight -tracking-2 md:text-48'
				style={{
					viewTransitionName: 'title',
				}}
			>
				{title}
			</h1>
			<div className='pt-6' />
			<div className='flex-1' />
			<div className='flex w-full flex-col items-center justify-center'>
				<div className='grid w-full max-w-md gap-[30px] px-2 lg:max-w-[1200px] lg:grid-cols-3 lg:px-[30px]'>
					<Cards />
				</div>
			</div>
			<div className='pt-7' />
			<ButtonLink to='/app-store' className='h-[42px] px-5 py-4 text-14 backdrop-blur-md'>
				{t('desktop.install-first.link-to-app-store')}
			</ButtonLink>
			<div className='pt-[50px]' />
			<div className='flex-grow-[2]' />
			<DockSpacer />
		</div>
	)
}

function Cards() {
	const {appsKeyed, isLoading} = useAvailableApps()

	if (isLoading) {
		return <CardsSkeleton />
	}

	return (
		<>
			<div className={cardClass}>
				<h2 className={cardHeadingClass}>{t('desktop.install-first.for-the-self-hoster')}</h2>
				<AppApp app={appsKeyed['nextcloud']} />
				<AppApp app={appsKeyed['immich']} />
				<AppApp app={appsKeyed['home-assistant']} />
				<AppApp app={appsKeyed['pi-hole']} />
			</div>
			<div className={cardClass}>
				<h2 className={cardHeadingClass}>{t('desktop.install-first.for-the-bitcoiner')}</h2>
				<AppApp app={appsKeyed['bitcoin']} />
				<AppApp app={appsKeyed['lightning']} />
				<AppApp app={appsKeyed['electrs']} />
				<AppApp app={appsKeyed['mempool']} />
			</div>
			<div className={cardClass}>
				<h2 className={cardHeadingClass}>{t('desktop.install-first.for-the-streamer')}</h2>
				<AppApp app={appsKeyed['plex']} />
				<AppApp app={appsKeyed['transmission']} />
				<AppApp app={appsKeyed['sonarr']} />
				<AppApp app={appsKeyed['jellyfin']} />
			</div>
		</>
	)
}

function CardsSkeleton() {
	return (
		<>
			<div className={cardClass}>
				<h2 className={cardHeadingClass}>{t('desktop.install-first.for-the-self-hoster')}</h2>
				<SkeletonApps />
			</div>
			<div className={cardClass}>
				<h2 className={cardHeadingClass}>{t('desktop.install-first.for-the-bitcoiner')}</h2>
				<SkeletonApps />
			</div>
			<div className={cardClass}>
				<h2 className={cardHeadingClass}>{t('desktop.install-first.for-the-streamer')}</h2>
				<SkeletonApps />
			</div>
		</>
	)
}

function SkeletonApps() {
	return (
		<>
			<SkeletonApp />
			<SkeletonApp />
			<SkeletonApp />
			<SkeletonApp />
		</>
	)
}

function SkeletonApp() {
	return <App id='' icon='' appName='' appDescription='' />
}

function AppApp({app}: {app: RegistryApp}) {
	if (!app) return <SkeletonApp />
	return <App id={app.id} icon={app.icon} appName={app.name} appDescription={app.tagline} />
}

function App({
	id,
	icon,
	appName,
	appDescription,
}: {
	id?: string
	icon: string
	appName: ReactNode
	appDescription: ReactNode
}) {
	return (
		<Link
			to={`/app-store/${id}`}
			className='flex w-full items-center gap-2.5 rounded-15 p-2 duration-300 hover:bg-white/4'
		>
			<AppIcon src={icon} size={50} className='rounded-10' />
			<div className='flex min-w-0 flex-1 flex-col'>
				<h3 className='text-15 font-semibold -tracking-3'>{appName}</h3>
				<p className='w-full min-w-0 truncate text-13 opacity-50'>{appDescription}</p>
			</div>
		</Link>
	)
}

const cardClass = tw`rounded-20 backdrop-blur-2xl contrast-more:backdrop-blur-none bg-blend-soft-light bg-gradient-to-b from-black/50 via-black/50 to-black contrast-more:bg-neutral-800 px-4 py-8 shadow-dialog flex flex-col gap-4 min-w-0`

const cardHeadingClass = tw`text-center text-19 font-bold leading-tight -tracking-2`
