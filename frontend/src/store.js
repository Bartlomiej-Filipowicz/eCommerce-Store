// this is a store in redux pattern

import {  combineReducers, applyMiddleware } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer, productDetailsReducer } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'

const reducer = combineReducers({
    productList: productListReducer, // productList is a state
    productDetails: productDetailsReducer,
    cart: cartReducer,
})

// if there are no products in a cart, return an empty array
const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

//const middleware = [thunk]

//const store = configureStore(reducer, initialState,
//    composeWithDevTools(applyMiddleware(...middleware)))
// ^^^ originally it was 'createStore'

const initialState = { // takes cart products from a local storage
    cart: { cartItems: cartItemsFromStorage }
} 

const store = configureStore({reducer, // redux-thunk is in Included Default Middleware
    preloadedState: initialState,
    })

export default store