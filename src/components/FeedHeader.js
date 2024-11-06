import React from 'react';
import { Plus, Heart } from 'lucide-react';
import './Feed.css';  

const FeedHeader = () => {

return (
    <header className="header">
                <div className="header-content">
                <h1 className="title">Fakestagram Feed</h1>
                <div className="button-group">
                    <button className="icon-button">
                    <Heart color={"red"} size={34} />
                    </button>
                    <button className="icon-button">
                    <Plus size={34} />
                    </button>
                </div>
                </div>
    </header>
)
}

export default FeedHeader;