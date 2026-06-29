import React, { createContext, useContext, useReducer } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD":
            var data = [...state, { product_id: action.product_id, name: action.name, category: action.category, img: action.img, price: action.price, discount: action.discount, discount_price: action.discount_price, size: action.size, color: action.color, shippingCharge: action.shippingCharge, quantity: action.quantity }]
            localStorage.setItem("orders", JSON.stringify(data))
            return data


        case "UPDATE":
            var arr = [...state]
            arr.find((product, index) => {
                if (product.product_id === action.product_id) {
                    arr[index] = { ...product, quantity: action.quantity }
                    localStorage.setItem("orders", JSON.stringify(arr))
                    return arr
                }

            })
            return arr

        case "REMOVE":
            var newArr = [...state]
            newArr.splice(action.index, 1)
            localStorage.setItem("orders", JSON.stringify(newArr))
            return newArr;

        case "CLEAR":
            localStorage.removeItem('orders')
            return [];

        default:
            console.log("Error in Reducer")
    }
}

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, [], () => {
        const localData = localStorage.getItem('orders');
        return localData ? JSON.parse(localData) : [];
    });
    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    )
}

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);