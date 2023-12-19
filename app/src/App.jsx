import { useState, useEffect } from 'react'
import './App.css'
import Login from './Components/Login'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import axios from 'axios'
import { auth } from './Components/request'

function App() {
  const [state, setState] = useState(false)

  useEffect(()=>{
    const authenticate = () => {
      let accessToken = localStorage.getItem("accessToken");
      let refreshToken = localStorage.getItem("refreshToken");
      let id = localStorage.getItem('userId')
      const headers = {
        access: accessToken,
        refresh: refreshToken,
      };
      if (!accessToken && !refreshToken) {
        setState(false);
      }else if(!id){
        setState(false);
      } else {
        axios
          .post(`${auth.authenticate}/${id}`, {}, { headers })
          .then((res) => {
              localStorage.setItem("accessToken", res.data.accessToken);
              setState(true);
          })
          .catch((err) => {
            console.log(err)
            setState(false)
          });
        
      }
    };
    authenticate();
  },[state])


  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={state ? <Dashboard/> : <Login/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
