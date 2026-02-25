import projectsData from '@shared/assets/projects.json'

const DB_NAME = 'dynamic-price'
const DB_VERSION = 1

export const STORES = {
	PROJECTS: 'projects',
} as const

let dbPromise: Promise<IDBDatabase> | null = null

const seedProjects = (db: IDBDatabase): Promise<void> => {
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORES.PROJECTS, 'readonly')
		const countRequest = tx.objectStore(STORES.PROJECTS).count()

		countRequest.onsuccess = () => {
			if (countRequest.result > 0) {
				resolve()
				return
			}

			const writeTx = db.transaction(STORES.PROJECTS, 'readwrite')
			const store = writeTx.objectStore(STORES.PROJECTS)

			for (const project of projectsData.projects) {
				store.add(project)
			}

			writeTx.oncomplete = () => resolve()
			writeTx.onerror = () => reject(writeTx.error)
		}

		countRequest.onerror = () => reject(countRequest.error)
	})
}

const openDB = (): Promise<IDBDatabase> => {
	if (dbPromise) { return dbPromise }

	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION)

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result
			if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
				db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' })
			}
		}

		request.onsuccess = (event) => {
			const db = (event.target as IDBOpenDBRequest).result
			seedProjects(db).then(() => resolve(db)).catch(reject)
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
