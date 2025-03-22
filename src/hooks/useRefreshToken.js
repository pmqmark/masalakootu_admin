import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken, setRefreshToken } from '../store/slices/tokenSlicer';
import axios from '../config/axios';
import { regenTokenRoute } from '../lib/endPoints';

const useRefreshToken = () => {
    const dispatch = useDispatch();
    const refreshToken = useSelector((state)=> state.token.refreshToken)

    const refresh = async () => {
        const response = await axios.post(regenTokenRoute, {
            refreshToken: refreshToken
        });

        dispatch(setAccessToken(response?.data?.accessToken));
        dispatch(setRefreshToken(response?.data?.refreshToken));

        return response?.data?.accessToken;
    }
    return refresh;
};

export default useRefreshToken;