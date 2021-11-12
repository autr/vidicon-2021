<script>
	import { onMount } from 'svelte'
	import { data, index, state, trigger, play_text, live } from './Store.js'

	export let idx 
	export let width
	export let height
	export let stretch

	$: body = $data?.play || ''


	$: LIVE = ($live || []).find( l => (l.id == $play_text) )?.message || ''

	let lastIndex = -2

	$: (async _trigger => {
		if (!$state.data || !$state.inited) return
		if ($trigger == idx) {
		}

	})($trigger)

	$: (async _index => {
		if (!$state.data || lastIndex == $index) return
		lastIndex = $index
	})($index)



</script>
<section class="fill flex row-center-center ">
	<div 
		class="flex column-center-center grow maxw22em mobile-100 plr1 text-center"
		class:b2-solid={!stretch}
		style="height:{height}px;transform:scale(1,{stretch ? width/height : 1});">
		<div 
			class:none={idx != $index}
			class="flex column-center-center z-index99 markdown">
			{@html body}
		</div>
		<div 
			class:none={idx == $index}
			class="flex column-center-center z-index99">
			<h1 
				class="filled plr0-5 f5 ptb0">
				{$play_text}
			</h1>
			<div class="mobile-hide filled f5 plr1 ptb0-5">{LIVE}</div>
		</div>
	</div>
</section>