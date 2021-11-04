<script>
	import { onMount } from 'svelte'
	import { FetchData, FetchLiveInfo } from './API.js'
	import Cube from './Cube.svelte'
	import Chat from './Chat.svelte'
	import Station from './Station.svelte'
	import Document from './Document.svelte'
	import { index, state, data, chat, live, smoothing } from './Store.js'
	export let name;


	const _PLAY = 'PLAY'
	const _CHAT = 'CHAT'
	const _NOCHAT = 'NOCHAT'

	let HASH


	onMount( async e => {
		await data.set( await FetchData() )
		console.log('[App] mounted')
		$state.data = true
		$chat = getChat()
		onHash()
		$state.hash = true
		$state.inited = true

		getLiveInfo()
	})

	$: HASHLIST = [...($data?.stations || []).map(s=>s.id),_PLAY,_CHAT]

	function onHash( e ) {
		if (!$state.data) return
		HASH = window.location.hash.substring(1)
		let idx = HASHLIST.indexOf(HASH)
		console.log(`[App] 🔻  setting index from hash ${HASH} ${idx}`)
		index.set(idx)
	}

	function getChat() {
		return window.localStorage.getItem(_CHAT) == _CHAT ? true : false 
	}

	function onToggleChat(e) {
		// https://go.rocket.chat/room?host=<chat.server>
		let b = $chat ? _NOCHAT : _CHAT
		window.localStorage.setItem(_CHAT, b)
		$chat = getChat()
		console.log(`[App] 💬 toggled chat to ${b} ${$chat}`)
	}

	let dontHashUpdate = false
	let lastIndex = -2
	$: (_index => {
		if (!$state.inited || !$state.data  || lastIndex == $index) return
		let id = HASHLIST[$index]
		console.log(`[App] 🔺 setting hash from id ${id} ${$index}`)
		window.location.hash = id || ''
		lastIndex = $index
		setTimeout( e => ($state.hash = false), 10)
	})($index)

	async function getLiveInfo() {
		if ($index < 6) {
			let _live = await FetchLiveInfo()
			if (_live) $live = window.live = _live
		}
		setTimeout(getLiveInfo, 1000 * 5)
	}

	$: LIVE = ($live || []).find( l => (l.id == HASH) )?.message || ''

	let components = [
		Station,
		Station,
		Station,
		Station,
		Station,
		Document
	]

	function onOpenChat() {

		window.localStorage.setItem(_CHAT, _NOCHAT)
		$chat = false
		window.open('#' + _CHAT, _CHAT, 'directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no,width=600,height=800')
	}


</script>
<svelte:window on:hashchange={onHash} />
<main class="sassis flex row-center-stretch w100vw h100vh overflow-auto">


	{#if $state.inited && $index <= 5 && $state.data}

		<div class="flex column-center-center p1 grow w100pc make-column">
			<div class="maxwidth flex column">
				<header class="flex row-space-between-center monospace maxwidth no-basis grow ptb1 wrap make-column">
					<h1 class="flex maxw8em row-flex-start-center overflow-hidden rel">
						<a 
							on:click={e => ($smoothing = 0.9)}
							href="#">
							<img src="vidicon.svg" class="w100pc" />
							<span class="abs invisible">VIDICON</span>
						</a>
					</h1>

					<nav class="flex no-basis row-flex-start-center maxwidth f3 monospace ptb1 z-index99 make-row">
						{#each ($data?.nav || []) as link, idx}
							<a 
								class="unclickable block whitespace-nowrap mtb0-5"
								target={link?.url?.[0] == '#' ? '' : '_blank'}
								href={link?.url}>{link?.title}</a>
							<span class="block p0-2 mlr0-5 filled radius1em" />
						{/each}
						<div 
							class="pointer clickable b2-solid plr1"f
							class:filled={$chat}
							on:click={onToggleChat}>{_CHAT}</div>
							<!-- https://go.rocket.chat/room?host=<chat.server> -->
					</nav>
				</header>
				<article class="flex grow row-center-center" >

					<div 
						class="flex flex row-center-center relative b0-solid" >
						<canvas 
							width={1280} 
							height={720} 
							class="w100pc invisible maxwidth" />
						<div 
							on:mousedown={ e => ($state.mousedown = true)}
							on:mouseup={ e => ($state.mousedown = false)}
							class="cube fill flex relative grabbable">
							<Cube {components} />
						</div>
					</div>
				</article>

				<footer class="flex no-basis grow row-space-between-center maxwidth f3 monospace  z-index99 wrap ptb0-5 make-column make-reverse">
					<div class="flex ptb0-5 row-flex-start-center wrap make-row">
						{#each [...($data?.stations || []), { id: _PLAY, title: _PLAY}] as link, idx}
							{#if idx != 0}
								<span class="block p0-2 mlr0-5 filled radius1em" />
							{/if}
							<a 
								on:click={e => ($smoothing = 0)}
								class="unclickable block whitespace-nowrap"
								class:bb4-solid={$index == idx}
								href={'#'+link?.id}>{link?.title}</a>
						{/each}
						<!-- <a 
							on:click={e => ($smoothing = 0)}
							class="unclickable whitespace-nowrap"
							class:bb2-solid={$index == 5}
							href="#{_PLAY}">{_PLAY}</a> -->
					</div>
					<span class="w2em h0em block" />
					<div class="flex ptb0-5 row">
						{LIVE}
					</div>
				</footer>
			</div>
		</div>

	{/if}

	{#if $chat || $index == 6}
		<div 
			class:maxw56em={ $index < 6 }
			class:bl2-solid={ $index < 6 }
			class="flex grow column" 
			style="transform: skew(0deg, -0deg)">
			<Chat>

				<div 
					class="flex row-center-center">
					<div
						class:none={ $index >= 6 }
						on:click={onOpenChat}
						class="pointer">
						<svg 
						class="w2em overflow-hidden h3em rel t0-2 ml1"
						xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" height="356.58914728682174" viewBox="0, 0, 400,356.58914728682174"><g id="svgg"><path id="path0" d="M265.116 20.547 C 265.116 20.763,272.640 28.462,281.835 37.657 L 298.553 54.376 248.501 104.707 C 220.973 132.389,198.450 155.312,198.450 155.646 C 198.450 156.682,224.636 182.171,225.700 182.171 C 226.253 182.171,249.048 159.845,276.357 132.558 C 303.665 105.271,326.259 82.946,326.566 82.946 C 326.872 82.946,334.623 90.446,343.790 99.612 C 352.956 108.779,360.633 116.279,360.848 116.279 C 361.064 116.279,361.240 94.651,361.240 68.217 L 361.240 20.155 313.178 20.155 C 286.744 20.155,265.116 20.331,265.116 20.547 M51.163 194.574 L 51.163 330.233 186.822 330.233 L 322.481 330.233 322.481 252.713 L 322.481 175.194 303.101 175.194 L 283.721 175.194 283.721 233.333 L 283.721 291.473 186.822 291.473 L 89.922 291.473 89.922 194.574 L 89.922 97.674 148.062 97.674 L 206.202 97.674 206.202 78.295 L 206.202 58.915 128.682 58.915 L 51.163 58.915 51.163 194.574 " stroke="none" fill="var(--color)" fill-rule="evenodd"></path></g></svg>
					</div>
					<img
						class:none={ $index < 6 }
						src="vidicon.svg" 
						class="maxw6em minw6em ml1 w100pc h100pc" />
				</div>
			</Chat>
		</div>
	{/if}

</main>


