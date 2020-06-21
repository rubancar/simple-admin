import axios from 'axios'

import authConfig from '../config/auth'

export const authenticate = (credentials) => axios.post('/api/login', credentials)

export const logout = () => axios.post('/api/logout')

export const forgotPass = (data) => axios.post('/api/forgotpass', data)

export const recoverPass = (data) => axios.post('/api/recoverpass', data)

export const userInfo = () => axios.post('/api/me')

/*export const registerAuthHeaders = () => (dispatch) => {
  axios.interceptors.request.use((config) => {
    try {
      const token = getAuthToken()
      if (token)
        config.headers[authConfig.authHeaderKey] = authConfig.authHeaderValue(token)
      else
        delete config.headers[authConfig.authHeaderKey];
    } catch (error) {
      // Storage cannot be read
    }
    return config;
  }, (error) => Promise.reject(error))

  axios.interceptors.response.use((response) => response, (error) => {
    if (error.response.status === 401) {
      dispatch(setAuthFeedback(error.message || 'No autorizado', true))
      dispatch(doLogout())
    }
    return Promise.reject(error)
  })
}*/

export const clearLocalStorage = () => localStorage.clear()