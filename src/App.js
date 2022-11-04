import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Login from './pages/Login';
import Admin from './pages/Admin';
import Customer from './pages/Customer';
import Engineer from './pages/Engineer';
import NotFound from './pages/NotFound'; 
import Unauth from './pages/Unauthorized';
import RequireAuth from './components/RequireAuth';

import '@coreui/coreui/dist/css/coreui.min.css';
import '@coreui/coreui/dist/js/coreui.min.js';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "bootstrap-icons/font/bootstrap-icons.css";

import './App.css';


// 1st week : // LOGIN/ SIGNUP page -> for 3 types of users
//  1. UI 2. API Integration 3. Final flow  

// 3 types of users : 

//  ADMIN : Log in , all tickets , all users -> give permisions to the user 

//  ENGINEER : Sign up , login after approval , edit tickets that are assigned to them -> edit the status 

// CUSTOMER : Sign up, log in, raise the ticket, edit the ticket status -> open/ close 
const ROLES = {
  'CUSTOMER': 'CUSTOMER', 
  'ADMIN': 'ADMIN', 
  'ENGINEER': 'ENGINEER'

}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      {/* Protected routes by require auth starts */}
        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin" element={<Admin />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.ENGINEER]} />}>
        <Route path="/engineer" element={<Engineer />} />
        </Route>
        {/* <Route element={<RequireAuth allowedRoles={[ROLES.CUSTOMER]}/>}> */}
        <Route path="/customer" element={<Customer />} />
        {/* </Route> */}
      {/* Protected routes by require auth end */}

        <Route path="/*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauth />} />
      </Routes>
    </Router>
  );
}

export default App;
