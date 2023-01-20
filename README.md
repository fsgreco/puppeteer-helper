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

## Perform basic action at an URL

If you have a function that needs to be runned on the DOM of the page to scrape some data, you can use `performActionAtUrl` method by simply passing two arguments: the `url` to be scraped (as a string) and the callback it should run in the DOM. Beware it is expected that your callback returns something (an Array, or an Object or just simply Null).

```js
import { performActionAtUrl } from 'puppeteer-helper'

/**
 * This is the callback that will be runned inside the DOM of the targetUrl
 * @returns the string from the page 
 */
let myCallback = () => document.querySelector('.some-className')?.textContent 

let targetURL = 'https://your-target-url.tld'

const results = await performActionAtUrl(targetURL, myCallback )

console.log(results)
```
This function does not need a `page` object, it will take care to open a page for you, execute the function, close the browser and get you the results of your callback.

### Get AMZ Products Information [experimental]

A further abstraction of `performActionAtUrl` is the new method `getAmzProductInfo`:  
You only need to pass the url of the product and the lib will take care of everything else.  
There is a callback already in place that will extract an object with `title`, `price`, `seller` and `shippedBy` properties:
```js
import { getAmzProductInfo } from 'puppeteer-helper'

let amzUrl = 'https://www.your-amz-link/the-product-uri/ecc'

let amzProd = await getAmzProductInfo(amzUrl)

console.table(amzProd)
```
Output example: 
```console
┌───────────┬─────────────────────────────────────────────────────┐
│  (index)  │                       Values                        │
├───────────┼─────────────────────────────────────────────────────┤
│   title   │    'Amz Basics Dynamic Vocal Microphone – Cardioid' │
│   price   │                      '$29.80'                       │
│  seller   │                       'Amz'                         │
│ shippedBy │                       'Amz'                         │
└───────────┴─────────────────────────────────────────────────────┘
```
---

## Iterate functions [Highly Experimental]

When dealing with listings that are paginated you can iterate through pages with `iteratePages` method.  
It takes the `page` object, the `callback` you want to execute in the DOM (it need to return a list of objects) and the `nextPageSelector` to click and iterate the callback. The function will return an array of items (objects).

```js
import { iteratePages } from 'puppeteer-helper'
// ...
let nextPageSelector = '[data-paginate="pagination"] nav > button:not([disabled])' 
let items = await iteratePages( page, callback, nextPageSelector )
```

### Managing the objects 

The same as `iteratePages` but it will manage the items directly.   
It takes the `page`, the `selectors` object (that contain the `singleItemSelector` and the `nextPageSelector`).  
The `singleItemSelector` will be used to select **all** the items that match that selector (on every singe page).  
This items will be handled with the `callback` on the DOM, it will return an object.  
Every single object scraped will be managed by the `manageItemFn` (for example added instantly to a DB).  
The function returns itself and run again until no more `nextPageSelector` is matched.  

```js
import { iterateSingleElements } from 'puppeteer-helper'
// ...
let selectors = {
	singleItemSelector: '[data-item="property-card"]',
	nextPageSelector: '[data-paginate="pagination"] nav > button:not([disabled])' 
}
await iteratePagesAndManageItem( page, selectors, callback, manageItemFn )
```
---