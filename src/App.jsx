import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartUpProfile from './components/StartUpProfile';
import AddEdit from './components/AddEdit';
import Navbar from './components/ui/Navbar';
import Home from './Home';
import Footer from './components/ui/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-900">
        <Navbar/>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/startups/:id" element={<StartUpProfile />} />
            <Route path="/add" element={<AddEdit />} />
            <Route path="/edit/:id" element={<AddEdit />} />
          </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;