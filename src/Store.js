import { writable } from 'svelte/store'

export const xy = writable({x:0,y:0})
export const index = writable(0)
export const state = writable({})
export const data = writable({})