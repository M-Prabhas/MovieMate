import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import "../styles/Profile.css";


const Profile = () => {
     const [img,setimg]=useState(false);
     const [cookies,setCookies]=useCookies();
     const [single,setsingle]=useState(false);
     const [menubar,setmenubar]=useState(false);
     const [newpassword,setnewpassword]=useState(false);
     const [newusername,setnewusername]=useState(false);
     const [statement,setstatement]=useState(false);
     const [email,setemail]=useState("");
     const [username,setusername]=useState("");
     const [password,setpassword]=useState("");
     const [confirm,setconfirm]=useState("");

     const handleclick=async (event)=>{
        await axios.post('/ChangeAvatar', {
           email:cookies.user.email,
           image:event.target.alt  
      })
      .then(res => {
        res = res.data.updatedUser;
        console.log(res,"data");
        if(res){
            setTimeout(() => {
              setCookies("user",{id:res._id,username: res.username,email: res.email,history:res.WatchHistory,password:res.password,image:res.image},{path: "/"})
              setimg(false);
            }, 1000);
          }else{
             console.log("error");
             }})
         .catch(error => {
           console.log(error);
         });
     }


const clearhistory=async ()=>{
  await axios.post('/clearhistory', {
    email:cookies.user.email 
})
.then(res => {
 res = res.data.updatedUser;
 console.log(res,"data");
 if(res){
       setstatement(true);
       setTimeout(() => {
        setCookies("user",{id:res._id,username: res.username,email: res.email,history:res.WatchHistory,password:res.password,image:res.image},{path: "/"})
        setstatement(false);
      }, 2000);
   }else{
      console.log("error");
      }})
  .catch(error => {
    console.log(error);
  });
}


const handlechangeusername= async ()=>{
  if(username==="" || email!==cookies.user.email){
    setnewusername(!newusername)
    console.log("nonew username")
  }else{
  await axios.post('/changeusername', {
    email:email, 
    username:username
})
.then(res => {
 res = res.data.updatedUser;
 console.log(res,"data");
 if(res){
       setstatement(true);
       setTimeout(() => {
        setCookies("user",{id:res._id,username: res.username,email: res.email,history:res.WatchHistory,password:res.password,image:res.image},{path: "/"})
        setstatement(false);
        setnewusername(!newusername)
      }, 2000);
   }else{
      console.log("error");
      }})
  .catch(error => {
    console.log(error);
  });
}
}

const handlechangepassword= async ()=>{
  if(password===confirm && email===cookies.user.email){
    await axios.post('/changepasswordtonew', {
      email:email ,
      password:password
  })
  .then(res => {
   res = res.data.updatedUser;
   console.log(res,"data");
   if(res){
         setstatement(true);
         setTimeout(() => {
          setCookies("user",{id:res._id,username: res.username,email: res.email,history:res.WatchHistory,password:res.password,image:res.image},{path: "/"})
          setstatement(false);
        }, 2000);
     }else{
        console.log("error");
        }})
    .catch(error => {
      console.log(error);
    });
  }else{
    setnewpassword(!newpassword);
    console.log("nonewpassword");
  }

}



  return (
    <div className="Profilepage">
    {statement&&<div className="statements">
      The changes have been saved successfully.
    </div>}
      <div className="Navbar">
        <strong>MovieMate</strong>
        <div className="menu" onClick={()=>setmenubar(!menubar)}>
           {!menubar? <i class="fi fi-br-menu-burger" ></i>:<i class="fi fi-br-x"></i>}
        </div>
        </div>
        { menubar&&
          <div className="menubar">
             <p onClick={clearhistory}>Clear WatchList</p>
             <p onClick={()=>setnewusername(!newusername)}>Change UserName</p>
             <p onClick={()=>setnewpassword(!newpassword)}>Change Password</p>
             {newusername&&<div className="changeusernameform">
             <h2>Change Username</h2>
                  <input type="text" value={email} onChange={(e)=>setemail(e.target.value)} placeholder='Enter the Email'></input>
                  <input type="text" value={username} onChange={(e)=>setusername(e.target.value)} placeholder="Enter New Username"></input>
                  <button onClick={handlechangeusername}>submit</button>
             </div>}
             {newpassword&&<div className="changepasswordform">
             <h2>Change Password</h2>
                  <input type="text" value={email} onChange={(e)=>setemail(e.target.value)} placeholder='Enter the Email'></input>
                  <input type="password" value={password} onChange={(e)=>setpassword(e.target.value)} placeholder='Enter the New Password'></input>
                  <input type="password" value={confirm} onChange={(e)=>setconfirm(e.target.value)} placeholder='Confirm Password'></input>
                  <button onClick={handlechangepassword}>submit</button>
             </div>}
          </div>
        }
        <div className="complete">
        <div className="details">
          <img src={process.env.PUBLIC_URL + `/${cookies.user.image}.jpg`}  alt="User Avatar"></img>
          <p><strong>{cookies.user.username}</strong></p>
          <p>{cookies.user.email}</p>
          <button onClick={()=>setimg(true)}>{img ? "Changing-Image" :"Change-Image"}</button>
          {img && <div className="glossary">
               <img src={process.env.PUBLIC_URL + '/0.jpg'} alt="0" onClick={handleclick}></img>
               <img src={process.env.PUBLIC_URL + '/1.jpg'}  alt="1" onClick={handleclick}></img>
               <img src={process.env.PUBLIC_URL + '/2.jpg'}  alt="2" onClick={handleclick}></img>
               <img src={process.env.PUBLIC_URL + '/3.jpg'}  alt="3" onClick={handleclick}></img>
               <img src={process.env.PUBLIC_URL + '/4.jpg'}  alt="4" onClick={handleclick}></img>
          </div>}
        </div>
      <div className="watchList">
                <h2 style={{color:"grey"}}>Your WatchList</h2>
              {!single && (cookies.user.history.length!==0) ? <div className="card">
                      <img src="##" alt="image"></img>
                      <p>MovieName</p>
                      <p>Cast</p>
                      <p><strong>IMDB Rating</strong></p>
                      <i className="fi fi-sr-caret-square-down" onClick={()=>setsingle(true)}></i>       
              </div>:<div>
              <p>No Movies Added</p>
              </div>}
           {single&&<div className="Listofmovies">
           <i className="fi fi-ss-caret-quare-up" onClick={()=>setsingle(false)}></i>
                     <img src="##" alt="image"></img>
                      <p>MovieName</p>
                      <p>Cast</p>
                      <p><strong>IMDB Rating</strong></p>
           </div>}
           </div>
           </div>
    </div>
  )
}

export default Profile