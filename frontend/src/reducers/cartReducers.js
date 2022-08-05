import { 
    CART_ADD_ITEM, CART_REMOVE_ITEM, 
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
    CART_CLEAR_ITEMS 
} from '../constants/cartConstants'



export const cartReducer = (state = { cartItems: [], shippingAddress: {}, paymentMethod: '' }, action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const item = action.payload // payload is a product
            const existItem = state.cartItems.find(x => x.product === item.product) //checking whether the product is in cartItems
            // x.product is an id, not an object
            if(existItem){
                return {
                    ...state,
                    cartItems: state.cartItems.map(x =>
                        x.product === existItem.product ? item : x)
                }

            }
            else{
                return{
                    ...state,
                    cartItems:[...state.cartItems, item] // adds product(item) to a cart
                }
            }

        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
                // x.product is an id, action.payload is an id of the product to be removed
                // all products except the product to be removed stay in cartItems
            }

        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            }

        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }

        case CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems: []
            }

        default:
            return state
    }
}