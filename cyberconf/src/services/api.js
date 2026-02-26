const BASE_URL = 'http://localhost:4555';

const headers = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : undefined,
  };
};

const request = async (url, options = {}) => {
  const res = await fetch(BASE_URL + url, {
    ...options,
    headers: headers(),
  });

  if (!res.ok) {
    throw new Error('Erreur API');
  }

  return res.json();
};

export const api = {
  login: (id, password) =>
      request('/login', {
        method: 'POST',
        body: JSON.stringify({ id, password }),
      }),

  signup: (id, password) =>
      request('/signup', {
        method: 'POST',
        body: JSON.stringify({ id, password }),
      }),

  isAdmin: async () => {
    const res = await request('/isadmin');
    return res.isAdmin;
  },

  getConferences: () =>
      request('/conferences'),

  getConference: async (id) => {
    const res = await request(`/conference/${id}`);
    return res.conference || res;
  },

  createConference: (conference) =>
      request('/conference', {
        method: 'POST',
        body: JSON.stringify({ conference }),
      }),

  updateConference: (id, conference) =>
      request(`/conference?id=${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ conference }),
      }),

  deleteConference: (id) =>
      request(`/conference?id=${id}`, {
        method: 'DELETE',
      }),

  getUsers: () =>
      request('/users'),

  promoteUser: (id) =>
      request(`/usertype?id=${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ newType: 'admin' }),
      }),

  deleteUser: (id) =>
      request(`/user?id=${id}`, {
        method: 'DELETE',
      }),
};