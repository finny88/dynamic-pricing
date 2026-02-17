/**
 * Format price string for display
 */
export const formatPrice = (price: string): string => {
	const cleanPrice = price.replace(/,/g, '')
	const num = parseFloat(cleanPrice)
	if (isNaN(num)) {
		return price
	}
	return Math.round(num).toLocaleString('ru-RU').replace(/,/g, ' ')
}