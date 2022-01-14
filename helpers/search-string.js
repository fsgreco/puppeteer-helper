/**
 * It will find the input string (based on theField selector passed), then type the string to be searched and finally it will press Enter
 * Hint to do outside of the function:  
 * if it loads a new page wait for navigation:  
 * `await page.waitForNavigation({waitUntil: 'networkidle2'})`  
 * if it loads ajax request wait for network idle:  
 * `await page.waitForNetworkIdle({ idleTime: 500 })`  
 * @param {object} page Puppeteer page
 * @param {string} theField The field selector to be found
 * @param {string} theString The Place
 */
const searchString = async (page, theField, theString) => {
	await page.type(theField, theString, { delay: 200 })
	await page.focus(theField)
	await page.keyboard.press('Enter')

	return
}

export { searchString as default }