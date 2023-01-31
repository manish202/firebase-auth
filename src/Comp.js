import {Link, useNavigate} from "react-router-dom";
import {useContext} from "react";
import { MyContext } from "./App";
import {app} from "./Auth";
import {DataContext} from "./MainData";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
const auth = getAuth(app);
function Login(){
  let navigate = useNavigate();
  let {showError} = useContext(MyContext);
  function validLogin(e){
    e.preventDefault();
    let {email,password} = e.target;
    if(!email.value.trim().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
      showError("invalid email",false);
    }else if(password.value.trim() === "" || password.value.length < 6){
      showError("password must be greater then 6 characters",false);
    }else{
      signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in 
        if(userCredential.user.emailVerified){
          showError("login successfully",true);
        }else{
          showError("login success. your email is not verified yet!",true);
        }
        setTimeout(() => {
          navigate("/maindata");
        }, 4000);
      })
      .catch((error) => {
        showError(`error code ${error.code} and message = ${error.message}`,false);
      });
    }
  }
  return <form autoComplete="off" onSubmit={validLogin}>
    <h1>Login</h1>
    <input type="email" name="email" className="input" placeholder="email address" />
    <input type="password" name="password" className="input" placeholder="create password" />
    <input type="submit" value="login" />
    <Link to="/signup">create account</Link>
  </form>
}
function Signup(){
  let {showError} = useContext(MyContext);
  let navigate = useNavigate();
  function validSignup(e){
    e.preventDefault();
    let {email,password,cpassword} = e.target;
    if(!email.value.trim().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
      showError("invalid email",false);
    }else if(password.value.trim() === "" || password.value.length < 6){
      showError("password must be greater then 6 characters",false);
    }else if(cpassword.value.trim() === ""){
      showError("please fill confirm password",false);
    }else if(password.value !== cpassword.value){
      showError("confirm password is wrong.",false);
    }else{
      createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        showError("account created successfully",true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        showError(`error code ${error.code} and message = ${error.message}`,false);
      });
      e.target.reset();
    }
  }
  return <form autoComplete="off" onSubmit={validSignup}>
    <h1>create account</h1>
    <input type="email" name="email" className="input" placeholder="email address" />
    <input type="password" name="password" className="input" placeholder="create password" />
    <input type="password" name="cpassword" className="input" placeholder="confirm password" />
    <input type="submit" value="create account" />
    <Link to="/">login</Link>
  </form>
}
function MyForm({task}){
  let {userData,inpch,insertData,updateData} = useContext(DataContext);
  let {showError} = useContext(MyContext);
  function submited(e){
      e.preventDefault();
      let {fname,lname,gender} = e.target;
      if(fname.value.trim() === ""){
        showError("first name is invalid",false);
      }else if(lname.value.trim() === ""){
        showError("last name is invalid",false);
      }else if(gender.value.trim() === ""){
        showError("gender is invalid",false);
      }else{
          let obj = {
              fname: fname.value,
              lname: lname.value,
              gender: gender.value
            }
            task === "add" ? insertData(obj) : updateData(obj);
      }
    }
  return <form onSubmit={submited} autoComplete="off">
  <h1>{task} your details</h1>
  <input type="text" className="input" value={userData.fname} onChange={inpch} name="fname" placeholder="first name" />
  <input type="text" className="input" value={userData.lname} onChange={inpch} name="lname" placeholder="last name" />
  <input type="text" className="input" value={userData.gender} onChange={inpch} name="gender" placeholder="gender" />
  <input type="submit" value="submit" />
</form>
}
function Table(){
  let {apidata,loading,setForm,del} = useContext(DataContext);
  return <table>
            <thead>
              <tr>
                <th>id</th>
                <th>fname</th>
                <th>lname</th>
                <th>gender</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="5">Loading...</td></tr>}
              {apidata.message === undefined ? apidata.map((val) => {
                return <tr key={val.id}><td>{val.id}</td><td>{val.fname}</td><td>{val.lname}</td><td>{val.gender}</td><td><button onClick={() => setForm(val)}>edit</button><button onClick={() => del(val.id)}>delete</button></td></tr>
              }) : <tr><td colSpan="5">{apidata.message}</td></tr>}
            </tbody>
        </table>
}
function Error404(){
  return <h1>oops! 404 page not found</h1>
}
export {Login,Signup,Error404,MyForm,Table};