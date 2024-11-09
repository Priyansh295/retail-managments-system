import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

export const ProtectedRouteClient = ({children}) => {
  const { currentUser } = useContext(AuthContext);
  if(!currentUser) {
        console.log("null inside");
        console.log(currentUser);
        return <Navigate to="/login" />
 }
 else {
    console.log(currentUser)
    return children;
 }
};

export const ProtectedRouteAdmin = ({children}) => {
  const { admin } = useContext(AuthContext);
  if(!admin) {
        console.log("null inside");
        console.log(admin);
        return <Navigate to="/login" />
 }
 else {
    console.log(admin)
    return children;
 }
};
