# puppeteer-helper

Helper functions to help you initializate puppeteer sessions [**disclaimer**: this is an experimental package]

## Usage

### Help you initializing the puppeteer session

This package helps you to inizialize puppeteer with convenient options[^explanation]
It lift you the burden of config some default options for the browser session, as view port, user agent and default timeout.

Simply import `initBrowserSession` and get your `browser` and `page` element:

```js
import { initBrowserSession } from "puppeteer-helper";


const { browser, page } = await initBrowserSession()

await page.goto('https://www.google.com', { waitUntil: 'networkidle2' })

await page.screenshot({ path: 'test-screenshot.jpg' , type: 'jpeg', fullPage: true })

await browser.close()
```

You can pass two arguments (options) to `initBrowserSession`:

* first parameter requires a `boolean`: defines if you want a headless browser or not, **by default it's `true`**

* second parameter requires a `number`: defines the miliseconds of slow motiom, **by default it's `null`**

So for example if you want a session to be visibile (not headless) and to operate with 250 miliseconds of slow motion, initialize the browser like this: 

```js
//...
const { browser, page } = await initBrowserSession( false , 250 )
//...
```

## Procrastinate

You can also tell the browser to `procrastinate` in the page a little bit. 
It will wait some time, aproximately between 0,3s ~ 1,1s; it also scrolls a bit, between 200 and 100 px.

```js
import { procrastinate } from 'puppetter-helper'
// ...
await procrastinate(page)
//... 
```

## Search String

Search string will find the input string (based on theField selector passed), then type the string to be searched and finally it will press Enter. 

```js
//...
let inputSelector = 'input[type="text"][role="searchsomething"]'
await page.waitForSelector(inputSelector)

await searchString(page, inputSelector, 'This is the string you want to search')
await page.waitForNetworkIdle({ idleTime: 500 })

//...
```

Hint's to manage how to wait the load of the page (after the search has been done):

* if it loads a new page wait for navigation: `await page.waitForNavigation({waitUntil: 'networkidle2'})`
* if it loads ajax request wait for network idle: `await page.waitForNetworkIdle({ idleTime: 500 })`  

[^explanation]: At the moment of writing this is still opinionated (for example puppeteer will initializate on an incognito session and it will set a specific user agent, it will also set italian as language). As I said **this is an experimental package**, it has been done _for educational purposes_. But I will try to improved it by adding the possibility to modify this options in the future. Suggestions are welcome!