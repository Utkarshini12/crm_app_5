import {useNavigate} from 'react-router-dom';

import Not from '../static/Not.svg';

function NotFound(){
    const navigate = useNavigate(); 

    const goBack = () => {
        navigate(-1)
    }

    return (
        <div className='bg-light vh-100 d-flex justify-content-center align-items-center text-center'>
            <div>
                <h1>Not Found!</h1>
            
                <img src={Not} alt="not found" />
                <p className='lead fw-bolder m-1'>Hmm.. The page you are looking for does not exist </p>
                <button className='btn btn-info text-white m-1 p-2' onClick={goBack}>Go Back </button>
            </div>
         
        </div>
    )
}

export default NotFound; 