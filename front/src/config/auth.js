export default {
  authHeaderKey: 'Authorization',
  authHeaderValue: (token) => `Bearer ${token}`,
  passwordMinLength: 6,
  tokenKey: 'session',
}