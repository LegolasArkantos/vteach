import axios from "../utilities/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            
            const response = await axios('http://localhost:3001/auth/logout', {
                withCredentials: true
            });
            console.log("check")
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout