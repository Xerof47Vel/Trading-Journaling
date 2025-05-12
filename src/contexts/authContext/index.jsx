import React from 'react';
import {auth} from '../../Firebase/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
const AuthContext=React.createContext();


export function useAuth(){
    return React.useContext(AuthContext);
}


export function AuthProvider({children}){

const [currentUser,setCurrentUser]=React.useState(null);
const [userLoggedIn,setUserLoggedIn]=React.useState(false);
const [loading,setLoading]=React.useState(true);

useEffect(()=>{
const unsubscribe=onAuthStateChanged(auth,initialUser);
return unsubscribe;
},[]
)

async function initialUser(user){
    if(user){
        setCurrentUser({...user});
        setUserLoggedIn(true);
    }else{
        setCurrentUser(null);
        setUserLoggedIn(false);
    }
    setLoading(false);
}
const value={
    currentUser,
    userLoggedIn,
    loading
}
return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
)
}
