<script>
	import { index, state } from './Store.js'
	import { onMount } from 'svelte'
  import { pan } from 'svelte-hammer'
	import { tweened } from 'svelte/motion'
	import { cubicOut, cubicIn } from 'svelte/easing'

	let rotation = {x:0,y:0,z:0}
	let current = {x:0,y:0,z:0}
	let width, height
	let el
	let backspace = true
	let spin = false
	const stepback = tweened(0, {
		duration: 600,
		easing: cubicOut
	})


	onMount( e => {
		onResize()
		// setIndex()
		window.requestAnimationFrame(tick)
	})
	let destination
	let perspectiveDrift = 0
	let scaleDrift = 0

	function tick() {

		let drifted = false
		if (!$state.panning) {

			if (!spin && destination && $state.tweening) {

				let sm = 0.9
				let x = (destination.x * (1-sm)) + (current.x * sm)
				let y = (destination.y * (1-sm)) + (current.y * sm)
				let z = (destination.z * (1-sm)) + (current.z * sm)

				if (current.x != x) current.x = x
				if (current.y != y) current.y = y
				if (current.z != z) current.z = z

				if (current.x.toFixed(1) == destination.x.toFixed(1) && current.y.toFixed(1) == destination.y.toFixed(1) && current.z.toFixed(1) == destination.z.toFixed(1)) {
					current.x = Math.round(x)
					current.y = Math.round(y)
					current.z = Math.round(z)
					$state.tweening = false
				}
			}

		}
		window.requestAnimationFrame(tick)
	}


	function setIndex() {

		let look = {
			3: 1,
			4: 2,
			2: 4,
			1: 3
		}

		return 
		let idx = look[Math.round(scale(current.x,-180,180,0,360)/90)%4 + 1]

		if ( idx == 1 && xyz.y < -40 ) idx = 0
		if ( idx == 1 && xyz.y > 40 ) idx = 5

		if ( idx == 2 && xyz.z < -40 ) idx = 0
		if ( idx == 2 && xyz.z > 40 ) idx = 5

		if ( idx == 4 && xyz.z > 40 ) idx = 0
		if ( idx == 4 && xyz.z < -40 ) idx = 5

		if ( idx == 3 && xyz.y > 40 ) idx = 0
		if ( idx == 3 && xyz.y < -40 ) idx = 5

		index.set(idx)
	}

	function onPanstart(e) {
		console.log('[Cube] 🧊  panstart')

		console.log(e.detail)


		let {deltaX, deltaY} = e.detail

		$state.horizontal = (Math.abs(deltaX) > Math.abs(deltaY))

		$state.panning = true
		width = el.offsetWidth
		height = el.offsetHeight
		rotation.x = current.x
		rotation.y = current.y
		stepback.set(1000)
	}
		

	function onPanmove(e) {
		console.log('[Cube] 🧊  panmove')

		let {deltaX, deltaY} = e.detail
		let speed = 2

		let x = (deltaX * speed * 1.5) / width
		let y = (deltaY * speed) / height

		if ($index == 3 || $index == 2) {
			y *= -1
			console.log('INVERT', y)
		}

		if ($state.horizontal) current.x = (rotation.x + (90 * x))%360
		if (!$state.horizontal) current.y = (rotation.y - (90 * y))%360

		if ($state.horizontal && current.x < 0) current.x += 360
		// if (!$state.horizontal && current.y > 360) current.x -= 360

		setIndex()

	}

	function onPanend(e) {

		console.log('[Cube] 🧊  panend')


		if ($state.horizontal) {
			let mod = current.x%90
			destination = {...current, x: current.x - mod}
			if (mod > 45) destination.x += 90
			$index =  (destination.x/90) + 1 
		} else {

			let mod = current.y%90
			destination = {...current, y: current.y - mod}
			if (mod < -45) destination.y -= 90
			if (mod > 45) destination.y += 90

			if (current.y > 90 && current.y < 225) destination.y = 90
			if (current.y < -90 && current.y > 225) destination.y = -90

		}

		$state.tweening = true
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
		y: (current.y * (1-twist)) || 0,
		z: (-current.y * twist) || 0
	}
	$: box = `
		transform-style: preserve-3d;
		transform: 
			rotateY(${xyz.x}deg)
			rotateX(${xyz.y}deg)
			rotateZ(${xyz.z}deg)
			translate3d(0, 0, 0);
		backface-visibility: ${backspace?'visible':'hidden'}`
	$: faces = [
		`transform: rotateX(-90deg) translate3d(0, 0, ${o._h}px);`,
		`transform: translate3d(0, 0, ${o.w}px)`,
		`transform: rotateY(-90deg) translate3d(0, 0, ${o.w}px)`,
		`transform: translate3d(0, 0, ${o._w}px) rotateY(180deg)`,
		`transform: rotateY(90deg) translate3d(0, 0, ${o.w}px)`,
		`transform: rotateX(-90deg) translate3d(0, 0, ${o.h}px);`,
	]

	function scale(num, in_min, in_max, out_min, out_max, clamp) {
		if (clamp == undefined) clamp = false;
		const o = (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		return o
	}

	$: twist = (scale(Math.abs((Math.abs(current.x)%180)-90),0,45,1,0)+1)/2
	$: modulus = scale(Math.abs((Math.abs(current.x)%90)-45),0,45,1,0)
	$: zoom = scale(width,500,1000,0.75,0.5) + scaleDrift
	$: perspective = 1000 + (modulus*1000) + perspectiveDrift //$stepback
	//9999999 !!!
	$: plate = i => {
		if (i==0 || i == 5) return `
			height:${width}px;
			margin-top:-${(width-height)/2}px;`
		return ``
	}

	let only

	async function onResize(e) {
		width = el.offsetWidth
		height = el.offsetHeight
		console.log('WIDTH', width)
	}
</script>
<svelte:window on:resize={onResize} />
<span class="abs z-index9 r0 flex column f2">
	<h1>{$index}</h1>
	<span>xyz.x:{xyz.x.toFixed(2)}</span>
	<span>xyz.y:{xyz.y.toFixed(2)}</span>
	<span>xyz.z:{xyz.z.toFixed(2)}</span>
	<span>twist:{twist.toFixed(2)}</span>
	<span>modulus:{modulus.toFixed(2)}</span>
	<span>current:{parseInt(current.x)}/{parseInt(current.y)}</span>
	<span>wh:{parseInt(width)}/{parseInt(height)}</span>
	<span>index:{$index}</span>
	<span>zoom:{zoom.toFixed(2)}</span>
	<span>stepback:{stepback}</span>
</span>
<span
	id="dragger"
  use:pan={{direction: Hammer.DIRECTION_ALL}}
	on:panstart={onPanstart}
	on:panmove={onPanmove}
	on:panend={onPanend}
	class="fill block z-index99" />
<div class="zoom fill" 
	style="transform: scale({zoom});transform-origin: 50% 50%">
	<div 
		style={container}
		bind:this={el}
		class="container fill rel">
		<div 
			style={box}
			class="box h100pc rel">
			{#each (new Array(6)) as n, i }
				{#if (only != undefined && i == only) || only == undefined }
					<div 
						style={faces[i]}
						class="face fill flex row-center-center">
						<div 
							style={plate(i)}
							class="flex fill row-center-center b4-solid">
							<span class="f5">{i}</span>
							{#if i == 5}
								<div class="w70pc h70pc flex row-center-center b4-solid radius100pc">
								<div class="w70pc h70pc flex row-center-center b4-solid radius100pc">
								<div class="w70pc h70pc flex row-center-center b4-solid radius100pc">
								<div class="w70pc h70pc flex row-center-center b4-solid radius100pc">
								</div>
								</div>
								</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>