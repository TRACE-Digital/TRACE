import React, { useState, useEffect } from 'react';

function Colors(props) {
    const [isDefaultSelected, setDefaultSelected] = useState(true);
    const [isBlueSelected, setBlueSelected] = useState(false);
    const [isPurpleSelected, setPurpleSelected] = useState(false);
    const [isPinkSelected, setPinkSelected] = useState(false);

    function handleClick(e) {

        if (e.target.id == "Default"){
            setDefaultSelected(true);
            setBlueSelected(false);
            setPurpleSelected(false);
            setPinkSelected(false);
            props.onSelectLanguage("Default");
        }
        else if (e.target.id == "Blue"){
            setDefaultSelected(false);
            setBlueSelected(true);
            setPurpleSelected(false);
            setPinkSelected(false);
            props.onSelectLanguage("Blue");
        }
        else if (e.target.id == "Purple"){
            setDefaultSelected(false);
            setBlueSelected(false);
            setPurpleSelected(true);
            setPinkSelected(false);
            props.onSelectLanguage("Purple");
        }
        else {
            setDefaultSelected(false);
            setBlueSelected(false);
            setPurpleSelected(false);
            setPinkSelected(true);
            props.onSelectLanguage("Pink");
        }
    }

  return (
    <>
      <div className="popup">
            <div className="title">Themes</div>
                <div>
                    <ul className="editor">
                        <img id = "Default" className={isDefaultSelected ? "color-choices-selected" : "color-choices"} src={require("assets/img/Default.png").default} onClick={handleClick}/>
                        <img id = "Blue" className={isBlueSelected ? "color-choices-selected" : "color-choices"} src={require("assets/img/Blue.png").default} onClick={handleClick}/>
                        <img id = "Purple" className={isPurpleSelected ? "color-choices-selected" : "color-choices"} src={require("assets/img/Purple.png").default} onClick={handleClick}/>
                        <img id = "Pink" className={isPinkSelected ? "color-choices-selected" : "color-choices"} src={require("assets/img/Pink.png").default} onClick={handleClick}/>
                    </ul>
                </div>
                <div className="title">Add To Profile</div>
                    <div className="new-sites">
                        <ul className="new-sites-ul">
                                <li className = "new-sites-ul">Site 1</li>
                                <li className = "new-sites-ul">Site 2</li>
                                <li className = "new-sites-ul">Site 3</li>
                                <li className = "new-sites-ul">Site 4</li>
                                <li className = "new-sites-ul">Site 5</li>
                                <li className = "new-sites-ul">Site 6</li>
                                <li className = "new-sites-ul">Site 7</li>
                                <li className = "new-sites-ul">Site 8</li>
                                <li className = "new-sites-ul">Site 9</li>
                                <li className = "new-sites-ul">Site 10</li>
                                <li className = "new-sites-ul">Site 2</li>
                                <li className = "new-sites-ul">Site 3</li>
                                <li className = "new-sites-ul">Site 4</li>
                                <li className = "new-sites-ul">Site 5</li>
                                <li className = "new-sites-ul">Site 6</li>
                                <li className = "new-sites-ul">Site 7</li>
                                <li className = "new-sites-ul">Site 8</li>
                                <li className = "new-sites-ul">Site 9</li>
                                <li className = "new-sites-ul">Site 10</li>
                        </ul>
                    </div>
            </div>
        </>
    );
}

export default Colors;

//https://www.tailorbrands.com/blog/logo-color-combinations
