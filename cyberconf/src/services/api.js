const BASE_URL = 'http://localhost:4555';

// Récupère le token stocké en localStorage
const getToken = () => localStorage.getItem('token');

// Headers communs avec autorisation
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// Gestion centralisée des réponses
const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erreur ${res.status}`);
  }
  return res.json();
};


export const login = (id, password) =>
  fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, password }),
  }).then(handleResponse);

export const signup = (id, password) =>
  fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, password }),
  }).then(handleResponse);

//  CONFÉRENCES

export const getConferences = () =>
  fetch(`${BASE_URL}/conferences`).then(handleResponse);

export const getConference = (id) =>
  fetch(`${BASE_URL}/conference/${id}`).then(handleResponse);

export const createConference = (conference) =>
  fetch(`${BASE_URL}/conference`, {
    method: 'POST',
    headers: authHeaders(),
      body: JSON.stringify(conference),
  }).then(handleResponse);

export const updateConference = (id, conference) =>
    fetch(`${BASE_URL}/conference?id=${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(conference),
    }).then(handleResponse);
export const deleteConference = (id) =>
  fetch(`${BASE_URL}/conference?id=${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(handleResponse);

//  UTILISATEURS

export const getUsers = () =>
  fetch(`${BASE_URL}/users`, {
    headers: authHeaders(),
  }).then(handleResponse);

export const promoteUser = (id, newType) =>
  fetch(`${BASE_URL}/usertype?id=${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ newType }),
  }).then(handleResponse);
