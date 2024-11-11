import React from 'react';
import { Home, User } from 'lucide-react';
import { useNavigate} from 'react-router-dom';
import './Feed.css';  

const FeedFooter = () => {

    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = storedUser?._id;
    
    return (
        <footer className="footer">
            <nav className="nav">
            <button className="icon-button" onClick={() => navigate('/')}>
                <Home size={44} />
            </button>
            <button className="icon-button"  onClick={() => navigate(`/profile/${currentUserId}`)}>
                <User size={44} />
            </button>
            </nav>
        </footer>
    )
}

export default FeedFooter;