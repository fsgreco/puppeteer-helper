/**
 * It prepares the login function - meant for simple login form that takes username and password
 * @param { puppeteer.Page } page Puppeteer Page instance
 * @param {{ userInput:string, passInput:string}} selectors an object with input selectors: `userInput` and `passInput`
 * @returns Returns the async function that will perform the login
 */
const prepareToLogin = (page, selectors) => {

	const { userInput, passInput } = selectors

	/**
	 * Perform the login by clicking enter typing credendials and clicking `Enter`
	 * @param {{ username:string, password:string}} credentials an object with the credentials
	 * @returns {Promise<[any, any]>}
	 */
	return async function (credentials) {

		let [ username, password ] = await Promise.all([
			page.$(userInput), page.$(passInput)
		])

		await username.type(credentials.username, { delay: 90 })
		await password.type(credentials.password, { delay: 120 })

		await page.focus(passInput)
		return await Promise.allSettled([ // since it waitForNetworkIddle I use `allSettled` instead of `all` - to inspect potential errors better
			page.keyboard.press('Enter'),
			page.waitForNetworkIdle({ idleTime: 1500 })
		])
	}
}

export { prepareToLogin as default }