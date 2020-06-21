import axios from 'axios'

export default () => {
  axios.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject({
      message: error.response &&
      error.response.data &&
      error.response.data.error ?
        error.response.data.error :
        'Ha ocurrido un error. Intente más tarde',
      ...error
    })
  )
}