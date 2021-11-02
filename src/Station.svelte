<script>
	import { onMount } from 'svelte'
	import { All } from 'rad-and-cool-icons'
	import { data, index, state, trigger } from './Store.js'

	export let idx 
	export let width
	export let height
	export let stretch

	let VIDEO_JS = true

	const SRC = 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'

	$: station = $data?.stations?.[idx]
	$: id = station?.id || 'no-id'
	$: title = station?.title || 'No title'
	$: src = station?.src || SRC
	$: poster = station?.poster || `data/demo${idx+1}.png`
	$: live = $data?.live?.[id]

	let el, player

	let status = 'waiting'

	let events = {
		playing: ['playing'],
		paused: ['canplay','ended','canplaythrough','pause'],
		waiting: ['loadstart','waiting','stalled','seeking'],
		message: ['error', 'abort', 'emptied', 'suspend'],
		misc: ['progress', 'loadedmetadata', 'loadeddata','seeked','durationchange','timeupdate', 'play', 'pause',
'ratechange', 'resize', 'volumechange']
	}

	let ready = false
	let STATUS = false

	onMount( async e => {
	})

	async function init() {

		if (!VIDEO_JS) return

		return new Promise( (resolve, reject) => {
			let w = window
			if (!w.players) w.players = {}

			console.log(`[Station] 📀 ${id} creating new player`)
			w.players[idx] = player = videojs(el, {
				controls: true,
				autoplay: false,
				autoload: false,
				loadingSpinner: false,
				preload: 'auto'
			}, e => {
				console.log(`[Station] 📀 ✅ ${id} player is ready ${src}`)
				ready = true
				resolve(e)
			})

			for (let [type,list] of Object.entries(events)) {
				for (let event of list) {
					player.on(event, e => {
						if (type != 'misc') status = type
						if (type != 'misc') console.log(`[Station] ⏱ ${id} ${type}:${event}`)
						if (type == 'paused') status = player.paused() ? type : 'playing'

						STATUS = status
					})
				}
			}
		})
	}

	let lastIndex = -2

	export async function play() {
		if (ready) {
			console.log(`[Station] 📀 🌿 ${id} play`)
			STATUS = 'waiting'

			if (!player) await init()
			try {
				const res = await player.play()
			} catch(err) {
				console.log(`[Station] 📀 ❌ ${id} ${err.message}`)
				await player.pause()
			}
		} else {
			console.log(`[Station] 📀 ❌ ${id} is not inited`)
		}
	}

	$: (async _trigger => {
		if (!$state.data || !$state.inited) return
		if ($trigger == idx) {
			console.log(`[Station] 📀 ✅ ${id} triggering play`)
			if (!player) await init()
			if (player.paused()) {
				await play()
			}
		} else {
			if (player) await player.pause()
		}

	})($trigger)

	$: (async _index => {
		if (!$state.data || lastIndex == $index) return
		if ($index == idx) {
			console.log(`[Station] 📀 ‼️ ${id} set to waiting ${$index}`)
			STATUS = 'waiting'
		} else {
			if (ready && !player.paused()) {
				await player.pause()
				console.log(`[Station] 📀 🛑 ${id} triggered pause from index ${$index}`)
			}

		}
		lastIndex = $index
	})($index)

	let zoom = 1


</script>
<section class="fill flex row-center-center ">
	<div 
		class="flex column-center-center grow"
		class:b2-solid={!stretch}
		style="height:{height}px;transform:scale(1,{stretch ? width/height : 1});">
		<div 
			class:none={idx != $index}
			class="flex row-center-center z-index99">
			<All state={STATUS == 'playing'} type="play-pause" width={40}  height={40} />

			<span class="spin block w60px h60px p0-2 b6-dashed radius100pc rel flex row-flex-end-center">
				<!-- <span class="block abs w25pc h25pc filled t5pc r5pc radius100pc" style="" /> -->
			</span>
		</div>
		<div 
			class:none={status=='playing' || idx == $index}
			class="flex row-center-center z-index99">
			<h1 class="filled f5 plr2 ptb1">{title}</h1>
		</div>
		<div 
			class="fill flex column-center-center b2-solid" 
			style="transition: transform 0s ease; background:blue;transform: scale(1, {idx != $index? 0 : 1}" />
		<div 
			class="fill"
			class:block={status=='playing'}
			class:none={status!='playing'}>
			<video
				bind:this={el}
				class="videojs fill invert bg">
					<source {src} type="application/x-mpegURL" />
			</video>
		</div>
	</div>
</section>