import React, { useState, useRef, useEffect } from 'react';
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { useSearchParams } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { auth } from "../firebase/config"

const NewPasswordPage = () => {
    const [params] = useSearchParams();
    const oobCode = params.get("oobCode") || "";

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async () => {
        try{
            await verifyPasswordResetCode(auth, oobCode);
            await confirmPasswordReset(auth, oobCode, password);
            setMessage("Password has been reset! You can now log in.")
        } catch(err){
            setMessage("Reset link invalid or expired.");
        }
    };

    return(
        <div>
            <h1>Set Your New Password</h1>
            <input type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleReset}>Update Password</button>
            {message}
        </div>
    )

    
}

export default NewPasswordPage