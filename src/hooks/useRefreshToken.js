import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken, setRefreshToken } from '../store/slices/tokenSlicer';
import axios from '../config/axios';

const useRefreshToken = () => {
    const dispatch = useDispatch();
    const refreshToken = useSelector((state)=> state.token.refreshToken)

    const refresh = async () => {
        const response = await axios.post('/api/auth/regenerate-token', {
            refreshToken: refreshToken
        });

        dispatch(setAccessToken(response?.data?.accessToken));
        dispatch(setRefreshToken(response?.data?.refreshToken));

        return response?.data?.accessToken;
    }
    return refresh;
};

export default useRefreshToken;