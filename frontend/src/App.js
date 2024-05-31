import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import  Login  from "./components/Login.jsx";
import Users from "./pages/Users.jsx";
import Tools from "./pages/Tools.jsx";
import Clients from "./pages/Clients.jsx";
import Orders from "./pages/Orders.jsx";
import AddUser from "./pages/AddUser.jsx";
import EditUser from "./pages/EditUser.jsx";
import AddTool from "./pages/AddTool.jsx";
import EditTool from "./pages/EditTool.jsx";
import AddClient from "./pages/AddClient.jsx";
import EditClient from "./pages/EditClient.jsx";
import AddOrder from "./pages/AddOrder.jsx";
import EditOrder from "./pages/EditOrder.jsx";
import Search from "./pages/Search.jsx";

function App() {
  return (
    <div>
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/dashboard" element={<Dashboard/>} />

      <Route path="/users" element={<Users/>} />
      <Route path="/users/add" element={<AddUser/>} />
      <Route path="/users/edit/:id" element={<EditUser/>} />

      <Route path="/tools" element={<Tools/>} />
      <Route path="/tools/add" element={<AddTool/>} />
      <Route path="/tools/edit/:id" element={<EditTool/>} />

      <Route path="/clients" element={<Clients/>} />
      <Route path="/clients/add" element={<AddClient/>} />
      <Route path="/clients/edit/:id" element={<EditClient/>} />

      <Route path="/orders" element={<Orders/>} />
      <Route path="/orders/add" element={<AddOrder/>} />
      <Route path="/orders/edit/:id" element={<EditOrder/>} />

      <Route path="/search" element={<Search/>} />

     </Routes>
     </BrowserRouter>
    </div>
  );
};

export default App;