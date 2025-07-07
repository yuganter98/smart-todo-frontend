import axios from 'axios';

// Axios instance with base API URL
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  // headers: {
  //   Authorization: `Bearer YOUR_TOKEN_HERE` // Uncomment and use if auth is added
  // }
});

/**
 * Get all tasks
 * @returns {Promise} Axios GET Promise
 */
export const getTasks = () => API.get('/tasks/');

/**
 * Create a new task
 * Backend handles AI-based insights (priority, deadline, category)
 * @param {Object} data - { title, description }
 * @returns {Promise}
 */
export const postTask = (data) => API.post('/tasks/', data);

/**
 * Get all categories (used for suggestion or dropdown)
 * @returns {Promise}
 */
export const getCategories = () => API.get('/categories/');

/**
 * Get all context entries
 * @returns {Promise}
 */
export const getContextEntries = () => API.get('/context/');

/**
 * Create a new context entry (email, WhatsApp, note)
 * @param {Object} data - { content, source_type }
 * @returns {Promise}
 */
export const postContext = (data) => API.post('/context/', data);

/**
 * Get AI-powered suggestions for a task
 * Returns: description, priority, deadline, category
 * @param {Object} data - { task, context }
 * @returns {Promise}
 */
export const getAISuggestions = (data) => API.post('/ai/suggestions/', data);
