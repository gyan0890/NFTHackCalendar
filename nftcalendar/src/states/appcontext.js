import React, { createContext, useReducer } from 'react';
import { AppActions } from './actions';



function reducer(state, action) {
    switch (action.type) {
        case AppActions.SETWALLET:
            return {
                ...state,
                wallet: action.payload
            }
            break;

        default:
            return state;
    }
}

export const AppContext = createContext();
export const AppContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, { wallet: null });
    return (
        <AppContext.Provider value={[state, dispatch]}>
            {props.children}
        </AppContext.Provider>
    )
}