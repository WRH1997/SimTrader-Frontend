import React from "react";
import { useNavigate } from "react-router-dom";


export default function Login(){

    const nav = useNavigate();

    const VerifyUser = async () => {
        try{
            let username = document.getElementById('username').value;
            let pwd = document.getElementById('pwd').value;
            let data = await fetch('https://yhnrl7h7f8.execute-api.us-east-1.amazonaws.com/Test/auth/login', {
                method: 'POST',
                body: JSON.stringify({"username": username, "password": pwd})
            });
            let res = await data.json();
            if(res['statusCode']==200){
                localStorage.clear();
                localStorage.setItem("user", username);
                nav('/Homepage');
            }
            else{
                alert("Error: Check Browser Console Logs");
            }
        }
        catch(Exception){
            console.log(Exception);
        }
    }

    return(
        <div>
            <center>
                Username: <input type='text' id='username'></input>
                <br></br><br></br>
                Password: <input type='password' id='pwd'></input>
                <br></br><br></br>
                <input type='button' value='Log In' onClick={VerifyUser}></input>
                <hr></hr>
                <br></br><br></br>
                <a href='/signup'>Sign Up</a>
            </center>
        </div>
    )
}