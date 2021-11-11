import { writable } from 'svelte/store'

export const xy = writable({x:0,y:0})
export const index = writable(-2)
export const smoothing = writable(0.9)
export const state = writable({})
export const data = writable({})
export const trigger = writable(-2)
export const chat = writable( false )
export const volume = writable( 1 )
export const live = writable( [] )
export const play_text = writable( 'PLAY' )