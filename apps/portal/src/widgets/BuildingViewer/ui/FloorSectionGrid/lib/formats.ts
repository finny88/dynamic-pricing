export const formatPrice = (price: number): string => {
	if (!price) { return '' }
	return Math.round(price).toLocaleString('ru-RU')
}