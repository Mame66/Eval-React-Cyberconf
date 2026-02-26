const BASE_URL = 'http://localhost:4555';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  login: async (id, password) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    });
    if (!res.ok) throw new Error('Identifiants invalides');
    return res.json(); // retourne { Token: "..." }
  },

  signup: async (id, password) => {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    });
    if (!res.ok) throw new Error('Erreur lors de la création du compte');
    return res.json();
  },

  isAdmin: async () => {
    const res = await fetch(`${BASE_URL}/isadmin`, { headers: getHeaders() });
    if (!res.ok) return false;
    const data = await res.json();
    return data.isAdmin;
  },

  // Conferences
  getConferences: async () => {
    const res = await fetch(`${BASE_URL}/conferences`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Erreur lors du chargement');
    return res.json();
  },

  getConference: async (id) => {
    const res = await fetch(`${BASE_URL}/conference/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Conférence introuvable');
    const data = await res.json();
    return data.conference || data;
  },

  createConference: async (conference) => {
    const res = await fetch(`${BASE_URL}/conference`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ conference }),
    });
    if (!res.ok) throw new Error('Erreur lors de la création');
    return res.json();
  },

  updateConference: async (id, conference) => {
    const res = await fetch(`${BASE_URL}/conference?id=${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ conference }),
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour');
    return res.json();
  },

  deleteConference: async (id) => {
    const res = await fetch(`${BASE_URL}/conference?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression');
    return res.json();
  },

  // Users
  getUsers: async () => {
    const res = await fetch(`${BASE_URL}/users`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Erreur chargement utilisateurs');
    return res.json();
  },

  promoteUser: async (id, newType = 'admin') => {
    const res = await fetch(`${BASE_URL}/usertype?id=${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ newType }),
    });
    if (!res.ok) throw new Error('Erreur lors de la promotion');
    return res.json();
  },

  deleteUser: async (id) => {
    const res = await fetch(`${BASE_URL}/user?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression');
    return res.json();
  },
};
