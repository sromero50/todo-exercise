import './App.css';
import React from "react";
import Folder from './folder';
import ToDo from './todo';
import Edit from './edit';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Folder />} />
      <Route path="/folder/:name" element={<ToDo />} />
      <Route path="/edit/" element={<Edit />} />
     </Routes>
    </Router>
  );
}

export default App;
