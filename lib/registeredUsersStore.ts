import fs from 'fs';
import path from 'path';

const USERS_FILE_PATH = path.join(process.cwd(), 'data', 'registered_coomeva_users.json');

export interface StoredCoomevaUser {
  docType: string;
  document: string;
  persona: string;
  nombre: string;
  correo: string;
  telefono: string;
  updatedAt: string;
  userData: any;
}

export function getRegisteredUser(docType: string, document: string): StoredCoomevaUser | null {
  try {
    if (!fs.existsSync(USERS_FILE_PATH)) return null;
    const raw = fs.readFileSync(USERS_FILE_PATH, 'utf8');
    const store = JSON.parse(raw);
    const cleanDoc = document.replace(/\D/g, '');
    const keyWithPrefix = `${docType.toUpperCase()}_${cleanDoc}`;
    return store[cleanDoc] || store[keyWithPrefix] || null;
  } catch (e) {
    console.error('Error leyendo registered_coomeva_users.json:', e);
    return null;
  }
}

export function saveRegisteredUser(user: StoredCoomevaUser): void {
  try {
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let store: Record<string, StoredCoomevaUser> = {};
    if (fs.existsSync(USERS_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(USERS_FILE_PATH, 'utf8');
        store = JSON.parse(raw);
      } catch {}
    }

    const cleanDoc = user.document.replace(/\D/g, '');
    store[cleanDoc] = user;

    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(store, null, 2), 'utf8');
    console.log(`[UsersStore] Usuario actualizado/guardado con clave CC única: ${cleanDoc}`);
  } catch (e) {
    console.error('Error guardando en registered_coomeva_users.json:', e);
  }
}
