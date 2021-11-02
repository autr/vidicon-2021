import CsvToJson from 'csvtojson'

let data
let sources = ['nav', 'stations']

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
		return w.data

	} else {
		return w.data
	}
}