function setStorage(name: string, value: string) {
  localStorage.setItem(name, value);
}

function getStorage(name: string) {
  const token = localStorage.getItem(name);

  return token ? encodeURIComponent(token) : undefined;
}

function removeStorage(name: string) {
  localStorage.removeItem(name);
}

export { setStorage, getStorage, removeStorage };
