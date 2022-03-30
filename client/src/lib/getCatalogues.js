import axios from 'axios';

const icons = async () => {
    let res;
    await axios.get('http://localhost:8080/api/icons/')
        .then((response) => {
            if (response.data) {
                res = response.data;
            } else {
                console.log(response.data);
            }
        }).catch((error) => console.log(error));
    return res;
}

const servicesType = async () => {
    let res;
    await axios.get('http://localhost:8080/api/serviceType/')
        .then((response) => {
            if (response.data) {
                res = response.data;
            } else {
                console.log(response.data);
            }
        }).catch((error) => console.log(error));
    return res;
}

export default { icons, servicesType }