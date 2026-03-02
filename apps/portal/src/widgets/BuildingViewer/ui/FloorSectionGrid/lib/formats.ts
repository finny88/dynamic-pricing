export const formatPrice = (price: number): string => {
	if (!isFinite(price)) { return '' }
	return Math.round(price).toLocaleString('ru-RU')
}