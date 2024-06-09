import {useNavigate} from 'react-router-dom'
import {useInterval} from 'react-use'
import {isString} from 'remeda'

import {toast} from '@/components/ui/toast'
import {Alert} from '@/modules/bare/alert'
import {Progress} from '@/modules/bare/progress'
import {bareContainerClass, BareLogoTitle, BareSpacer} from '@/modules/bare/shared'
import {trpcReact} from '@/trpc/trpc'
import {t} from '@/utils/i18n'

export function Resetting() {
	const navigate = useNavigate()

	const ctx = trpcReact.useContext()
	const factoryResetStatusQ = trpcReact.system.getFactoryResetStatus.useQuery()
	const {description, progress, error, running} = factoryResetStatusQ.data ?? {}
	const statusError = error && isString(error) ? error : undefined
	const error2 = statusError ?? factoryResetStatusQ.error?.message

	trpcReact.system.factoryReset.useMutation({
		onError: (err) => toast.error(err.message),
	})

	const message = (description ?? t('factory-reset.resetting.connecting')) + '...'

	useInterval(factoryResetStatusQ.refetch, running ? 500 : null)

	// TODO: consider ensuring `navigate` is only ever called once here
	if (progress === 100 && !running) {
		setTimeout(() => {
			ctx.invalidate()
			localStorage.clear()
			// Not redirecting here because we do restart behind the scenes
			// navigate('/factory-reset?factory-reset-state=step-4')
		}, 1000)
	} else if (error2) {
		navigate('/factory-reset/failed')
		toast.error(error2)
	}

	return (
		<div className={bareContainerClass}>
			<BareLogoTitle>{t('factory-reset')}</BareLogoTitle>
			<BareSpacer />
			<Progress value={progress}>{message}</Progress>
			<div className='flex-1 pt-4' />
			<Alert>{t('factory-reset.resetting.dont-turn-off-device')}</Alert>
		</div>
	)
}
