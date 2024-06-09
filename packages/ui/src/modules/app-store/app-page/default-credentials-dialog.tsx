import {useId} from 'react'

import {CopyableField} from '@/components/ui/copyable-field'
import {useLaunchApp} from '@/hooks/use-launch-app'
import {useQueryParams} from '@/hooks/use-query-params'
import {useUserApp} from '@/providers/apps'
import {Button} from '@/shadcn-components/ui/button'
import {Checkbox, checkboxContainerClass, checkboxLabelClass} from '@/shadcn-components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogPortal,
	DialogTitle,
} from '@/shadcn-components/ui/dialog'
import {Separator} from '@/shadcn-components/ui/separator'
import {cn} from '@/shadcn-lib/utils'
import {trpcReact} from '@/trpc/trpc'
import {useDialogOpenProps} from '@/utils/dialog'
import {t} from '@/utils/i18n'
import {tw} from '@/utils/tw'

// TODO: move out of app-store/app-page since it's used elsewhere
export function DefaultCredentialsDialog() {
	const params = useQueryParams()
	const dialogProps = useDialogOpenProps('default-credentials')

	const appId = params.params.get('default-credentials-for')
	const direct = params.params.get('default-credentials-direct') === 'true'

	const launchApp = useLaunchApp()

	const {app, isLoading} = useUserApp(appId)

	if (isLoading || !appId || !app) {
		return null
	}

	// TODO: replace with API call
	const appName = app.name
	const defaultUsername = app.credentials.defaultUsername
	const defaultPassword = app.credentials.defaultPassword

	const title = t('default-credentials.title', {app: appName})

	return (
		<Dialog {...dialogProps}>
			<DialogPortal>
				<DialogContent
					className='p-0'
					onOpenAutoFocus={(e) => {
						// `preventDefault` to prevent focus on first input
						e.preventDefault()
					}}
				>
					<div className='umbrel-dialog-fade-scroller flex flex-col gap-y-4 overflow-y-auto p-7'>
						{/* <JSONTree data={app} /> */}
						<DialogHeader>
							<DialogTitle className='flex flex-row items-center justify-between'>{title}</DialogTitle>
							<DialogDescription>{t('default-credentials.description')}</DialogDescription>
						</DialogHeader>
						<Separator />
						{defaultUsername && (
							<div>
								<label className={textClass}>{t('default-credentials.username')}</label>
								<CopyableField value={defaultUsername} />
							</div>
						)}
						{defaultPassword && (
							<div>
								<label className={textClass}>{t('default-credentials.password')}</label>
								<CopyableField isPassword value={defaultPassword} />
							</div>
						)}
						<Separator />
						<div className='flex items-center justify-between'>
							{direct && <ShowCredentialsBeforeOpenCheckbox appId={appId} />}
							{direct ? (
								<Button
									variant='primary'
									size='dialog'
									className='w-auto'
									onClick={() => launchApp(appId, {direct: true})}
								>
									{t('default-credentials.open', {app: appName})}
								</Button>
							) : (
								<Button
									variant='primary'
									size='dialog'
									className='w-auto'
									onClick={() => dialogProps.onOpenChange(false)}
								>
									{t('default-credentials.close')}
								</Button>
							)}
						</div>
					</div>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	)
}

function ShowCredentialsBeforeOpenCheckbox({appId}: {appId: string}) {
	const checkboxId = useId()
	const {app, isLoading} = useUserApp(appId)

	const showCredentials = app?.showCredentialsBeforeOpen ?? false

	const ctx = trpcReact.useContext()

	// @ts-expect-error `showCredentialsBeforeOpen`
	const showCredentialsBeforeOpenMut = trpcReact.apps.showCredentialsBeforeOpen.useMutation({
		onSuccess: () => ctx.apps.invalidate(),
	})

	const handleShowCredentialsBeforeOpenChange = (checked: boolean) => {
		showCredentialsBeforeOpenMut.mutate({appId, showCredentialsBeforeOpen: !checked})
	}

	return (
		<div
			className={cn(
				checkboxContainerClass,
				// prevent interaction when loading
				(isLoading || showCredentialsBeforeOpenMut.isLoading) && 'pointer-events-none',
			)}
		>
			<Checkbox
				id={checkboxId}
				checked={!showCredentials}
				onCheckedChange={(c) => handleShowCredentialsBeforeOpenChange(!!c)}
			/>
			<label htmlFor={checkboxId} className={cn(checkboxLabelClass, 'text-13')}>
				{t('default-credentials..dont-show-again')}
			</label>
		</div>
	)
}

const textClass = tw`text-13 font-normal text-white/40`
