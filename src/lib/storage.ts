import { Activity, ActivityPhoto } from '../types';
import { INITIAL_ACTIVITIES } from './sampleData';

const DB_NAME = 'AlSharia_Activities_DB';
const DB_VERSION = 1;
const STORE_NAME = 'activities';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('stage', 'stage', { unique: false });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllActivities(): Promise<Activity[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = async () => {
      let activities = request.result as Activity[];
      if (!activities || activities.length === 0) {
        // Seed default initial activities
        await seedDefaultActivities();
        activities = INITIAL_ACTIVITIES;
      } else {
        // Ensure all activities have supervisor name set to Ahmed Mohammed Faqeeh
        const needsUpdate = activities.some(
          (act) => act.supervisor !== 'أ/ أحمد محمد فقيه (رائد النشاط الطلابي)'
        );
        if (needsUpdate) {
          const writeTx = db.transaction(STORE_NAME, 'readwrite');
          const writeStore = writeTx.objectStore(STORE_NAME);
          activities = activities.map((act) => {
            const updated = {
              ...act,
              supervisor: 'أ/ أحمد محمد فقيه (رائد النشاط الطلابي)',
            };
            writeStore.put(updated);
            return updated;
          });
        }
      }
      // Sort newest first by date
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(activities);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function seedDefaultActivities(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const act of INITIAL_ACTIVITIES) {
      store.put(act);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function saveActivity(activity: Activity): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(activity);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteActivity(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function addPhotosToActivity(activityId: string, newPhotos: ActivityPhoto[]): Promise<Activity> {
  const current = await getActivityById(activityId);
  if (!current) {
    throw new Error('الفعالية غير موجودة');
  }

  const updatedPhotos = [...current.photos, ...newPhotos];
  const updatedActivity: Activity = {
    ...current,
    photos: updatedPhotos,
    coverPhotoId: current.coverPhotoId || newPhotos[0]?.id || updatedPhotos[0]?.id,
    updatedAt: new Date().toISOString(),
  };

  await saveActivity(updatedActivity);
  return updatedActivity;
}

export async function exportActivitiesJson(): Promise<string> {
  const activities = await getAllActivities();
  return JSON.stringify(activities, null, 2);
}

export async function importActivitiesJson(jsonData: string): Promise<number> {
  const parsed = JSON.parse(jsonData);
  if (!Array.isArray(parsed)) {
    throw new Error('صيغة الملف غير صالحة');
  }

  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    let count = 0;
    for (const act of parsed) {
      if (act && act.id && act.title) {
        store.put(act);
        count++;
      }
    }
    tx.oncomplete = () => resolve(count);
    tx.onerror = () => reject(tx.error);
  });
}

export async function resetDatabaseToDefault(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const clearReq = store.clear();
    clearReq.onsuccess = () => {
      for (const act of INITIAL_ACTIVITIES) {
        store.put(act);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
