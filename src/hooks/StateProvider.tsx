import React, { createContext, useContext, useReducer } from "react";

interface StateContextType {
    state: any;
    dispatch: React.Dispatch<any>;
}

// Prepares the dataLayer
export const StateContext = createContext<StateContextType | undefined>(undefined);

interface StateProviderProps {
    reducer: React.Reducer<any, any>;
    initialState: any;
    children: React.ReactNode;
}

// Wrap our app and provide the Data layer
export const StateProvider = ({ reducer, initialState, children } : StateProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value: StateContextType = { state, dispatch };
  
    return (
        <StateContext.Provider value={value}>
            {children}
        </StateContext.Provider>
    );
};

// Pull information from the data layer
export const useStateValue = (): StateContextType => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error("useStateValue must be used within a StateProvider");
    }
    return context;
};