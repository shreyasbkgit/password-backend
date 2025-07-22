const db = [];

export async function savePassword(site, password) {
  db.push({ site, password });
}

export async function getPassword(site) {
  return db.find(p => p.site === site);
}

export async function getAllPasswords() {
  return db;
}