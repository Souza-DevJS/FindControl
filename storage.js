// storage.js - Persistência com LocalStorage
class StorageManager {
  constructor(key) {
    this.key = key;
  }

  getAll() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  save(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  add(item) {
    const items = this.getAll();
    item.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    item.createdAt = new Date().toISOString();
    items.push(item);
    this.save(items);
    return item;
  }

  remove(id) {
    const items = this.getAll().filter(item => item.id !== id);
    this.save(items);
  }

  update(id, updates) {
    const items = this.getAll().map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    this.save(items);
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}