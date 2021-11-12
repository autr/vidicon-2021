<script>
	import { index, state, smoothing, trigger, volume, chat } from './Store.js'
	import { onMount } from 'svelte'
	import { pan } from 'svelte-hammer'
	import { tweened } from 'svelte/motion'
	import { cubicOut, cubicIn } from 'svelte/easing'




	let DEBUG = window.location.search == '?debug'



	export let backspace = true
	export let spin = false
	export let components = []

	let rotation = {x:0,y:0,z:0}
	let current = {x:180,y:0,z:0}
	let origin = {...current}
	let destination = {...current}
	let el, width, height // element dimensions
	let zoomX = 2
	let zoomY = 1
	let zoomZ = 1
	let isTweening = false
	let isPanning = false

	const HORIZONTAL = 'horizontal'
	const VERTICAL = 'vertical'
	const BOTH = 'both'
	const SIDEWAYS = 'sideways'


	let DIMIT

	onMount( e => {
		onResize()
		window.requestAnimationFrame(tick)
		current.x += parseInt(Math.random() * 4) * 90
		// current.y = 45
	})

	function clamp( v, min, max ) {
		if (v < min) return min
		if (v > max) return max
		return v
	}

	$: (_chat => {
		onResize()
	})($chat)


	function same( a, b ) {
		return Math.abs(a.x).toFixed(1) == Math.abs(b.x).toFixed(1) && Math.abs(a.y).toFixed(1) == Math.abs(b.y).toFixed(1)
	}

	function blend( a, b, sm ) {
		return (a * sm) + (b * (1-sm))
	}

	let lastIndex = -2
	let lastWasBox = false

	$: (_index => {

		if (!$state.inited || (lastIndex == $index ) ) return

		// SPIN!!!!

		$state.isTweening = isTweening = true

		let save = current.x
		// 45 - 225
		current.x = normalise(current.x, 360)
		destination.x = normalise(destination.x, 360)

		origin.x = destination.x
		origin.y = destination.y

		let top = { 5: 90, 0: -90 }
		if (current.x > 45 && current.x < 225) top = { 5: -90, 0: 90 }

		let x = !top[$index] && $index != -1 ? ($index-1) * 90 : destination.x
		let y = top[$index] || 0


		if (destination.x == 0 && x == 270) {
			x = -90
			current.x = normalise(current.x, 180)
		}
		if (destination.x == 270 && x == 0) {
			x = 360
			current.x = normalise(current.x, 360)
		}

		if (x == 0 && current.x > 180) current.x = normalise(current.x, 180)
		if (x == 360 && current.x < 180) current.x += 360


		destination.x = x
		destination.y = y


		if (!$state.cubeInited) {
			current.x = destination.x
			current.y = destination.y
			$state.cubeInited = true
		}

		// -90

		if (destination.x == 180 && destination.y == -90 && $index == 0) {
			destination.y += 180
		} else if (destination.x == 180 && destination.y == 90 && $index == 5) {
			destination.y -= 180
		}
		// if ($index == -1) {
		// 	console.log(save, current.x, '???')
		// 	current.x = save
		// }

		lastWasBox = $index == -1


		lastIndex = $index
		$state.panend = false
	})($index)


	function getIndex( xy ) {

		let x = normalise(xy.x + 45,360)
		x -= x%90
		x /= 90

		let y = normalise(xy.y + 45,360)
		y -= y%90
		y /= 90

		let top = { 1: 5, 3: 0 }
		return (y != 0) ? top[y] : x + 1

	}

	const isEnds = idx => (idx == 5 || idx == 0)
	$: ends = isEnds($index)

	function tick() {


		// SPIN

		if ($index < 0) {
			zoomX = blend(zoomX, 1.5, $smoothing)
			zoomY = blend(zoomY, 1.5, $smoothing)
			zoomZ = blend(zoomZ, 1, $smoothing)
			let sp = 0.03
			if (!isPanning) current.x = (Math.sin(new Date() * 0.0004) * 20) + 180
			if (!isPanning) current.y = (Math.sin(new Date() * 0.0003) * 10)
			// current.y -= sp * 1
			return window.requestAnimationFrame( tick )
			
		}

		// MAIN

		let x = Math.abs(normalise(origin.x,180) - normalise(current.x,180))
		let y = Math.abs(normalise(origin.y,180) - normalise(current.y,180))
		let combi = (x+y)%360

		// if (combi > 315) combi = Math.abs(combi - 360)

		if (combi <= 45) {
			let zx = clamp(scale(x,0,45,1,2),1,2)
			let zy = clamp(scale(y,0,45,1,2),1,2)
			let zz = 2 - clamp(scale(combi,0,45,0,1),0,1)

			if (zx != zoomX ) zoomX = zx
			if (zy != zoomY && zy > zoomY ) zoomY = zy
			if (zz != zoomZ ) zoomZ = ends ? zz : 1
		}

		if (isPanning) {


		} else {

			if (!spin && destination && isTweening) {

				let sm = $smoothing

				let x = blend(current.x, destination.x,  sm)
				let y = blend(current.y, destination.y,  sm)
				let z = blend(current.y, destination.z,  sm)

				let destX = 1
				let destY = 1
				let destZ = ends ? 2 : 1

				zoomX = blend(zoomX, destX, sm)
				zoomY = blend(zoomY, destY, sm)
				zoomZ = blend(zoomZ, destZ, sm)

				if (current.x != x) current.x = x
				if (current.y != y) current.y = y
				if (current.z != y) current.z = z

				if (same(current,destination)) {

					current.x = Math.round(x)
					current.y = Math.round(y)
					current.z = Math.round(z)

					zoomX = destX
					zoomY = destY
					zoomZ = destZ

					current.x = normalise(current.x,360)


					console.log(`[Cube] 🧊 TWEEN FINISHED: triggering ${$index}`)

					trigger.set($index)

					isTweening = false
					volume.set(1)
				}
			}

		}
		window.requestAnimationFrame(tick)
	}

	let vertMore, vertLess, vertPrev, _vertMore, _vertLess

	function onPanstart(e) {
		// console.log('[Cube] 🧊  panstart')

		origin.x = normalise(destination.x,360)
		origin.y = destination.y

		let {deltaX, deltaY} = e.detail



		$state.direction = (Math.abs(deltaX) > Math.abs(deltaY)) ? HORIZONTAL : VERTICAL
		if ($index == 0 || $index == 5) $state.direction = VERTICAL
		$state.direction = BOTH
		DIMIT = ($index == 0 || $index == 5) ? 0.5 : 1
		// if ($index < 0) $state.direction = BOTH

		$state.isPanning = isPanning = true
		width = el.offsetWidth
		height = el.offsetHeight
		rotation.x = current.x
		rotation.y = current.y
	}
		

	function onPanmove(e) {
		// console.log('[Cube] 🧊  panmove')


		let {deltaX, deltaY} = e.detail
		let speed = 2

		let x = (deltaX * speed * 1.5) / width
		let y = (Math.round(deltaY) * speed * 0.8 ) / height

		// invert

		if (destination.x >= 90 && destination.x <= 180) y *= -1

		// HORIZONTAL

		if ($state.direction == HORIZONTAL || $state.direction == BOTH ) {
			current.x = (rotation.x + (90 * x))%360
		}

		// VERTICAL

		if ($state.direction == VERTICAL || $state.direction == BOTH ) {
			current.y = (rotation.y - (90 * y))%360

			// BOUNCE...

			// if (current.y > 90) current.y -= ((current.y - 90) * (Math.abs(deltaY) * 0.005))
			// if (current.y < -90) current.y -= ((current.y + 90) * (Math.abs(deltaY) * 0.005))
		}

		if ($state.direction == BOTH) {
			current.x = normalise(current.x,180)
			current.y = normalise(current.y,180)
		}

	}

	function normalise( value, angle ) {
		if (value < 360 - angle) value += 360
		if (value >= angle) value -= 360
		return value
	}

	function onPanend(e) {

		// console.log('[Cube] 🧊  panend')

		if (origin.x == -destination.x) destination.x += 360
		if (origin.y == -destination.y) destination.y += 360

		current.x = normalise(current.x,180)
		current.y = normalise(current.y,180)


		destination.x = normalise(destination.x,180)
		destination.y = normalise(destination.y,180)


		$state.panend = true

		let normX = normalise(current.x + 45, 360)
		let xIndex = (( normX - (normX%90) ) / 90) + 1


		// if ($index < 0) {

		// 	$index = 0

		// } else {

			let normY = normalise(current.y + 45,360)
			let adj = scale(normY - (normY%90),90,270,-1,1)
			// if ( xIndex == 1 || xIndex == 2) adj *= -1

			$index = xIndex


			let TOPS = undefined
			if (xIndex == 1) adj *= -1
			if (xIndex == 4) adj *= -1
			if (adj == 1) TOPS = 5
			if (adj == -1) TOPS = 0

			if (TOPS !== undefined) $index = TOPS

			// 2
			// 3

		// }

		$smoothing = 0.9
		$state.isTweening = isTweening = true
		$state.isPanning = isPanning = false

		volume.set(1)

		
	}

	$: o = {
		_w: width/-2,
		w: width/2,
		_h: height/-2,
		h: height/2
	}

	$: container = `perspective: ${perspective}px`

	$: xyz = {
		x: current.x,
		y: (current.y * (1-modX)) || 0,
		z: (-current.y * modX) || 0
	}
	$: box = `
		transform-style: preserve-3d;
		transform: 
			rotateY(${xyz.x}deg)
			rotateX(${xyz.y}deg)
			rotateZ(${xyz.z}deg)
			translate3d(0, 0, 0);
		backface-visibility: ${backspace?'visible':'hidden'}`

	$: resizeStyle = `height:${width}px;margin-top:-${(width-height)/2}px`
	$: rotateStyle = (i => (  (i == 0 ) ?  `rotateZ(${current.x}deg)` : (i == 5) ? `rotateZ(-${normalise(current.x,360)}deg)` : '' ))

	$: faces = [
		`${resizeStyle};transform: rotateX(90deg) translate3d(0, 0, ${o.h}px)`,
		`transform: translate3d(0, 0, ${o.w}px)`,
		`transform: rotateY(-90deg) translate3d(0, 0, ${o.w}px)`,
		`transform: translate3d(0, 0, ${o._w}px) rotateY(180deg)`,
		`transform: rotateY(90deg) translate3d(0, 0, ${o.w}px)`,
		`${resizeStyle};transform: rotateX(-90deg) translate3d(0, 0, ${o.h}px)`,
	]

	function scale(num, in_min, in_max, out_min, out_max, clamp) {
		if (clamp == undefined) clamp = false;
		const o = (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		return o
	}

	$: modX = (scale(Math.abs((Math.abs(current.x)%180)-90),0,45,1,0)+1)/2
	$: modY = (scale(Math.abs((Math.abs(current.y)%180)-90),0,45,1,0)+1)/2

	$: zoom = scale(width,500,1000,0.75,0.5) + ((zoomX - 1)*-0.08) + ((zoomY - 1)*-0.06)  + ((zoomZ - 1) * zoomRatio) 
	$: zoomRatio = (width / 1000) * (2 - (width/height))

	$: perspective = parseInt(1000 + ((zoomX - 1)*600) + ((zoomY - 1)*600))
	//9999999 !!!


	$: squish = (zoom * (1-modY)) + ((zoom * (height/width)) * modY)

	async function onResize(e) {
		width = el.offsetWidth
		height = el.offsetHeight
		console.log(`[Cube] 📐 width and height ${width} ${height}`)
	}

	$: (_modX => {
		if (isTweening || isPanning) {
			volume.set( ($index == 1 || $index == 3) ? 1 - modX : modX)
		}
	})(modX)


							// style={`
							// 	${ isEnds(i) ? `
							// 	transform: 
							// 		scale(1, ${width/height});` 
							// 	: ``}
							// `}
							// style={`
							// 	${ isEnds(i) ? `
							// 	transform: 
							// 		rotateX(${i==0?`180deg`:'0deg'})
							// 		rotateZ(${current.x}deg)
							// 		scale(1, ${width/height});` 
							// 	: ``}
							// `}
</script>
{#if DEBUG}
	<span class="fixed r0 t0 z-index9 r0 flex column filled p1 monospace">
		<span>index:{$index}</span>
		<span>current.x:{current.x.toFixed(2)}</span>
		<span>current.y:{current.y.toFixed(2)}</span>
		<span>current.z:{current.z.toFixed(2)}</span>
		<span>destination.x:{destination.x.toFixed(2)}</span>
		<span>destination.y:{destination.y.toFixed(2)}</span>
		<span>destination.z:{destination.z.toFixed(2)}</span>
		<span>origin.x:{origin.x.toFixed(2)}</span>
		<span>origin.y:{origin.y.toFixed(2)}</span>
		<span>origin.z:{origin.z.toFixed(2)}</span>
		<span>xyz.x:{xyz.x.toFixed(2)}</span>
		<span>xyz.y:{xyz.y.toFixed(2)}</span>
		<span>xyz.z:{xyz.z.toFixed(2)}</span>
		<span>modX:{modX.toFixed(2)}</span>
		<span>modY:{modY.toFixed(2)}</span>
		<span>width:{parseInt(width)}</span>
		<span>height:{parseInt(height)}</span>
		<span>index:{$index}</span>
		<span>zoom:{zoom.toFixed(2)}</span>
		<span>perspective:{parseInt(perspective)}</span>
		<span>zoomX:{zoomX.toFixed(2)}</span>
		<span>zoomY:{zoomY.toFixed(2)}</span>
		<span>zoomZ:{zoomZ.toFixed(2)}</span>
		<span>zoomRatio:{zoomRatio.toFixed(2)}</span>
	</span>
{/if}
<!-- <span
	id="dragger"
	use:pan={{direction: Hammer.DIRECTION_ALL}}
	on:panstart={onPanstart}
	on:panmove={onPanmove}
	on:panend={onPanend}
	class="fill block z-index99" /> -->
<svelte:window
	on:resize={onResize}
	use:pan={{direction: Hammer.DIRECTION_ALL}}
	on:panstart={onPanstart}
	on:panmove={onPanmove}
	on:panend={onPanend} />
<!-- <span class="filled fixed t0 r0 p1">{$index}</span> -->

<!-- <div class="abs b3 mb3 w100pc flex row-center-center">
<svg class="w4em" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 485 485" style="enable-background:new 0 0 485 485;" xml:space="preserve">
	<path fill="var(--color)" d="M382.5,69.429c-7.441,0-14.5,1.646-20.852,4.573c-4.309-23.218-24.7-40.859-49.148-40.859
		c-7.68,0-14.958,1.744-21.467,4.852C285.641,16.205,265.932,0,242.5,0c-23.432,0-43.141,16.206-48.533,37.995
		c-6.508-3.107-13.787-4.852-21.467-4.852c-27.57,0-50,22.43-50,50v122.222c-6.129-2.686-12.891-4.187-20-4.187
		c-27.57,0-50,22.43-50,50V354c0,72.233,58.766,131,131,131h118c72.233,0,131-58.767,131-131V119.429
		C432.5,91.858,410.07,69.429,382.5,69.429z M402.5,354c0,55.691-45.309,101-101,101h-118c-55.691,0-101-45.309-101-101V251.178
		c0-11.028,8.972-20,20-20s20,8.972,20,20v80h30V83.143c0-11.028,8.972-20,20-20s20,8.972,20,20v158.035h30V50
		c0-11.028,8.972-20,20-20c11.028,0,20,8.972,20,20v191.178h30V83.143c0-11.028,8.972-20,20-20s20,8.972,20,20v158.035h30v-121.75
		c0-11.028,8.972-20,20-20s20,8.972,20,20V354z"/>
</div> -->

<div 
	class="zoom fill" 
	class:invisible={!$state.cubeInited}
	style="transform: scale({zoom}, {squish});transform-origin: 50% 50%">
	<div 
		style={container}
		bind:this={el}
		class="container fill rel">
		<div 
			style={box}
			class="box h100pc rel">
			<!-- <div class="face-extra fill flex b2-solid" -->
			{#each (new Array(6)) as n, i }
				<div 
					style={faces[i]} 
					class:none={i != $index}
					class:b8-solid={$state.mousedown}
					class:b4-solid={!$state.mousedown}
					class="face fill flex row-center-center fuzz" />
				<div 
					style={faces[i] + rotateStyle(i) }
					class="face fill flex row-center-center">
						<div
							class="inner monospace flex fill column-center-center rel">
							{#if components[i]}
								<svelte:component 
									this={components[i]} 
									idx={i} 
									stretch={isEnds(i)}
									{width} 
									{height} />
							{:else}
								<div class="flex column-center-center">
									<h1 class="filled plr1">COMPONENT {i}</h1>
									<div class="filled plr1">HELLO WORLD</div>
									<img src="data/demo{i+1}.png" class="w30pc" />
								</div>
							{/if}
						</div>
				</div>
			{/each}
		</div>
	</div>
</div>



						<!-- <div class="flex row-center-center">

						</div> -->
						<!-- <img src="data/demo{i+1}.png" class="fill z-index8" /> -->
						<!-- {#each ['row','column'] as type}
							<span class="fill flex {type}">
								{#each (new Array(3)) as n, i }
									<span class="flex grow b1-solid " />
								{/each}
							</span>
						{/each}
						{#if i == 5}
							<div class="fill bg">
								<div class="w70pc h70pc flex row-center-center radius100pc">
									<div class="w70pc h70pc flex row-center-center b4-solid radius100pc">
										<div class="w70pc h70pc flex row-center-center b4-solid radius100pc">
											<div class="w70pc h70pc flex row-center-center b4-solid radius100pc">
											</div>
										</div>
									</div>
								</div>
							</div>
						{/if} -->