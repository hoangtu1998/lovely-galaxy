<script>
// simple IndexedDB wrapper
const DB_NAME = 'birthdayDB';
const DB_VER  = 1;
const STORE   = 'images';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE); // key-value store
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

// Lưu blob (file ảnh) dưới key
async function saveImageToDB(key, fileBlob) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(fileBlob, key);
    tx.oncomplete = () => resolve(true);
    tx.onerror    = () => reject(tx.error);
  });
}

// Lấy blob ra theo key
async function getImageFromDB(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror   = () => reject(req.error);
  });
}

// Lấy tất cả galaxy blobs theo thứ tự 1..5
async function loadAllGalaxyImages() {
  const keys = ['img_galaxy_1','img_galaxy_2','img_galaxy_3','img_galaxy_4','img_galaxy_5'];
  const out = [];
  for (const k of keys) {
    const blob = await getImageFromDB(k);
    if (blob) {
      const url = URL.createObjectURL(blob); // dùng url này làm src ảnh
      out.push(url);
    }
  }
  if (out.length === 0) {
    out.push('assets/cute-cake.png'); // fallback nếu rỗng
  }
  return out;
}
</script>
