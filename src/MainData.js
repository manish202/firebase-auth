import {createContext, useEffect, useReducer} from "react";
import { getDatabase, ref, set, child, get, update, remove} from "firebase/database";
import {app} from "./Auth";
import {MyForm,Table} from "./Comp";
export let DataContext = createContext();
const db = getDatabase(app);
function MainData(){
  let reducer = (state,action) => {
    switch(action.type){
      case "FIRST_TIME":
        return {...state,apidata:action.data,loading:false}
      case "INPUT_CHANGE":
        let {name,value} = action.e.target;
        let userData = {...state.userData,[name]:value}
        return {...state,userData}
      case "RESET_FORM":
        return {...state,userData:{id:"",fname:"",lname:"",gender:""},reload: !state.reload,editForm:false}
      case "EDIT_TASK":
        return {...state,userData:action.val,editForm:true}
      case "UPDATE_DATA":
        update(ref(db, 'users/' + state.userData.id), action.obj);
        return {...state,userData:{id:"",fname:"",lname:"",gender:""},reload: !state.reload,editForm:false}
      default:
        return state;
    }
  }
  let inpch = (e) => {
    dispatch({type:"INPUT_CHANGE",e});
  }
  let insertData = (obj) => {
    let id = (Math.random()*10000).toFixed();
    set(ref(db, 'users/' + id), obj);
    dispatch({type:"RESET_FORM"});
  }
  let updateData = (obj) => {
    dispatch({type:"UPDATE_DATA",obj});
  }
  let setForm = (val) => {
    dispatch({type:"EDIT_TASK",val});
  }
  let del = (id) => {
    remove(ref(db, 'users/' + id));
    dispatch({type:"RESET_FORM"});
  }
  let [state,dispatch] = useReducer(reducer,{apidata:[],reload:true,loading:true,editForm:false,userData:{id:"",fname:"",lname:"",gender:""},inpch,insertData,updateData,setForm,del});
  useEffect(() => {
    get(child(ref(db), `users/`)).then((snapshot) => {
      if (snapshot.exists()) {
        let arr = [];
        let dta = snapshot.val();
        for(let i in dta){
          arr.push({id:i,...dta[i]});
        }
        dispatch({type:"FIRST_TIME",data:arr});
      } else {
        dispatch({type:"FIRST_TIME",data:{message:"no records found"}});
      }
    }).catch((error) => {
      dispatch({type:"FIRST_TIME",data:{message:error}});
    });
  },[state.reload]);
  return <DataContext.Provider value={{...state,}}>
        {state.editForm ? <MyForm task="edit" /> : <MyForm task="add" />}
        <Table />
  </DataContext.Provider>
}
export default MainData;