import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

// 1st week : // LOGIN/ SIGNUP page -> for 3 types of users
//  1. UI 2. API Integration 3. Final flow  

// 3 types of users : 

//  ADMIN : Log in , all tickets , all users -> give permisions to the user 

//  ENGINEER : Sign up , login after approval , edit tickets that are assigned to them -> edit the status 

// CUSTOMER : Sign up, log in, raise the ticket, edit the ticket status -> open/ close 

function App() {
  return (
    <div className="App">
      <Login />
    
    </div>
  );
}

export default App;
