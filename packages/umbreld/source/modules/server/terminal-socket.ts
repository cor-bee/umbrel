import type http from 'node:http'

import {$} from 'execa'
import pty, {IPty} from 'node-pty'
import {type WebSocket} from 'ws'

import type Umbreld from '../../index.js'
import type createLogger from '../utilities/logger.js'

const DEFAULT_SHELL_CONTAINERS: Record<string, string> = {
	bitcoin: 'bitcoind',
	lightning: 'lnd',
	ordinals: 'ord',
	nextcloud: 'web',
	'core-lightning': 'lightningd',
	'home-assistant': 'server',
	'bitcoin-knots': 'bitcoind',
	immich: 'server',
	photoprism: 'web',
}

export default function createTerminalWebSocketHandler({
	umbreld,
	logger,
}: {
	umbreld: Umbreld
	logger: ReturnType<typeof createLogger>
}) {
	return async function (ws: WebSocket, request: http.IncomingMessage) {
		try {
			const appId = new URL(`https://localhost/${request.url}`).searchParams.get('appId')
			const cols = Number(new URL(`https://localhost/${request.url}`).searchParams.get('cols'))
			const rows = Number(new URL(`https://localhost/${request.url}`).searchParams.get('rows'))

			let ptyProcess: IPty

			if (appId) {
				const app = await umbreld.apps.getApp(appId)
				const [manifest, compose] = await Promise.all([app.readManifest(), app.readCompose()])
				let container

				// If app has specified a default shell in it's manifest use that
				if (manifest.defaultShell) {
					container = compose.services![manifest.defaultShell]?.container_name
				}

				// If we don't have a default container specified, use a predefined lookup
				if (!container) {
					container = container = compose.services![DEFAULT_SHELL_CONTAINERS[app.id]]?.container_name
				}

				// If we still don't have a default container use the first container as a fallback
				if (!container) {
					container = Object.values(compose.services!).filter((service) => service.image && service.container_name)[0]
						?.container_name as string
				}

				// launch terminal with interactive docker shell
				ptyProcess = pty.spawn(
					'docker',
					[
						'exec',
						'-it',
						container,
						'/bin/sh',
						'-c',
						'if [ -x /bin/bash ]; then exec /bin/bash; else exec /bin/sh; fi',
					],
					{
						name: 'xterm-color',
						cols,
						rows,
					},
				)
			} else {
				// Get username of first non-root user on the system
				const {stdout: username} = await $`id -nu 1000`
				// launch terminal with non-root user
				ptyProcess = pty.spawn(
					'sudo',
					['--user', username, '--login', 'bash', '-c', 'if [ -f /etc/motd ]; then cat /etc/motd; fi; exec bash'],
					{
						name: 'xterm-color',
						cols,
						rows,
					},
				)
			}
			// Stream output from the shell to the WebSocket
			ptyProcess.onData((data) => ws.send(data))

			// Stream input from the WebSocket to the shell
			ws.on('message', (data) => ptyProcess.write(data.toString()))

			// Kill process when WebSocket is closed
			ws.on('close', () => ptyProcess.kill())
		} catch (error) {
			logger.error(`Terminal socket: ${(error as Error).message}`)
			ws?.close()
		}
	}
}
