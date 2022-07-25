// this is a store in redux pattern

import {  combineReducers, applyMiddleware } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer, productDetailsReducer } from './reducers/productReducers'

const reducer = combineReducers({
    productList: productListReducer, // productList is a state
    productDetails: productDetailsReducer,
})

//const middleware = [thunk]

//const store = configureStore(reducer, initialState,
//    composeWithDevTools(applyMiddleware(...middleware)))
// ^^^ originally it was 'createStore'

const initialState = {} 

const store = configureStore({reducer, // redux-thunk is in Included Default Middleware
    preloadedState: initialState,
    })

export default store