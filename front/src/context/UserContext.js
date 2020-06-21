import React from "react";
import axios from 'axios';
import authConfig from '../config/auth';
import { authenticate, recoverPass, forgotPass } from "../actions/Auth";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return { ...state, isAuthenticated: true };
        case "SIGN_OUT_SUCCESS":
            return { ...state, isAuthenticated: false };
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function UserProvider({ children }) {
    var [state, dispatch] = React.useReducer(userReducer, {
        isAuthenticated: !!localStorage.getItem("id_token"),
    });

    return (
        <UserStateContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
}

function useUserState() {
    var context = React.useContext(UserStateContext);
    if (context === undefined) {
        throw new Error("useUserState must be used within a UserProvider");
    }
    return context;
}

function useUserDispatch() {
    var context = React.useContext(UserDispatchContext);
    if (context === undefined) {
        throw new Error("useUserDispatch must be used within a UserProvider");
    }
    return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut, forgotPassword, recoverPassword };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError) {
    setError(false);
    setIsLoading(true);
    console.log('logueando...')
    const displayLogingError = () => {
        setError(true);
        setIsLoading(false);
    }

    // if the 2 values exists, then proceed
    if (!!login && !!password) {

        authenticate({email:login, password:password})
            .then(({userInfo, tokens}) => {

                console.log('userInfo', userInfo)
                console.log('password', password)
                if(!userInfo || !tokens)
                    return displayLogingError()

                const { token } = tokens
                localStorage.setItem('id_token', token)
                setError(null)
                setIsLoading(false)
                dispatch({ type: 'LOGIN_SUCCESS' })
                console.log('logueado...')
                history.push('/app/dashboard')
            })
            .catch(error => {
                displayLogingError()
            })

    } else {
        displayLogingError()
    }
}

function signOut(dispatch, history) {
    localStorage.removeItem("id_token");
    dispatch({ type: "SIGN_OUT_SUCCESS" });
    history.push("/login");
}


function recoverPassword(email, token, newPassword, confirmPassword, history, setIsLoading, setError) {

    setIsLoading(true);

    if(newPassword !== confirmPassword) {
        setError('Passwords must be equals')
        return
    }

    const displayResetPassError = (message) => {
        setError(message || 'A problem occurs while updating your password :(');
        setIsLoading(false);
    }

    recoverPass({
        email,
        token,
        password: newPassword,
        password_confirmation: confirmPassword
    }).then(res => {
        console.log('res', res)
        setIsLoading(false);
        //history.push('/login')
    }).catch(err => {
        displayResetPassError(err.message)
    })

}

function forgotPassword(recoveryEmail, setAlert, setIsLoading, setError) {

    setIsLoading(true);

    const displayForgotPassError = (message) => {
        setError(message || 'A problem occurs :(');
        setIsLoading(false);
    }

    console.log('recoveryEmail', recoveryEmail)

    if(!recoveryEmail) return displayForgotPassError('You need a valid email address')

    forgotPass({email:recoveryEmail}).then(res => {
        setIsLoading(false)
        setAlert('Check your email to restore your password!')
    }).catch(err => {
        displayForgotPassError(err.message)
    })

}