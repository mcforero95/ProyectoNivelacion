import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";  // Navbar persistente
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";

const App = () => {
  return (
    <Router>
      {/* Navbar se mantiene en todas las páginas */}
      <Navbar />  
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
