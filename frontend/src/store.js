// this is a store in redux pattern

import {  combineReducers, applyMiddleware } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer, productDetailsReducer } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { userLoginReducer, userRegisterReducer, userDetailsReducer } from './reducers/userReducers'

const reducer = combineReducers({
    productList: productListReducer, // productList is a state
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
})

// if there are no products in a cart, return an empty array
const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

//const middleware = [thunk]

//const store = configureStore(reducer, initialState,
//    composeWithDevTools(applyMiddleware(...middleware)))
// ^^^ originally it was 'createStore'

const initialState = { // takes cart products from a local storage
    cart: { cartItems: cartItemsFromStorage }, // cart is a state
    userLogin: { userInfo: userInfoFromStorage} // userLogin is a state
} 

const store = configureStore({reducer, // redux-thunk is in Included Default Middleware
    preloadedState: initialState,
    })

export default store