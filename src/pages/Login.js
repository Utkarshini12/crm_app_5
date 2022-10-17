import { useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { userSignin } from '../api/auth'

// signup : userid, username, email, password
// login: userid, password 

/*
POST API 
1. Grab the data 
2. Store the data 
3. Call the api */

/*
POST API SIGNUP
1. Grab the data : userid, username, email, usertype, password
2. Store the data : username, email
3. Call the api */
function Login() {

    const [showSignup, setShowSignup] = useState(false);
    const [userType, setUserType] = useState("CUSTOMER");
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();


    const updateSignupData = (e) => {
        if (e.target.id === "userid") {
            setUserId(e.target.value)
        } else if (e.target.id === "password") {
            setPassword(e.target.value)
        }

    }

    const signupFn = () => {
        // prevent default 
        // data : userid, name, email, password, usertype
        // call teh api and pass data 
        // Display the successful message 
        console.log("Sign up button triggered")
    }

    const loginFn = (e) => {
        e.preventDefault();

        const data = {
            userId: userId,
            password: password
        }

        userSignin(data).then((response) => {
            // setItem(name, value)
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("userTypes", response.data.userTypes);
            localStorage.setItem("userStatus", response.data.userStatus);
            localStorage.setItem("token", response.data.accessToken);
            if (response.data.userTypes === "CUSTOMER")
                navigate('/customer')
            else if (response.data.userTypes === "ENGINEER")
                navigate('/engineer')
            else if (response.data.userTypes === "ADMIN")
                navigate('/admin')
            else
                navigate("/")


        }).catch((error) => {
            console.log(error);
            setMessage(error.response.data.message)
        })

    }




    const toggleSignup = () => {
        setShowSignup(!showSignup);
    }

    const handleSelect = (e) => {
        setUserType(e);
    }
    return (
        <div className='bg-info d-flex justify-content-center align-items-center vh-100 '>
            <div className="card p-3 rounded-4 shadow-lg" style={{ width: 20 + 'rem' }}>
                <h4 className='text-center text-info'>{showSignup ? "Sign Up" : "Sign In"}</h4>

                <form onSubmit={showSignup ? signupFn : loginFn}>
                    <div className="input-group">
                        <input type="text" className='form-control m-1' placeholder="User Id" value={userId} onChange={updateSignupData} id="userid" />
                    </div>
                    {
                        showSignup &&
                        <>
                            <div className="input-group">
                                <input type="text" className='form-control m-1' placeholder="Username" />
                            </div>
                            <div className="input-group">
                                <input type="email" className='form-control m-1' placeholder="Email" />
                            </div>
                            <div className="d-flex justify-content-between m-1">
                                <span className='my-1'>User Types</span>
                                <DropdownButton
                                    align="end"
                                    title={userType}
                                    id="userType"
                                    variant="light"
                                    onSelect={handleSelect}
                                >
                                    <Dropdown.Item eventKey="CUSTOMER">CUSTOMER</Dropdown.Item>
                                    <Dropdown.Item eventKey="ENGINEER">ENGINEER</Dropdown.Item>

                                </DropdownButton>

                            </div>


                        </>
                    }
                    <div className="input-group">
                        <input type="password" className='form-control m-1' placeholder="Password" id="password" value={password} onChange={updateSignupData} />
                    </div>

                    <div className="input-group">
                        <input type="submit" className='btn btn-info fw-bolder form-control m-1 text-white' value={showSignup ? "Sign Up" : "Sign In "} />
                    </div>

                    <div className="m-1 text-center text-primary clickable" onClick={toggleSignup}>
                        {showSignup ? "Already have an account? Signin" : "Don't have an account? Sign Up"}

                    </div>
                    <div className="text-center text-danger">{message}</div>



                </form>


            </div>
        </div>
    )
}

export default Login; 