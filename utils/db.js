const passwordStore = {};

function savePassword(site, password) {
  passwordStore[site] = password;
  return Promise.resolve();
}

function getPassword(site) {
  return Promise.resolve(passwordStore[site] || null);
}

module.exports = { savePassword, getPassword };