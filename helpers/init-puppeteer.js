import puppeteer from "puppeteer"

/**
 * It will inizializate a new session of Puppeteer in incognito mode
 * @param {boolean} headless define if you want a headless browser or not, default = true
 * @param {number} slowMo define miliseconds of slow motion, default = null
 * @returns { Promise <{ browser: puppeteer.Browser, page: puppeteer.Page }> } an object with `browser` and `page` instance
 */
async function inizializeIncognitoSession(headless = true, slowMo = null) {
	let width = 1366
	let height = 768

	const browser = await puppeteer.launch({ 
		headless, 
		slowMo, 
		ignoreDefaultArgs: ["--enable-automation"],
		args: ['--incognito', `--window-size=${width},${height}` ] // '--proxy-server=PROXY_SERVER_ADDRESS'
	});
	const context = await browser.createIncognitoBrowserContext();

	// Create a new page in a pristine context.
	const page = await context.newPage();
	await page.setExtraHTTPHeaders({
		'Accept-Language': 'it'
	});
	
	// MOD USER AGENT 
	let fakeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36'
	await page.evaluateOnNewDocument((fakeUA) => {
		delete navigator.__proto__.webdriver;
		Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
		Object.defineProperty(navigator, 'vendor', { get: () => '' });
		Object.defineProperty(navigator, 'oscpu', { get: () => 'Windows NT 10.0; Win64; x64' });
		Object.defineProperty(navigator, 'productSub', { get: () => '20100101' });
		Object.defineProperty(navigator, 'language', { get: () => 'it-IT' });
		Object.defineProperty(navigator, 'languages', { get: () => ['it-IT','it'] });

		window.open = (...args) => {
			let newPage = open(...args)
			Object.defineProperty( newPage.navigator, 'userAgent', { get: () => fakeUA})
			return newPage
		}

		window.open.toString = () => 'function open() { [native code] }'
	}, fakeUserAgent)
	await page.setUserAgent(fakeUserAgent)

	await page.setViewport({ width, height })
	
	if ( headless ) {
		await page.setRequestInterception(true)
		page.on("request", request => {
			if (['image', 'stylesheet', 'font'].includes(`${request.resourceType()}`)) request.abort()
			else request.continue()
		});
	}

	page.setDefaultTimeout(15000)
	
	await page.waitForTimeout(100)

	return new Promise( resolve => resolve({ browser, page }) )
}

export { inizializeIncognitoSession as default }