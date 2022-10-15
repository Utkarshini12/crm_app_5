import axios from 'axios';


const BASE_URL = "https://relevel-crm--backend.herokuapp.com"

export async function fetchTicket() {
    return await axios.get(`${BASE_URL}/crm/api/v1/tickets/`, {
        headers: {
            'x-access-token': localStorage.getItem("token")
        }
    }, {
        "userId": localStorage.getItem("userId")
    }
    )

}
// PUT API : passing the id of the ticket and the new updated data 

export async function ticketUpdation(id, selectedCurrTicket) {
    return await axios.put(`${BASE_URL}/crm/api/v1/tickets/${id}`, selectedCurrTicket, {
        headers: {
            'x-access-token': localStorage.getItem("token")
        }
    }, {
        "userId": localStorage.getItem("userId")
    })
}
