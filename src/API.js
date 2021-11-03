import CsvToJson from 'csvtojson'
import { marked } from 'marked'

let data
let sources = ['nav', 'stations']
let documents = ['play']

export const FetchLiveInfo = async e => {

	const url = `data/live.csv?time=${parseInt((new Date())/1000)}`
	try {
		let data = await CsvToJson().fromString( await (await fetch(url)).text() )
		console.log(`[API] 🍄  grabbed live info ${url}`)
		return data
	} catch(err) {
		let message = `error grabbing ${url}! ${err.message}`
		console.log(`[API] ❌  ${message}`)
		alert(message)
		return null
	}
}

export const FetchData = async e => {
	let w = window
	if (!w.data) {
		w.data = {}
		for (let source of sources) {
			const url = `data/${source}.csv`
			try {
				w.data[source] = await CsvToJson().fromString( await (await fetch(url)).text() )
				console.log(`[API] ✅  grabbed ${url}`, w[source])
			} catch(err) {
				let message = `error grabbing ${url}! ${err.message}`
				console.log(`[API] ❌  ${message}`)
				alert(message)
			}
		}
		for (let doc of documents) {
			const url = `data/${doc}.md`
			try {
				w.data[doc] = await marked.parse( await (await fetch(url)).text() )
				console.log(`[API] ✅  grabbed ${url}`, w[doc])
			} catch(err) {
				let message = `error grabbing ${url}! ${err.message}`
				console.log(`[API] ❌  ${message}`)
				alert(message)
			}

		}
		return w.data
	} else {
		return w.data
	}
}