import axios from 'axios'
import { 
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL
} from '../constants/orderConstants'

import { CART_CLEAR_ITEMS } from '../constants/cartConstants'

export const createOrder = (order) => async (dispatch, getState) => {

    try
    {
        dispatch({
            type: ORDER_CREATE_REQUEST
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
        const {data} = await axios.post(
            '/api/orders/add/',
            order,
            config
        )

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data 
        })

        dispatch({
            type: CART_CLEAR_ITEMS,
            payload: data 
        })

        localStorage.removeItem('cartItems')

    }
    catch (error)
    {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }

}