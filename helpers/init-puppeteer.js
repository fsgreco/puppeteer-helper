import puppeteer from "puppeteer"

/**
 * It will inizializate a new session of Puppeteer in incognito mode
 * @param {{headless:boolean}} puppeteerOptions [optional] - overrides launch options
 * @param {array} browserArgs [optional] - overrides browser arguments
 * @param {string} locale [optional] set custom locale options, default = null
 * @param {boolean} userAgent [optional] defines custom user agent, default = null
 * @returns { Promise <{ browser: puppeteer.Browser, page: puppeteer.Page }> } an object with `browser` and `page` instance
 */
async function inizializeIncognitoSession( puppeteerOptions = { headless: true }, browserArgs = [], locale = 'en-US', userAgent = false ) {

	const viewPort = { width: 1366, height: 768 }

	const args = [ 
		'--incognito',
		`--window-size=${viewPort.width},${viewPort.height}`,
		...browserArgs
	]

	const options = {
		...puppeteerOptions,
		ignoreDefaultArgs: [ "--enable-automation" ],
		args,
	}

	const browser = await puppeteer.launch(options);
	const context = await browser.createIncognitoBrowserContext();

	// Create a new page in a pristine context.
	const page = await context.newPage();
	await page.setExtraHTTPHeaders({
		'Accept-Language': `${locale}`
	});
	
	/* WITH FAKE USER AGENT */
	if ( userAgent ) {
		
		let fakeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36'

		await page.evaluateOnNewDocument((fakeUA) => {
			delete navigator.__proto__.webdriver;
			Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
			Object.defineProperty(navigator, 'vendor', { get: () => '' });
			Object.defineProperty(navigator, 'oscpu', { get: () => 'Windows NT 10.0; Win64; x64' });
			Object.defineProperty(navigator, 'productSub', { get: () => '20100101' });
			Object.defineProperty(navigator, 'language', { get: () => `${locale}` });
			Object.defineProperty(navigator, 'languages', { get: () => [`${locale}`] });

			window.open = (...args) => {
				let newPage = open(...args)
				Object.defineProperty( newPage.navigator, 'userAgent', { get: () => fakeUA})
				return newPage
			}

			window.open.toString = () => 'function open() { [native code] }'
		}, fakeUserAgent)
		await page.setUserAgent(fakeUserAgent)
	}


	await page.setViewport({ width: viewPort.width, height: viewPort.height })
	
	if ( puppeteerOptions.headless ) {
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