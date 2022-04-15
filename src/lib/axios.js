import Axios from 'axios'

console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

export default axios
