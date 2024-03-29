import puppeteer from "puppeteer"
/**
 * This makes the browser lurks arround
 * @param {puppeteer.Page} page it requires the page/tab of the browser where it will run. 
 * @returns 
 */
const procrastinateBrowser = async page => {
	// Aspetta un tempo tra 0,3s ~ 1,1s
	let waitTime = Math.floor(Math.random() * (1100 - 300) + 300)
	await page.waitForTimeout(waitTime)

	// Scroll a distanze between 200 or 100 px
	await page.evaluate(`window.scroll(0, Math.floor(Math.random() * (200 - 100) + 100))`)
	
	// Random mouse movement via CDP method
	await page.mouse.move(100, Math.floor(Math.random() * (200 - 100) + 100) )

	return
}

export { procrastinateBrowser as default }