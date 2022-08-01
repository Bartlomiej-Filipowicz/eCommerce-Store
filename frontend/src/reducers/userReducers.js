import { USER_LOGIN_REQUEST,
         USER_LOGIN_SUCCESS,
         USER_LOGIN_FAIL,
         USER_LOGOUT,
        } from '../constants/userConstants'



export const userLoginReducer = (state = { }, action) => {
    switch(action.type){
        case USER_LOGIN_REQUEST: // when the process of logging in is in progress
            return { loading: true }
            //^^^ by setting 'loading' to 'true' I'm letting users know that their request is being executed

        case USER_LOGIN_SUCCESS: // it returned data
            return { loading: false, userInfo: action.payload } // I get action.payload from an API

        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload }

        case USER_LOGOUT:
            return {}

        default:
            return state
    }
}