import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home"
import AddStartUp from "./Pages/AddStartUp";
import Startups from "./Pages/StartUps/[id]/Startups";
import StartUps from "./Pages/StartUps/StartUps";
import EditStartUp from "./Pages/EditStartUp";


function App() {

  return (
    <>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />
        
        {/* Startup Listing Page */}
        <Route path="/startups" element={<StartUps/>} />
        
        {/* Individual Startup Details Page */}
        <Route path="/startups/:id" element={<Startups />} />
        
        {/* Admin Dashboard for Managing Startups */}
        <Route path="/submit-startup" element={<AddStartUp />} />

        <Route path="/edit/:id" element={<EditStartUp/>} />
      </Routes>
    </>
  )
}

export default App
