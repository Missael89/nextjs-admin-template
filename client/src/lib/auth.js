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

    await axios.post('https://connect.xiimbah-mexikoo.com/lib/_users.php', data)
        .then((response) => {
            
            if (response.data.success) {
                let userData = response.data.user;

                setUser({
                    ID: userData.ID,
                    FULL_NAME: userData.FULL_NAME,
                    EMAIL: userData.EMAIL
                }),                
            
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