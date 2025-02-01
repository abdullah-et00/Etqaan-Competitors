import { Navigate,Outlet } from "react-router-dom";
import React, { useState } from 'react'

export default function PrivateRoute({isProtectedRoute}) {
    //const {currentUser} = useSelector((state)=>state.user)
    const [isProtected,setIsProtected]=useState(isProtectedRoute);
    return (
        isProtected ? <Outlet/>: <Navigate to='/'/>
    )
}
