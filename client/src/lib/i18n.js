import axios from "axios";

const insert = async () => {
    let id;
    await axios.post('http://localhost:8080/api/i18n/')
        .then((response) => {
            
            if (typeof response.data.id !== 'undefined') {
                id = response.data.id;
            } else {
                console.log(response);
            }

        })
        .catch((error) => console.log(error));
    return id;

}

export default { insert }