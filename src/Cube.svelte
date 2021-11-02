<script>
	import { index, state, smoothing, trigger } from './Store.js'
	import { onMount } from 'svelte'
	import { pan } from 'svelte-hammer'
	import { tweened } from 'svelte/motion'
	import { cubicOut, cubicIn } from 'svelte/easing'

	export let backspace = false
	export let spin = false

	export let components = []

	let rotation = {x:0,y:0,z:0}
	let current = {x:0,y:0,z:0}
	let origin = {...current}
	let destination = {...current}
	let el, width, height // element dimensions
	let zoomX = 1
	let zoomY = 1
	let zoomZ = 1
	let isTweening = false

	const HORIZONTAL = 'horizontal'
	const VERTICAL = 'vertical'
	const BOTH = 'voth'

	let DEBUG = false


	onMount( e => {
		onResize()
		window.requestAnimationFrame(tick)
	})

	function clamp( v, min, max ) {
		if (v < min) return min
		if (v > max) return max
		return v
	}


	function same( a, b ) {
		return Math.abs(a.x).toFixed(1) == Math.abs(b.x).toFixed(1) && Math.abs(a.y).toFixed(1) == Math.abs(b.y).toFixed(1)
	}

	function blend( a, b, sm ) {
		return (a * sm) + (b * (1-sm))
	}

	let lastIndex = -2

	$: (_index => {

		if (!$state.inited || (lastIndex == $index && !$state.panend) ) return

		$smoothing = $state.panning ? 0.9 : 0.92
		isTweening = true

		// 45 - 225
		current.x = normalise(current.x, 360)
		destination.x = normalise(destination.x, 360)

		origin.x = destination.x
		origin.y = destination.y

		let top = { 5: 90, 0: -90 }
		if (current.x > 45 && current.x < 225) {
			top = { 5: -90, 0: 90 }
			console.log('SWAPPED')
		}

		let x = !top[$index] ? ($index-1) * 90 : destination.x
		let y = top[$index] || 0

		// console.log('A', current.x, destination.x, x)

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

		// console.log('B', current.x, destination.x, x)


		destination.x = x
		destination.y = y

		if (!$state.cubeInited) {
			current.x = destination.x
			current.y = destination.y
			$state.cubeInited = true
		}

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

		let x = Math.abs(origin.x - current.x)
		let y = Math.abs(origin.y - current.y)
		let combi = x+y

		if (combi <= 45) {
			let zx = clamp(scale(x,0,45,1,2),1,2)
			let zy = clamp(scale(y,0,45,1,2),1,2)
			let zz = 2 - clamp(scale(combi,0,45,0,1),0,1)

			if (zx != zoomX ) zoomX = zx
			if (zy != zoomY && zy > zoomY ) zoomY = zy
			if (zz != zoomZ ) zoomZ = ends ? zz : 1
		}

		if ($state.panning) {


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

		$state.panning = true
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
		let y = (deltaY * speed * 1) / height

		if (destination.x >= 90 && destination.x <= 180) y *= -1

		// HORIZONTAL

		if ($state.direction == HORIZONTAL) {
			current.x = (rotation.x + (90 * x))%360
		}

		// VERTICAL

		if ($state.direction == VERTICAL) {
			current.y = (rotation.y - (90 * y))%360

			// BOUNCE...

			if (current.y > 90) current.y -= ((current.y - 90) * (Math.abs(deltaY) * 0.005))
			if (current.y < -90) current.y -= ((current.y + 90) * (Math.abs(deltaY) * 0.005))
		}

		console.log( normalise(current.x, 360) )
	}

	function normalise( value, angle ) {
		if (value < 360 - angle) value += 360
		if (value > angle) value -= 360
		return value
	}

	function onPanend(e) {

		// console.log('[Cube] 🧊  panend')

		$state.panend = true

		let normX = normalise(current.x + 45, 360)
		let xIndex = (( normX - (normX%90) ) / 90) + 1


		if ($state.direction == HORIZONTAL) {

			$index = xIndex

		} else {

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

			console.log( 'A ---------->', xIndex, TOPS, $index)
			console.log( 'B ---------->', xIndex, current)
			console.log( 'C ---------->', xIndex, destination)

			// 2
			// 3

		}

		$smoothing = 0.9
		isTweening = true
		$state.panning = false

		
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

	$: zoom = scale(width,500,1000,0.75,0.5) + ((zoomX - 1)*-0.1) + ((zoomY - 1)*-0.1)  + ((zoomZ - 1)*zoomRatio) 
	$: zoomRatio = (width / 1000) * (2 - (width/height))

	$: perspective = 1000 + ((zoomX - 1)*1000) + ((zoomY - 1)*1000) 
	//9999999 !!!


	$: squish = (zoom * (1-modY)) + ((zoom * (height/width)) * modY)

	async function onResize(e) {
		width = el.offsetWidth
		height = el.offsetHeight
		console.log(`[Cube] 📐 width and height ${width} ${height}`)
	}


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
	<span class="fixed r0 t0 z-index9 r0 flex column f2">
		<h1>{$index}</h1>
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
		<span>zoomX:{zoomX.toFixed(2)}</span>
		<span>zoomY:{zoomY.toFixed(2)}</span>
		<span>zoomZ:{zoomZ.toFixed(2)}</span>
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
<span class="filled fixed t0 r0 p1">{$index}</span>

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
				<!-- <span 
					style={faces[i]}
					class="borders fill flex b2-solid" /> -->
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
									<!-- <img src="data/demo{i+1}.png" class="w30pc" /> -->
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