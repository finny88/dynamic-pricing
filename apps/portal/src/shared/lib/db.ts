const DB_NAME = 'dynamic-price'
const DB_VERSION = 2

export const STORES = {
	PROJECTS: 'projects',
} as const

let dbPromise: Promise<IDBDatabase> | null = null

const openDB = (): Promise<IDBDatabase> => {
	if (dbPromise) { return dbPromise }

	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION)

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result
			if (db.objectStoreNames.contains(STORES.PROJECTS)) {
				db.deleteObjectStore(STORES.PROJECTS)
			}
			db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' })
		}

		request.onsuccess = (event) => {
			resolve((event.target as IDBOpenDBRequest).result)
		}

		request.onerror = (event) => {
			reject((event.target as IDBOpenDBRequest).error)
		}
	})

	return dbPromise
}

export const addItem = async <T>(storeName: string, item: T): Promise<void> => {
	const db = await openDB()
	return new Promise((resolve, reject) => {
		const request = db
			.transaction(storeName, 'readwrite')
			.objectStore(storeName)
			.add(item)

		request.onsuccess = () => resolve()
		request.onerror = () => reject(request.error)
	})
}

export const updateItem = async <T>(storeName: string, item: T): Promise<void> => {
	const db = await openDB()
	return new Promise((resolve, reject) => {
		const request = db
			.transaction(storeName, 'readwrite')
			.objectStore(storeName)
			.put(item)

		request.onsuccess = () => resolve()
		request.onerror = () => reject(request.error)
	})
}

export const deleteItem = async (storeName: string, id: string): Promise<void> => {
	const db = await openDB()
	return new Promise((resolve, reject) => {
		const request = db
			.transaction(storeName, 'readwrite')
			.objectStore(storeName)
			.delete(id)

		request.onsuccess = () => resolve()
		request.onerror = () => reject(request.error)
	})
}

export const getAll = async <T>(storeName: string): Promise<T[]> => {
	const db = await openDB()
	return new Promise((resolve, reject) => {
		const request = db
			.transaction(storeName, 'readonly')
			.objectStore(storeName)
			.getAll()

		request.onsuccess = () => resolve(request.result as T[])
		request.onerror = () => reject(request.error)
	})
}
