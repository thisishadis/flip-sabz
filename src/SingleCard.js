import React, { useState } from "react";
import './SingleCard.css'

function SingleCard({disabled, item ,choiceHandler, flipped}) {
    const handler = () =>{
        if (!disabled) {
            choiceHandler(item)
        }
    }
    return (
        <div className="card">
            <div className={flipped ? "flipped" : ""}>
                <img className="front" src={item.src} alt="card front"/>
                <button className="back"  onClick={handler} ></button>
            </div>
        </div>
    );
}

export default SingleCard;
