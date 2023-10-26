import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {AppIcon} from '@/components/app-icon'
import {useAfterDelayedClose} from '@/components/client-layout'
import {DialogMounter} from '@/components/dialog-mounter'
import {AppT, useAvailableApps} from '@/hooks/use-available-apps'
import {useUmbrelTitle} from '@/hooks/use-umbrel-title'
import {Button} from '@/shadcn-components/ui/button'
import {Dialog, DialogContent, DialogHeader, DialogPortal, DialogTitle} from '@/shadcn-components/ui/dialog'
import {Separator} from '@/shadcn-components/ui/separator'
import {cn} from '@/shadcn-lib/utils'

export function UpdatesDialog() {
	const title = 'Updates'
	useUmbrelTitle(title)
	const navigate = useNavigate()

	const [open, setOpen] = useState(true)

	useAfterDelayedClose(open, () => navigate('/app-store', {preventScrollReset: true}))

	const {isLoading, apps} = useAvailableApps()

	if (isLoading) {
		return <p>Loading...</p>
	}

	return (
		<DialogMounter>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogPortal>
					<DialogContent className='p-0'>
						<div className='umbrel-dialog-fade-scroller flex flex-col gap-y-2.5 overflow-y-auto px-5 py-6'>
							<DialogHeader>
								<DialogTitle className='flex flex-row items-center justify-between'>
									5 updates available{' '}
									<Button size='dialog' variant='primary'>
										Update all
									</Button>
								</DialogTitle>
							</DialogHeader>
							{apps.slice(0, 7).map((app, i) => (
								<>
									{i === 0 ? <Separator className='my-2.5' /> : <Separator className='my-1' />}
									<AppItem app={app} />
								</>
							))}
						</div>
					</DialogContent>
				</DialogPortal>
			</Dialog>
		</DialogMounter>
	)
}

function AppItem({app}: {app: AppT}) {
	const [showAll, setShowAll] = useState(false)
	return (
		<div>
			<div className='flex items-center gap-2.5'>
				<AppIcon src={app.icon} size={36} className='rounded-8' />
				<div className='flex flex-col'>
					<h3 className='text-13 font-semibold'>{app.name}</h3>
					<p className='text-13 opacity-40'>{app.version}</p>
				</div>
				<div className='flex-1' />
				<Button size='sm'>Update</Button>
			</div>
			{app.releaseNotes && (
				<div className='flex items-end'>
					<div className={cn('relative mt-2.5 text-13 opacity-50 transition-all', !showAll && 'line-clamp-2')}>
						{app.releaseNotes}
					</div>
					<button
						className='bottom-0 right-0 text-13 text-brand underline underline-offset-2'
						onClick={() => setShowAll((s) => !s)}
					>
						{showAll ? 'less' : 'more'}
					</button>
				</div>
			)}
		</div>
	)
}