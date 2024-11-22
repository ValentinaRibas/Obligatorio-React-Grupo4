import React from 'react';
import { Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Feed.css';

const FeedHeader = () => {

const navigate = useNavigate();

return (
    <header className="header">
                <div className="header-content">
                <h1 className="title">Fakestagram Feed</h1>
                <div className="button-group">
                    <button className="icon-button">
                    <Heart color={"red"} size={34} />
                    </button>
                    <button className="icon-button" onClick={() => navigate('/create')}>
                    <Plus size={34} />
                    </button>
                </div>
                </div>
    </header>
)
}

export default FeedHeader;