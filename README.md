Microsite for [VIDICON](https://vidicon.org) 2021

## Editing Content

All data is grabbed from the [docs/data](https://github.com/autr/vidicon-2021/tree/main/docs/data) folder on the fly - which acts as a basic CMS, by editing and commiting those files - which can be done directly within Github.

* [nav.csv](https://github.com/autr/vidicon-2021/blob/main/docs/data/nav.csv) - links in top right corner of page
* [live.csv](https://github.com/autr/vidicon-2021/blob/main/docs/data/live.csv) - live updated info for each station: *grabbed every 30 seconds inside the microsite*
* [stations.csv](https://github.com/autr/vidicon-2021/blob/main/docs/data/stations.csv) - list of stations with properties for m3u8 link and the scanlines chat room name 
* [play.md](https://github.com/autr/vidicon-2021/blob/main/docs/data/play.md) - markdown file which is converted into the connect-via-OBS instructions for DIY rooms

**WARNING**

When editing CSV directly, be careful of using commas and unusual characters - and use quotation marks to contain them:

```

# BAD
id, name, message, url
02, gilbert, hello, world!, www.web.com/a%34really%87weird?url=with,parameters

# GOOD
id, name, message, url
02, gilbert, "hello, world!", "www.web.com/a%34really%87weird?url=with,parameters"

```

## TODOs

* test on different browsers (only Safari / Chromium so far): check for bugs, and add simple mobile version
* try editing lots of data in the CSV files - see what breaks or could cause problems
* add markdown file that can be used to override everything and show text (ie. "festival is starting soon")
* test 5 x simultaneous livestreams and chatrooms from scanlines servers

## Tech Details

* built with [svelte](https://svelte.dev/docs) using basic `window.location.hash` routing, which looks up `stations.csv` to create cube face index
* all should be _pnpm / yarn / npm_ installable except locally linked libs [sassis](https://github.com/autr/sassis) and [rad-and-cool-icons](https://github.com/autr/rad-and-cool-icons)
* [video.js](https://docs.videojs.com/docs/api/player.html) HLS component is used for m3u8 streams, and defaults to a testcard m3u8 stream if none is set in `stations.csv`
* video players are `undefined` until a tween animation is completed, and each subsequent video player is loaded on demand to reduce uneccesary memory use
* variable for toggling chat is stored in `window.localStorage('CHAT')`
* debugger overlays can be viewed by adding `?debug` as an url parameter string

# License

MIT