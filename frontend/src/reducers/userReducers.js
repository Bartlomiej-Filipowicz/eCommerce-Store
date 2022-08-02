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
         USER_DETAILS_RESET,


         USER_UPDATE_PROFILE_REQUEST,
         USER_UPDATE_PROFILE_SUCCESS,
         USER_UPDATE_PROFILE_FAIL,
         USER_UPDATE_PROFILE_RESET,
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



export const userRegisterReducer = (state = { }, action) => {
    switch(action.type){
        case USER_REGISTER_REQUEST: // when the process of logging in is in progress
            return { loading: true }
            //^^^ by setting 'loading' to 'true' I'm letting users know that their request is being executed

        case USER_REGISTER_SUCCESS: // it returned data
            return { loading: false, userInfo: action.payload } // I get action.payload from an API

        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload }

        case USER_LOGOUT:
            return {}

        default:
            return state
    }
}




export const userDetailsReducer = (state = { user: {} }, action) => {
    switch(action.type){
        case USER_DETAILS_REQUEST: // when the process of logging in is in progress
            return { ...state, loading: true }
            //^^^ by setting 'loading' to 'true' I'm letting users know that their request is being executed

        case USER_DETAILS_SUCCESS: // it returned data
            return { loading: false, user: action.payload } // I get action.payload from an API

        case USER_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        case USER_DETAILS_RESET:
            return { user: {} }

        default:
            return state
    }
}




export const userUpdateProfileReducer = (state = {  }, action) => {
    switch(action.type){
        case USER_UPDATE_PROFILE_REQUEST: // when the process of logging in is in progress
            return { loading: true }
            //^^^ by setting 'loading' to 'true' I'm letting users know that their request is being executed

        case USER_UPDATE_PROFILE_SUCCESS: // it returned data
            return { loading: false, success: true, userInfo: action.payload } // I get action.payload from an API

        case USER_UPDATE_PROFILE_FAIL:
            return { loading: false, error: action.payload }

        case USER_UPDATE_PROFILE_RESET:
            return {}

        default:
            return state
    }
}