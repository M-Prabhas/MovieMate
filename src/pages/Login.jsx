import React from 'react'
import {useState,useEffect} from 'react';
import {useNavigate} from "react-router-dom";
 import { useCookies } from 'react-cookie';
 import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
    const History = useNavigate();
    const [pwd,setpwd]=useState("");
    const [EmailId,setEmailId]=useState("");
    const [valid,setvalid]=useState(true);
    const [cookies, setCookies] = useCookies();
   
    const refer1=async()=>{
       console.log("pressed");
       if(EmailId===""){
         setvalid(false);
       }
     await axios.post('/login', {
         EmailId:EmailId ,
         password:pwd     
     })
     .then(res => {
       res = res.data;
       console.log(res,"data");
       if(res.success===true){
           console.log(res.id);
           console.log(res.history);
           setCookies("user",{id:res.id,username: res.username,email: res.email,history:res.history,password:res.password,image:res.image},{path: "/"})
           History(`/Home`);
         }else{
            console.log("error");
            setvalid(false);
            setEmailId("");
            setpwd("");
            }})
        .catch(error => {
          console.log(error);
        });
  
        
       }     




  return (
    <div className="Login">
        <div className="LoginSection">
           <h1>Sign-In</h1>  
           <br></br>
           <br></br>
           <input type="text" placeholder='Enter EmailId' required onChange={(e) => setEmailId(e.target.value)} value={EmailId}/>
           <input type='password' placeholder='Enter Password' required onChange={(e) => setpwd(e.target.value)}  value={pwd}/>
           <button onClick={refer1}>Sign-In</button>
           <br></br>
           <a href="/SignUp">Create Account</a>
           <br></br>
           <hr></hr>
           {!valid&&<div style={{color:"red",paddingleft:"5px",fontsize:"1.2rem"}}>Not correct UserName.</div>}
      <br></br>
      {!valid&&<div style={{color:"red",paddingleft:"5px",fontsize:"1.2rem"}}>Not correct Password.</div>}
        </div>
    </div>
  )
}

export default Login