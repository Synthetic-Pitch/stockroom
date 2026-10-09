import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Warehouse from "./pages/Warehouse";
import Deliveries from "./pages/Deliveries";
import SupplyRequest from "./pages/SupplyRequest";
import Customers from "./pages/Customers";
import Returns from "./pages/Returns";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/inventory" element={<Inventory/>}/>
        <Route path="/warehouse" element={<Warehouse/>}/>
        <Route path="/deliveries" element={<Deliveries/>}/>
        <Route path="/supply-request" element={<SupplyRequest/>}/>
        <Route path="/customers" element={<Customers/>}/>
        <Route path="/returns" element={<Returns/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path="/*" element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
