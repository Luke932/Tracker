// database.js
const dbName = 'goalTrackerDB';
const dbVersion = 1;
let db;

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = (event) => {
            console.error('Errore durante l\'apertura del database', event);
            reject(event);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains('goals')) {
                db.createObjectStore('goals', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

function addGoal(descrizione, scadenza) {
    return openDatabase().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['goals'], 'readwrite');
            const store = transaction.objectStore('goals');
            const goal = { descrizione, scadenza, progress: 0 };

            const request = store.add(goal);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                console.error('Errore durante l\'aggiunta dell\'obiettivo', event);
                reject(event);
            };
        });
    });
}

function getGoals() {
    return openDatabase().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['goals'], 'readonly');
            const store = transaction.objectStore('goals');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                console.error('Errore durante il recupero degli obiettivi', event);
                reject(event);
            };
        });
    });
}

function updateGoal(id, updates) {
    return openDatabase().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['goals'], 'readwrite');
            const store = transaction.objectStore('goals');
            const request = store.get(id);

            request.onsuccess = () => {
                const data = request.result;
                if (data) {
                    if (typeof updates.scadenza !== 'string') {
                        console.error('La data di scadenza non è una stringa.');
                        reject(new Error('La data di scadenza non è una stringa.'));
                        return;
                    }

                    const formatoDataRegex = /^\d{2}-\d{2}-\d{2}$/;
                    if (!formatoDataRegex.test(updates.scadenza)) {
                        console.error('Formato data di scadenza non valido.');
                        reject(new Error('Formato data di scadenza non valido.'));
                        return;
                    }

                    console.log('Dati prima dell\'aggiornamento:', data);
                    // Rimuovi l'id dall'oggetto data
                    const { id, ...updatesWithoutId } = updates;

                    // Modifica l'oggetto data utilizzando solo descrizione, scadenza e progress
                    const newData = { descrizione: updatesWithoutId.descrizione, scadenza: updatesWithoutId.scadenza, progress: updatesWithoutId.progress };

                    // Esegui la tua logica di aggiornamento usando newData invece di updates
                    Object.assign(data, newData);

                    console.log('Dati dopo l\'aggiornamento:', newData);
                    console.log(id);
                    const updateRequest = store.put(data, id);
                    updateRequest.onsuccess = () => resolve(data);
                    updateRequest.onerror = (event) => reject(event);
                } else {
                    reject(new Error(`Obiettivo con ID ${id} non trovato`));
                }
            };

            request.onerror = (event) => {
                console.error(`Errore durante il recupero dell'obiettivo con ID ${id}`, event);
                reject(event);
            };
        });
    });
}



function deleteGoal(id) {
    return openDatabase().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['goals'], 'readwrite');
            const store = transaction.objectStore('goals');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event);
        });
    });
}

export { addGoal, getGoals, updateGoal, deleteGoal };
