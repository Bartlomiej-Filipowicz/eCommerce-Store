import { USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
   } from '../constants/userConstants'
import axios from 'axios'


export const login = (email, password) => async (dispatch) => {

    try
    {
        dispatch({
            type: USER_LOGIN_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        // it sends a username and a password and gets in return the JWT token
        const {data} = await axios.post(
            '/api/users/login/',
            {'username': email, 'password': password},
            config
        )

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data 
        })

        // I create data in local storage which informs that a user is logged in
        localStorage.setItem('userInfo', JSON.stringify(data))
    }
    catch (error)
    {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }

}

// userInfo is deleted from local storage
// which is an equivalent of logging out
export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({ type: USER_LOGOUT })
}