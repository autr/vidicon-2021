<script>
	import { onMount } from 'svelte'
	import { FetchData } from './API.js'
	import Cube from './Cube.svelte'
	import Station from './Station.svelte'
	import { index, state, data } from './Store.js'
	export let name;

	const PLAY = 'PLAY'

	onMount( async e => {
		data.set( await FetchData() )
		console.log('[App] mounted', $data)
		$state.data = true
		onHash()
	})

	function onHash( e ) {
		$state.inited = true
		if ($state.hash) return
		console.log('[App] 🔻  setting index from hash')
		let id = window.location.hash.substring(1)
		let st = [...$data.stations.map(s=>s.id),PLAY]
		let idx = st.indexOf(id)
		if (idx < 0) idx = 0
		index.set(idx)
	}

	let lastIndex = -2
	$: (_index => {
		if (!$state.inited || !$state.data || $state.hash || lastIndex == $index) return
		$state.hash = true
		console.log('[App] 🔺 setting hash from index')
		let id = ($index == 5) ? PLAY : $data?.stations?.[$index]?.id 
		window.location.hash = id || ''
		lastIndex = $index
		setTimeout( e => ($state.hash = false), 10)
	})($index)

	let components = [
		Station,
		Station,
		Station,
		Station,
		Station
	]

</script>
<svelte:window on:hashchange={onHash} />
<main class="sassis flex column-center-stretch w100vw h100vh plr1 overflow-auto">
	<div class="flex column-stretch-center maxwidth ptb1 grow w100pc">
		<header class="flex row-space-between-center monospace maxwidth no-basis grow p1 wrap">
			<h1 class="flex maxw8em">
				<a href="#">
					<img src="vidicon.svg" class="w100pc" />
					<span class="abs invisible">VIDICON</span>
				</a>
			</h1>

			<nav class="flex no-basis grow row-flex-end-center maxwidth f3 monospace ptb1 z-index99">
				{#each ($data?.stations || []) as link, idx}
					<a 
						class="flex"
						class:bb2-solid={$index == idx}
						href={'#'+link.id}>{link.title}</a>
					<span class="block p0-2 mlr0-5 filled radius1em" />
				{/each}
				<a 
					class:bb2-solid={$index == 5}
					href="#{PLAY}">{PLAY}</a>
			</nav>
		</header>
		<article class="flex grow row-center-center" >
			<div class="flex flex row-center-center relative b0-solid" >
				<canvas 
					width={1280} 
					height={720} 
					class="w100pc invisible maxwidth" />
				<div class="fill flex relative ">
					<Cube {components} />
				</div>
			</div>
		</article>
	</div>
</main>

