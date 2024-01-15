import React, { useState } from "react";
import './SingleCard.css'

function SingleCard({disabled, item ,choiceHandeler, flipped}) {
    let [fORb , setfORb] = useState(false)
    const handeler = () =>{
        if (!disabled) {
            choiceHandeler(item)
        }
    }
    return (
        <div className="card">
            <div className={flipped ? "flipped" : ""}>
                <img className="front" src={item.src} alt="card front"/>
                <button className="back"  onClick={handeler} ></button>

            </div>
        </div>
    );
}

export default SingleCard;
