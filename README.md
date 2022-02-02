# puppeteer-helper

Helper functions to help you initializate puppeteer sessions [**disclaimer**: this is an experimental package]

## Usage

### Help you initializing the puppeteer session

This package helps you to initialize puppeteer with convenient options[^explanation].
It lift you the burden of config some default options for the browser session, as view port, user agent and default timeout.

Simply import `initBrowserSession` and get your `browser` and `page` element:

```js
import { initBrowserSession } from "puppeteer-helper";


const { browser, page } = await initBrowserSession()

await page.goto('https://www.google.com', { waitUntil: 'networkidle2' })

await page.screenshot({ path: 'test-screenshot.jpg' , type: 'jpeg' })

await browser.close()
```

You can pass some optional arguments to `initBrowserSession`:

* first parameter requires an `object`: overrides launch options, **by default it's `{ headless: false }`**

* second parameter requires an `array`: overrides browser arguments, **by default it's empty `[]`**

* third parameter takes a `string`: set custom locale options, **by default it's empty `'en-US'`**

* fourth parameter takes a `boolean`: set a windows user agent, **by default it's empty `false`**

So for example if you want a session to be visibile (not headless) and with italian language browser, initialize the browser like this:

```js
//...
const { browser, page } = await initBrowserSession( {headless: true}, [], 'it-IT' )
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

[^explanation]: At the moment of writing this is still opinionated (for example puppeteer will initializate on an incognito session and it will set a specific user agent). As I said **this is an experimental package**, it has been done _for educational purposes_. But I will try to improved it by adding the possibility to modify this options in the future. Suggestions are welcome!

## Simple login

If you need to login to a common login page (that has common inputs: `userInput` and `passwordInput`), you can use `prepareToLogin` helper.

First prepare to login providing the `page` object, an object with the 2 selectors mentioned above.
And finally you can login providing only the the respective credentials (another object with `username` and `password`).

Here is a complete example (notice that only the last `login` function returns a Promise):

```js
import { prepareToLogin } from 'puppeteer-helpers'
//...

let userInput = 'input#username'
let passInput = 'input#password'
const login = prepareToLogin( page, { userInput, passInput })

let username = process.env.USER_NAME
let password = process.env.USER_PASSWORD
await login({ username, password })
```
