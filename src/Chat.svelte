<script>
	import { data, chat } from './Store.js'

	export let idx = 0

	let lookup = {

	}


	$: links = ( stations => {
		let a = [];
		(stations || []).forEach( s => {
			if (a.indexOf(s.chat) == -1) {
				a.push(s.chat)
				lookup[s.chat] = s.group
			}
		})
		return a
	})($data?.stations)

</script>

<div class="flex column h100pc minw32em" style="background:#1f2329">
	<div class="flex grow p0-5 rel overflow-hidden" >
		<section class="flex grow rel">

			{#if links?.[idx]}
				<iframe 
					class="abs w100pc h100pc b0 l0"
					style="height:calc(100% + 120px);top:auto;bottom:0"
					src="https://chat.scanlines.xyz/channel/{links?.[idx]}?layout=embedded" />
			{/if}

		</section>
	</div>
	<nav class="flex row-space-between-center f2 monospace uppercase p1 bt2-solid">
		<div class="flex row-center-center">
			{#each links as link, i}
				<span 
					class:none={i==0}
					class="block p0-2 mlr0-5 filled radius1em" />
				<div 
					on:click={ e => (idx = i)}
					class:bb4-solid={i == idx}
					class="pointer block whitespace-nowrap">
					{lookup[link]}
				</div>
			{/each}
		</div>
		<slot />
	</nav>
</div>