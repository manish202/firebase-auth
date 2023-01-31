import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Login,Signup,Error404} from "./Comp";
import {createContext, useReducer} from "react";
import MainData from "./MainData";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import {app} from "./Auth";
export let MyContext = createContext();
function App(){
  let reducer = (state,action) => {
    switch(action.type){
      case "SHOW_MESSAGE":
        return {...state,showMessage:{msg:action.msg,status:action.status,hide:action.hide}}
      case "LOGIN_LOGOUT":
        return {...state,isLogin: action.msg}
      default:
        return state;
    }
  }
  onAuthStateChanged(getAuth(app), (user) => {
    if (user) {
      // User is signed in
      dispatch({type:"LOGIN_LOGOUT",msg:true});
    } else {
      // User is signed out
      dispatch({type:"LOGIN_LOGOUT",msg:false});
    }
  });
  let [state,dispatch] = useReducer(reducer,{showMessage:{msg:"",status:false,hide:true},isLogin:false});
  let showError = (msg,status) => {
    dispatch({type:"SHOW_MESSAGE",msg,status,hide:false});
    setTimeout(() => {
      dispatch({type:"SHOW_MESSAGE",msg,status,hide:true});
    }, 5000);
  }
  return <MyContext.Provider value={{...state,showError}}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={state.isLogin ? <MainData /> : <Login />} />
              <Route path="/signup" element={state.isLogin ? <MainData /> : <Signup />} />
              <Route path="/maindata" element={state.isLogin ? <MainData /> : <Login />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
            {!state.showMessage.hide && <div className={state.showMessage.status ? "success":"error"}>{state.showMessage.msg}</div>}
          </BrowserRouter>
        </MyContext.Provider>
}
export default App;