// Shared form data among auth panels eg. login, signup
export const formDataPass = {emailPreLogin: null, transition: false}

// Should auth panel displayed?
// authStatus provides whether user loggedIn or not and navbar button text
const initialState = {
    displayPanel: false,
    authStatus: {loggedIn: false, buttonText: 'Login'}
}

const authReducer = (state = initialState, { type, payload }) => {
    switch (type) {

        case 'auth/showPanel':
            return { ...state, displayPanel: true}
        case 'auth/hidePanel':
            return { ...state, displayPanel: false}
        case 'auth/togglePanel':
            return { ...state, displayPanel: !state.displayPanel}
        case 'auth/setStatus':
            return { ...state, authStatus: payload }
        default:
            return state
        }
}
export default authReducer