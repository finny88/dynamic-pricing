const DB_NAME = 'dynamic-price'
const DB_VERSION = 4

export const STORES = {
	PROJECTS: 'projects',
	BUILDINGS: 'buildings',
} as const

let dbPromise: Promise<IDBDatabase> | null = null

const openDB = (): Promise<IDBDatabase> => {
	if (dbPromise) { return dbPromise }

	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION)

		request.onupgradeneeded = () => {
			const db = request.result
			if (db.objectStoreNames.contains(STORES.PROJECTS)) {
				db.deleteObjectStore(STORES.PROJECTS)
			}
			db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' })

			if (db.objectStoreNames.contains(STORES.BUILDINGS)) {
				db.deleteObjectStore(STORES.BUILDINGS)
			}
			const buildingsStore = db.createObjectStore(STORES.BUILDINGS, { keyPath: 'id' })
			buildingsStore.createIndex(
				'projectId',
				'projectId',
				{ unique: false },
			)
		}

		request.onsuccess = () => {
			resolve(request.result)
		}

		request.onerror = () => {
			reject(request.error)
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

export const getById = async <T>(storeName: string, id: string): Promise<T | null> => {
	const db = await openDB()
	return new Promise((resolve, reject) => {
		const request: IDBRequest<T | null> = db
			.transaction(storeName, 'readonly')
			.objectStore(storeName)
			.get(id)

		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})
}

export const getAll = async <T>(storeName: string): Promise<T[]> => {
	const db = await openDB()
	return new Promise((resolve, reject) => {
		const request: IDBRequest<T[]> = db
			.transaction(storeName, 'readonly')
			.objectStore(storeName)
			.getAll()

		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})
}

export const getAllByIndex = async <T>(storeName: string, indexName: string, value: string): Promise<T[]> => {
	const db = await openDB()
	return new Promise((resolve, reject) => {
		const request: IDBRequest<T[]> = db
			.transaction(storeName, 'readonly')
			.objectStore(storeName)
			.index(indexName)
			.getAll(value)

		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})
}
