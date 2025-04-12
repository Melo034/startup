import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home"
import AddStartUp from "./Pages/AddStartUp";
import Startups from "./Pages/StartUps/[id]/Startups";
import StartUps from "./Pages/StartUps/StartUps";
import EditStartUp from "./Pages/EditStartUp";
import AboutStartUp from "./Pages/AboutStartUp";


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/startups" element={<StartUps/>} />
        
        <Route path="/startups/:id" element={<Startups />} />
        
        <Route path="/submit-startup" element={<AddStartUp />} />

        <Route path="/edit/:id" element={<EditStartUp/>} />

        <Route path="/about" element={<AboutStartUp/>} />
      </Routes>
    </>
  )
}

export default App
