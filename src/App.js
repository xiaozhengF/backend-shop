import React from 'react'
import {useRoutes} from 'react-router-dom'
import routeRules from './Routes'
import './App.css'
export default function App() {
  const element=useRoutes(routeRules)
  return (
    <>
        {element}
    </>
  )
}
