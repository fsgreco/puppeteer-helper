/**
 * Recursive function that iterate pages and return an array of items (objects)
 * @param { puppeteer.Page } browserTab Browser page where the iteration will run
 * @param { Function } callBack the callback that will be used in the pages to extract items information
 * @param { string } nextPageSelector The selector to locate the exact link or element to be clicked to go next page
 * @param { array } itemsArray [optional] the items array to be passed fot the successive iterations - no need to be passed on first call
 * @returns 
 */
async function iteratePages( browserTab, callBack, nextPageSelector, itemsArray = [] ) {

	// FIRST ITERATION (evaluate the callBack for first time)
	if (itemsArray.length === 0 ) {
		itemsArray = await browserTab.evaluate( callBack )
	}

	const nextPageElement = await browserTab.$( nextPageSelector )
	if ( !nextPageElement ) return itemsArray

	// NEXT ITERATIONS (nextPage exist - goes/click there - merge items - iterate)

	/* const href = await nextPageElement.evaluate( nextP => nextP.href )
	await browserTab.goto( href, { waitUntil: 'networkidle2' }) */

	await Promise.all([
		browserTab.waitForNavigation({ waitUntil: 'networkidle2' }),
		browserTab.click(nextPageSelector),
	]);

	let newItems = await browserTab.evaluate( callBack )
	
	itemsArray = [ ...itemsArray, ...newItems ]

	return await iteratePages( browserTab, callBack, nextPageSelector, itemsArray )
}

export { iteratePages as default }