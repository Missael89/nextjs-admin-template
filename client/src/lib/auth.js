import Router from 'next/router';
import axios from "axios";

export function isBrowser() {
    return typeof window !== "undefined";
}

export function getUser() {
    return isBrowser() && window.localStorage.getItem("userSession")
        ? JSON.parse(window.localStorage.getItem("userSession"))
        : setUser({
        });
}

export function setUser(user) {
    (isBrowser())
        ? window.localStorage.setItem("userSession", JSON.stringify(user))
        : null;
}

export function isLoggedIn() {

    if (typeof getUser() !== "undefined" && typeof getUser().user_data !== "undefined") {
        const user = getUser().user_data.FULL_NAME;
        return true;
    }

}

export async function login(event) {
    const data = new FormData(event.currentTarget);
    data.append('query', 'login');

    const email = data.get("email");
    const password = data.get("password");
    const query = data.get("query");

    await axios.post('http://localhost:3001/api/login', { email, password, query })
        .then((response) => {
            
            if (response.data.success) {
                let array = response.data.user;
                setUser({
                    ID: array[0].ID,
                    FULL_NAME: array[0].FULL_NAME,
                    EMAIL: array[0].EMAIL
                }),
                /*array.map((row, idx) => {
                    console.log(idx, row);
                });*/
                Router.push('/');
            } else {
                console.log(response.data);
                alert(response.data.message);
            }

        })
        .catch((error) => console.log(error));
}

export function logout(callback) {
    setUser({});
    callback();
}