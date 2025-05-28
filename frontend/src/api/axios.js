import axios from 'axios'

// Configure axios defaults
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:5000'

export default axios
