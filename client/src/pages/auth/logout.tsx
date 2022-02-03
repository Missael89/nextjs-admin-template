import { logout } from "lib/auth";
import Router from "next/router";
import { useEffect } from "react";

export default function Logout() {

    useEffect(() => {
        logout(() => Router.push('/auth/login'));
    },[]);

    return <></>

}
