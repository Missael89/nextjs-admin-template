import axios from "axios";


const get = async (code) => {
    let locale;
    await axios.get(`http://localhost:8080/api/localeByCode/${code}`)
        .then((response) => {

            locale = response.data[0].id;

        })
        .catch((error) => console.log(error));
    return locale;

}

export default { get }