<script>
	import { data, chat } from './Store.js'

	export let idx = 0

	$: stations = $data?.stations || []

</script>

<div class="flex column h100pc" style="background:#1f2329">
	<div class="flex grow p0-5 rel overflow-hidden" >
		<section class="flex grow rel">

			{#if stations?.[idx]?.chat}
				<iframe 
					class="abs w100pc h100pc b0 l0"
					style="height:calc(100% + 120px);top:auto;bottom:0"
					src="https://chat.scanlines.xyz/channel/{stations?.[idx]?.chat}?layout=embedded" />
			{/if}

		</section>
	</div>
	<nav class="flex row-space-between-center f2 monospace uppercase p1 bt2-solid">
		<div class="flex row-center-center">
			{#each stations as station, i}
				<span 
					class:none={i==0}
					class="block p0-2 mlr0-5 filled radius1em" />
				<div 
					on:click={ e => (idx = i)}
					class:bb4-solid={i == idx}
					class="pointer block whitespace-nowrap">
					{station.title}
				</div>
			{/each}
		</div>
		<slot />
	</nav>
</div>