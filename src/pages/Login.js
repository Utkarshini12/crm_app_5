import { useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap'

// signup : userid, username, email, password
// login: userid, password 
function Login() {

    const [showSignup, setShowSignup] = useState(false);
    const [userType, setUserType] = useState("CUSTOMER");


    const toggleSignup = () => {
        setShowSignup(!showSignup);
    }

    const handleSelect = (e) => {
        setUserType(e);
    }
    return (
        <div className='bg-info d-flex justify-content-center align-items-center vh-100 '>
            <div className="card p-3 rounded-4 shadow-lg" style={{ width: 20 + 'rem' }}>
                <h4 className='text-center text-info'>{showSignup ? "Sign Up" : "Log In"}</h4>

                <form>
                    <div className="input-group">
                        <input type="text" className='form-control m-1' placeholder="User Id" />
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
                                <span className='my-1'>User Type</span>
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
                        <input type="password" className='form-control m-1' placeholder="Password" />
                    </div>

                    <div className="input-group">
                        <input type="submit" className='btn btn-info fw-bolder form-control m-1 text-white' value={showSignup ? "Sign Up" : "Log In "} />
                    </div>

                    <div className="m-1 text-center text-primary" onClick={toggleSignup}>
                        {showSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}

                    </div>



                </form>


            </div>
        </div>
    )
}

export default Login; 