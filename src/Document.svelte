<script>
	import { onMount } from 'svelte'
	import { All } from 'rad-and-cool-icons'
	import { data, index, state, trigger } from './Store.js'

	export let idx 
	export let width
	export let height
	export let stretch

	$: body = $data?.play || ''


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
		class="flex column-center-center grow"
		class:b2-solid={!stretch}
		style="height:{height}px;transform:scale(1,{stretch ? width/height : 1});">
		<div 
			class:none={idx != $index}
			class="flex column-center-center z-index99 markdown">
			{@html body}
		</div>
		<div 
			class:none={idx == $index}
			class="flex row-center-center z-index99">
			<h1 
				class="filled plr1 ptb0" 
				style="font-size:6em">
				PLAY
			</h1>
		</div>
	</div>
</section>