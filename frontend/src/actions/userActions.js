import { 
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_LOGOUT,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
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



export const register = (name, email, password) => async (dispatch) => {

    try
    {
        dispatch({
            type: USER_REGISTER_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        // it sends a username and a password and gets in return the JWT token
        const {data} = await axios.post(
            '/api/users/register/',
            {'name': name, 'email': email, 'password': password},
            config
        )

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data 
        })

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
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }

}



export const getUserDetails = (id) => async (dispatch, getState) => {

    try
    {
        dispatch({
            type: USER_DETAILS_REQUEST
        })

        const {
            userLogin: { userInfo }, // I get information who's logged in
        } = getState()              // getState() takes a state of an entire application

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}` // the route to a user profile page is protected that's why
                                                         //  authorization is needed
            }
        }

        // it sends a username and a password and gets in return the JWT token
        const {data} = await axios.get(
            `/api/users/${id}/`,
            config
        )

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data 
        })

    }
    catch (error)
    {
        dispatch({
            type: USER_DETAILS_FAIL,
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