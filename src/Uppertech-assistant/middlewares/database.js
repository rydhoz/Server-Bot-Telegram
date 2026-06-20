import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');
export const DATA_DIR = path.join(ROOT_DIR, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) { return []; }
}

export function writeJSON(filename, data) {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

export const getUsers = () => readJSON('users.json');
export const addUser = (user) => {
  const users = getUsers();
  if (!users.find(u => u.id === user.id)) {
    users.push(user);
    writeJSON('users.json', users);
  }
};

export const getOrders = () => readJSON('orders.json');
export const addOrder = (order) => {
  const orders = getOrders();
  order.id = orders.length ? orders[orders.length-1].id + 1 : 1;
  orders.push(order);
  writeJSON('orders.json', orders);
  return order;
};
export const updateOrder = (id, updates) => {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], ...updates };
    writeJSON('orders.json', orders);
    return orders[idx];
  }
  return null;
};