import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./App.css"
import { routers } from "./router/router";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
 

  return (
    <>
   <div className='App'>
      <Router>
        <Routes>
          {routers.map((route) => {
           
              return (
                <Route key={route.path} path={route.path} element={<route.page />}>
                  {route.children &&
                    route.children.map((child) => (
                      <Route
                        key={child.path}
                        path={child.path}
                        element={<child.page />}
                      />
                    ))}
                </Route>
              );
            

       
          })}
        </Routes>
      </Router>
    </div>
    </>
  )
}

export default App
