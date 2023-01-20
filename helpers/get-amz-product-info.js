import performActionAtUrl from './perform-action-at-url.js'

/**
 * Get Amz product information 
 * @param {string} targetUrl Target Amazon URL to be inquired
 * @returns {Promise<{title:string,price:string,seller:string,shippedBy:string}>} The object with information of the product
 */
const getAmzProductInfo = async targetUrl => {
	
	let scrapeAmzProduct = () => {
		let price = document.querySelector('.a-price .a-offscreen')?.textContent
		let title = document.querySelector('#productTitle')?.textContent?.trim()

		let who = document.querySelectorAll('.tabular-buybox-container .tabular-buybox-text')
		let seller = who[0]?.textContent.trim()
		let shippedBy = who[1]?.textContent.trim()

		return { title, price, seller, shippedBy }
	}

	return await performActionAtUrl( targetUrl, scrapeAmzProduct )
}

export { getAmzProductInfo as default }