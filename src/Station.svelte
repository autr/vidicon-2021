<script>
	import { onMount } from 'svelte'
	import { All } from 'rad-and-cool-icons'
	import { data, index, state, trigger } from './Store.js'

	export let idx 
	export let width
	export let height
	export let stretch


	let VIDEO_JS = false // DEBUG

	let ready = false
	let MESSAGE = ''
	let TIMEOUT
	let _LOADING = 'loading'
	let _PLAYING = 'playing'
	let _PAUSED = 'paused'
	let STATUS = _PLAYING

	const SRC = 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'

	$: station = $data?.stations?.[idx]
	$: id = station?.id || 'no-id'
	$: title = station?.title || 'No title'
	$: src = station?.src || SRC
	$: poster = station?.poster || `data/demo${idx+1}.png`
	$: live = $data?.live?.[id]

	let el, player

	let status = _LOADING

	let events = {
		[_PLAYING]: [_PLAYING],
		[_PAUSED]: ['canplay','canplaythrough','pause','canplay'],
		[_LOADING]: ['loadstart','waiting'],
		message: ['error', 'abort', 'emptied', 'suspend','ended'],
		misc: ['progress', 'loadedmetadata', 'stalled','seeking','loadeddata','seeked','durationchange','timeupdate', 'play', 'pause',
'ratechange', 'resize', 'volumechange']
	}


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

						if (TIMEOUT) clearTimeout( TIMEOUT )

						if (type != 'misc') status = type
						if (type != 'misc') console.log(`[Station] ⏱ ${id} ${type}:${event}`, e)
						if (type == _PAUSED || type == _PLAYING) status = player.paused() ? _PAUSED : _PLAYING

						TIMEOUT = setTimeout( e => {
							// STATUS = status
							let messages = {
								error: 'There was an error',
								abort: 'Player was aborted',
								suspend: 'Player was suspended',
								ended: 'Stream was ended'
							}
							MESSAGE = messages[event]
							if (type == _PAUSED || type == _PLAYING) {
								STATUS = player.paused() ? _PAUSED : null
								MESSAGE = null
							}

						}, 100)
					})
				}
			}
		})
	}

	let lastIndex = -2


	$: (async _trigger => {

		if (!VIDEO_JS) return

		if (!$state.data || !$state.inited) return
		if ($trigger == idx) {
			if (STATUS == _LOADING) STATUS = _PLAYING
			if (!player) {
				console.log(`[Station] 📀 🌴 initing ${id}`)
				await init()
			}
			if (player.paused() && ready && STATUS == _PLAYING ) {
				console.log(`[Station] 📀 🌿 playing ${id}`)
				try {
					const res = await player.play()
				} catch(err) {
					console.log(`[Station] 📀 ❌ ${id} ${err.message}`)
					await player.pause()
				}
			}
		} else {
			if (player) {
				console.log(`[Station] 📀 🛑 pausing ${id}`)
				STATUS = _PAUSED
				await player.pause()
			}
		}
		setTimeout( e=> {
			if (!player) return
			if (!player.paused()&& (status != _PLAYING || STATUS != _PLAYING)) {
				status = _PLAYING
				STATUS = null
			}
		}, 100)

	})($trigger)

	$: (async _index => {

		if (!VIDEO_JS) return

		if (!$state.data) return
		if ($index == idx) {
			console.log(`[Station] 📀 👀 loading ${id}`)
			if (player) {
				status = STATUS = player.paused() ? _LOADING : _PLAYING
			} else {
				status = STATUS = _LOADING
			}
		} 
		lastIndex = $index
	})($index)

	let zoom = 1

	function onPlayPause( e ) {

		if (!VIDEO_JS) return

		const b = (status == _PLAYING)
		STATUS = b ? _PAUSED : _PLAYING
		b ? player.pause() : player.play()
	}


</script>
<section class="fill flex row-center-center ">
	<div 
		class="flex column-stretch-center grow"
		class:b2-solid={!stretch}
		style="height:{height}px;transform:scale(1,{stretch ? width/height : 1});">
		<div 
			class:none={idx != $index}
			class="flex column-center-center z-index99">
			<div 
				on:click={onPlayPause}
				class="h120px cursor flex-column-space-between">
				<div 
					class:none={status == _LOADING}>
					<All 
						state={status == _PLAYING} 
						type="play-pause" 
						width={60} 
						 height={60} />
				</div>
				<span 
					class:none={ status != _LOADING }
					class="spin block w80px h80px p0-2 b6-dashed radius100pc rel flex row-flex-end-center">
				</span>
			</div>
			<span 
				class:hide={STATUS == _PLAYING}
				class="uppercase flex column-center-flex-start f3 h2em">
				<span>{MESSAGE || STATUS || ''}</span>
			</span>
			<span class="block pointer p2 abs r1 b0">
				<svg class="w2em h2em" height="14px" version="1.1" viewBox="0 0 14 14" width="14px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.vidicon.org" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><defs/><g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><g fill="var(--color)" transform="translate(-215.000000, -257.000000)"><g transform="translate(215.000000, 257.000000)"><path d="M2,9 L0,9 L0,14 L5,14 L5,12 L2,12 L2,9 L2,9 Z M0,5 L2,5 L2,2 L5,2 L5,0 L0,0 L0,5 L0,5 Z M12,12 L9,12 L9,14 L14,14 L14,9 L12,9 L12,12 L12,12 Z M9,0 L9,2 L12,2 L12,5 L14,5 L14,0 L9,0 L9,0 Z"/></g></g></g></svg>
			</span>
		</div>
		<div 
			class:none={status==_PLAYING || idx == $index}
			class="flex row-center-center z-index99">
			<h1 
				class="filled plr1 ptb0" 
				style="font-size:6em">
				{title}
			</h1>
		</div>
		<div 
			class="fill flex column-center-center b4-solid" 
			style="transition: transform 0s ease; background:blue;transform: scale(1, {idx != $index? 0 : 1}" />
		<div 
			class="fill"
			class:block={status==_PLAYING}
			class:none={status!=_PLAYING}>
			{#if VIDEO_JS}
				<video
					bind:this={el}
					class="videojs fill invert bg">
						<source {src} type="application/x-mpegURL" />
				</video>
			{/if}
		</div>
	</div>
</section>