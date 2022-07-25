// a reducer is a function that takes in a state and action and manipulates the state and it returns
// a new copy of the state to a store, so it updates the store
// example of an action: load data

import { 
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL
 } from '../constants/productConstants'

export const productListReducer = (state = { products: []}, action) => {
    switch(action.type){
        case PRODUCT_LIST_REQUEST: // when the products are loading
            return { loading: true, products: [] }
            //^^^ by setting 'loading' to 'true' I'm letting users know that their request is being executed

        case PRODUCT_LIST_SUCCESS: // it returned data
            return { loading: false, products: action.payload } // I get action.payload from an API

        case PRODUCT_LIST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}



export const productDetailsReducer = (state = { product: {reviews: []}}, action) => {
    switch(action.type){
        case PRODUCT_DETAILS_REQUEST: // when the product is loading
            return { loading: true, ...state }
            //^^^ by setting 'loading' to 'true' I'm letting users know that their request is being executed

        case PRODUCT_DETAILS_SUCCESS: // it returned data
            return { loading: false, product: action.payload } // I get action.payload from an API

        case PRODUCT_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}