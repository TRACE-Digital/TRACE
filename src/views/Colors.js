import React, { useState, useEffect } from 'react';
import { Row, Col } from "reactstrap";
import { AlphaPicker, ChromePicker, CirclePicker, CompactPicker, SketchPicker, SliderPicker, TwitterPicker } from 'react-color'

function Colors(props) {

    const [titleColor, setTitleColor] = useState();
    const [backgroundColor, setBackgroundColor] = useState();
    const [siteColor, setSiteColor] = useState();
    const [iconColor, setIconColor] = useState();

    const [colorProps, setColorProps] = useState([{
        "titleColor":"#FFFFFF",
        "backgroundColor":"#1E1D2A",
        "siteColor":"#26283A",
        "iconColor":"Default"
    }])

    function handleTitleChange(colors) {
        setTitleColor(colors);
        colorProps[0].titleColor = colors.hex;
        props.onSelectLanguage(colorProps);
    }

    function handleBackgroundChange(colors) {
        setBackgroundColor(colors);
        colorProps[0].backgroundColor = colors.hex;
        props.onSelectLanguage(colorProps);
    }

    function handleSiteChange(colors) {
        setSiteColor(colors);
        colorProps[0].siteColor = colors.hex;
        props.onSelectLanguage(colorProps);
    }

    function handleIconChange(e) {
        setIconColor(e.hex);
        colorProps[0].iconColor = e.hex;
        props.onSelectLanguage(colorProps);
    }

  return (
    <>
      <div className="popup">
            <div className="title">Themes</div>
                <div className="colors">
                    <Row>
                        <Col>
                            <div className="color-div">
                                <div className ="popup-titles">Title</div>
                                <ChromePicker color={titleColor} disableAlpha onChangeComplete={handleTitleChange} />
                            </div>
                        </Col>
                        <Col>
                            <div className="color-div">
                                <div className ="popup-titles">Background</div>
                                <ChromePicker color={backgroundColor} disableAlpha onChangeComplete={ handleBackgroundChange } />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="color-div">
                                <div className ="popup-titles">Site Cards</div>
                                <ChromePicker color={siteColor} disableAlpha onChangeComplete={ handleSiteChange } />
                            </div>
                        </Col>
                        <Col>
                            <div className="color-div">
                                <div className ="popup-titles">Icons</div>
                                <ChromePicker color={iconColor} disableAlpha onChangeComplete={ handleIconChange } />
                            </div>
                        </Col>
                    </Row>
                </div>
                {/* <div>
                    <ul className="editor">
                        <img id = "Default" className={isDefaultSelected ? "color-choices-selected" : "color-choices"} src={require("assets/img/Default.png").default} onClick={handleClick}/>
                        <img id = "Blue" className={isBlueSelected ? "color-choices-selected" : "color-choices"} src={require("assets/img/Blue.png").default} onClick={handleClick}/>
                        <img id = "Purple" className={isPurpleSelected ? "color-choices-selected" : "color-choices"} src={require("assets/img/Purple.png").default} onClick={handleClick}/>
                        <img id = "Pink" className={isPinkSelected ? "color-choices-selected" : "color-choices"} src={require("assets/img/Pink.png").default} onClick={handleClick}/>
                    </ul>
                </div> */}
                
                {/* <div className="title">Add To Profile</div>
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
                    </div> */}
            </div>
        </>
    );
}

export default Colors;

//https://www.tailorbrands.com/blog/logo-color-combinations
