import React from 'react';
import { Home, User } from 'lucide-react';
import './Feed.css';  

const FeedFooter = () => {

    return (
        <footer className="footer">
            <nav className="nav">
            <button className="icon-button">
                <Home size={44} />
            </button>
            <button className="icon-button">
                <User size={44} />
            </button>
            </nav>
        </footer>
    )
}
    
export default FeedFooter;