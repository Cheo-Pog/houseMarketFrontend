import axios from 'axios';
// make a central instance of axios so you dont have to use the full url and headers in every request

const instance = axios.create({
    baseURL: 'https://api.intern.d-tt.nl/api/',
    headers: {
        "Content-Type": "application/json",
        "X-api-key": "YcZIHz_D-6vGaNlU5bsWt7ywX1jeK2MJ"
    }
});

export default instance;