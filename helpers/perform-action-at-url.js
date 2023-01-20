import initBrowserSession from './init-puppeteer.js'

/**
 * Perform an action to a target url with puppeteer - it will execute the callback inside the browser runtime.
 * @param {string} url Url to be scraped.
 * @param {function} action Callback that will be executed in the browser runtinme - it is expected to return something.
 * @returns Either an Array, or an Object or null (the action must return something).
 */
async function performActionAtUrl(url,action) {
	const { browser, page } = await initBrowserSession()
	await page.goto(url, { waitUntil: 'networkidle2' })
	let results = await page.evaluate( action )
	await browser.close()
	return results
}

export { performActionAtUrl as default }