import axios from '../utilities/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post('/auth/refresh', {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response);
            return { ...prev,role: response.data.role, 
                teacherId: response.data.teacherId, 
                accessToken: response.data.accessToken,
                firstName:response.data.firstName,
                lastName:response.data.lastName,
             };
        });

        return response.data.accessToken;
    };

    return refresh;
};

export default useRefreshToken;
