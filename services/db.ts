import { LogEntry } from "../types";

const DB_NAME = "CashUltraDB";
const DB_VERSION = 1;
const STORE_NAME = "logs";

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = () => {
            reject("Error opening database");
        };
    });
};

export const addLog = async (data: Omit<LogEntry, 'id'>): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.add(data);

        request.onsuccess = () => resolve();
        request.onerror = () => reject("Error adding log");
    });
};

export const getLogs = async (): Promise<LogEntry[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            const result = request.result as LogEntry[];
            // Sort by latest first
            resolve(result.reverse());
        };
        request.onerror = () => reject("Error fetching logs");
    });
};

export const clearLogs = async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject("Error clearing logs");
    });
};