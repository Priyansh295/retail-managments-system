import { createContext, useEffect, useState } from "react";
import axios from "axios"

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null)
    const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")) || null)

    const login = async (inputs) => {
        const res = await axios.post("http://localhost:8800/login_client", inputs);
        setCurrentUser(res.data);
    }
    const logout = async() => {
        await axios.post("http://localhost:8800/logout_client");
        setCurrentUser(null);
    }
    const login_admin = async (inputs) => {
        const res = await axios.post("http://localhost:8800/login_admin", inputs);
        setAdmin(res.data);
    }
    const logout_admin = async() => {
        await axios.post("http://localhost:8800/logout_admin");
        setAdmin(null);
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
        }, [currentUser]);
    useEffect(() => {
            localStorage.setItem("admin", JSON.stringify(admin));
    }, [admin]);

    return (
        <AuthContext.Provider value = {{ currentUser, admin, login, logout, login_admin, logout_admin}}>
            {children}
        </AuthContext.Provider>
    )
};