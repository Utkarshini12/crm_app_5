import axios from "axios";


async function DogApi({id, token }) {
    return await axios.get(`https://dog.ceo/api/breeds/image/random/${id}/${token}`, {
        headers: {
// key(exactly as it is in docs) : value (should be extarcated from localstorage)
        }
    }, {
        // body : key: value
    })
} 