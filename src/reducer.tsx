export type InitialState = {
    user_details: Object,
}

export type ActionState = {
    type: string,
    payload: any
}

export const initialState = {
    user_details : {},
};

const reducer = (state: InitialState, action: ActionState) => {

    // console.log(state, action);
    

    switch(action.type) {

        case 'SET_USER':
            return {
                ...state,
                user_details: action.payload
            }

        case 'LOGOUT_USER':
            return {
                ...state,
                user_details: {}
            }
        
        default:
            return state;
    }
};

export default reducer;