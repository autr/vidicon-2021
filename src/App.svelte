<script>
	import { onMount } from 'svelte'
	import { FetchData } from './API.js'
	import Cube from './Cube.svelte'
	import { index, state, data } from './Store.js'
	export let name;

	onMount( async e => {
		data.set( await FetchData() )
		console.log('[App] mounted', $data)
		console.log($data)
		$state.data = true
		onHash()
	})

	function onHash( e ) {
		let id = window.location.hash.substring(1)
		let st = [...$data.stations.map(s=>s.id),'JOIN']
		let idx = st.indexOf(id)
		if (idx < 0) idx = 0
		index.set(idx)
	}

</script>
<svelte:window on:hashchange={onHash} />
<main class="sassis flex column-center-stretch w100vw h100vh">
	<div class="flex column-stretch-center maxwidth p1 grow">
		<header class="flex row-space-between-center monospace maxwidth no-basis grow p1">
			<h1>VIDICON</h1>
			<nav>

			</nav>
		</header>
		<article class="flex grow row-center-center" >
			<div class="flex flex row-center-center relative" >
				<canvas 
					width={1280} 
					height={720} 
					class="w100pc invisible maxwidth" />
				<div class="fill sink flex relative">
					<!-- <canvas 
						width={1}
						height={1}
						class="h100pc" /> -->
					<Cube />
				</div>
			</div>
		</article>
		<nav class="flex no-basis grow row-space-between-center maxwidth f3 monospace p1 z-index99">
			<div class="flex row-flex-start-center">
				{#each ($data?.stations || []) as link}
					<a 
						href={'#'+link.id}>{link.title}</a>
					<span class="block p0-2 mlr0-5 filled radius1em" />
				{/each}
				<a href="#JOIN">JOIN</a>
			</div>
		</nav>
	</div>
</main>

