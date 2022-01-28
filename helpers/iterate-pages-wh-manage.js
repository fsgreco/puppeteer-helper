import procrastinate from './procrastinate.js'

/**
 * It iterate pages by clicking on `nextPageSelector` => in every page it applies querySelectorAll to find elements that match `singleItemSelector` => on every element founded it evaluates the `evalCallback` and then pass the result to `manageItemFn`.
 * When there is no element to click any more it stops returning void.
 * @param { puppeteer.Page } page 
 * @param {{ singleItemSelector: string, nextPageSelector: string }} selectors 
 * @param {function} evalCallback 
 * @param {Function<Promise>} manageItemFn 
 * @returns {Promise<function>|void} It returns itself and run again until no more `nextPageSelector` is matched.
 */
async function iterateSingleElements( page, selectors, evalCallback, manageItemFn ) {
  await procrastinate(page)
  
  const { singleItemSelector, nextPageSelector } = selectors
  const listOfItems = await page.$$(singleItemSelector)

  try {
    /* Since there is a .map with async function in it you need a Promise.all to wait all the map iterations to finish  */
    await Promise.all( listOfItems.map( async singleItemElHandle => {
      let item = await singleItemElHandle.evaluate( evalCallback )
      await manageItemFn(item)
    }))
    console.log(`Managed ${listOfItems.length} items.`)
  } catch(err) { console.log(`Error handling the item: ${err.message}`)}

  await procrastinate(page)

  try {
    let nextButton = await page.waitForSelector(nextPageSelector, { timeout: 30000 })
    await nextButton.click()
    // await page.waitForNetworkIdle({ idleTime: 500 })
    await Promise.race([
			page.waitForSelector(singleItemSelector),
			page.waitForSelector(nextPageSelector),
		]);
    
  } catch (error) {
    return
  }
  await procrastinate(page)
  await page.waitForTimeout(1000)

  return await iterateSingleElements( page, selectors, evalCallback, manageItemFn )  
}

export { iterateSingleElements as default }
