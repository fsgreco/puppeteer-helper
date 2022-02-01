/**
 * It fills a simple login form and clicks at the login button
 * @param { puppeteer.Page } page 
 * @param {{ user:string, pass:string, button:string}} selectors an object with input selectors
 * @param {{ username:string, password:string}} credentials an object with the credentials
 * @returns 
 */
async function login( page, selectors, credentials ) {
  let { user, pass, button } = selectors

  let [ username, password, loginBtn ] = await Promise.all([
    page.$(user), page.$(pass), page.$(button)
  ])
  
  await username.type(credentials.username, { delay: 90 })
  await password.type(credentials.password, { delay: 110 })
  await Promise.all([
    page.waitForNetworkIdle({ idleTime: 1000 }),
    loginBtn.click()
  ])

  return Promise.resolve()
}

export { login as default }

