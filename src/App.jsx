import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
// import BookingPage from './pages/BookingPage';
import { Calendar } from "lucide-react";
import ListingPage from "./pages/ListingPage";
import BookingPage from "./pages/BookingPage";

import Listings from "./pages/Listings";
import Footer from "./components/Footer";


function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/listings/:id" element={<ListingPage />} />
          <Route path="/listingmap" element={<Listings/>} />
          

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking/:id" element={<BookingPage/>} />

          
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
