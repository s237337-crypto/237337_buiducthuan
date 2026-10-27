import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });
export const getEmployees = (s = '') => API.get('/employees' + (s ? '?search=' + s : ''));
export const getEmployeeById = (id) => API.get('/employees/' + id);
export const createEmployee = (d) => API.post('/employees', d);
export const updateEmployee = (id, d) => API.put('/employees/' + id, d);
export const deleteEmployee = (id) => API.delete('/employees/' + id);
