import React, {useState, useEffect} from 'react';
import {Row, Col} from "reactstrap";
import {ChromePicker} from 'react-color'
import {Button, ButtonGroup} from "reactstrap";
import classNames from "classnames";
import {ThirdPartyAccount, accounts} from "trace-search";


function Colors(props) {
    

    const [titleColor, setTitleColor] = useState();
    const [backColor, setBackgroundColor] = useState();
    const [siteColor, setSiteColor] = useState();
    const [iconColor, setIconColor] = useState();
    const [chromeColor, setChromeColor] = useState();
    const [currentButton, setCurrentButton] = useState("Title");
    const [claimedAccounts, setClaimedAccounts] = useState({});

    const [showThemeFeature, setThemeFeature] = useState(false);
    const [showSiteFeature, setSiteFeature] = useState(true);

    const [colorProps, setColorProps] = useState([{
        "titleColor":"#FFFFFF",
        "backgroundColor":"#1E1D2A",
        "siteColor":"#26283A",
        "iconColor":"Default"
    }])

    /**
     * Monitor for new claimed accounts. Every time the accounts array is updated, re-render to show the proper tiles.
     */
    useEffect(() => {
        const loadAccounts = async () => {
        try {
            // Load all accounts from the database into memory
            await ThirdPartyAccount.loadAll();
            // setPlsRender((current) => !current);
        } catch (e) {
            console.error("Failed to load accounts from the database!");
            console.error(e);
            return {};
        }
        return accounts;
        };

        loadAccounts().then(() => {
        setClaimedAccounts(accounts);
        });

    }, [accounts]);

    function handleColorPicker(e){
        setChromeColor(e);
        console.log(currentButton);
        if (currentButton=="Title"){
            setTitleColor(e.hex);
            colorProps[0].titleColor = e.hex;
            props.onSelectLanguage(colorProps);
        }
        else if (currentButton=="Site"){
            setSiteColor(e.hex);
            colorProps[0].siteColor = e.hex;
            props.onSelectLanguage(colorProps);
        }
        else if (currentButton=="Icon"){
            setIconColor(e.hex);
            colorProps[0].iconColor = e.hex;
            props.onSelectLanguage(colorProps);
        }
        else if (currentButton=="Background"){
            setBackgroundColor(e.hex);
            colorProps[0].backgroundColor = e.hex;
            props.onSelectLanguage(colorProps);
        }
    }

    function handleClick(e){
        console.log(e.target.id);
        if (e.target.id=="title"){
            setCurrentButton("Title");
            
        }
        else if (e.target.id=="site"){
            setCurrentButton("Site");
        }
        else if (e.target.id=="background"){
            setCurrentButton("Background");
        }
        else if (e.target.id=="icon"){
            setCurrentButton("Icon");
        }
    }

    function handleSite(e){
        setThemeFeature(false);
        setSiteFeature(true);
    }

    function handleThemes(e){
        setThemeFeature(true);
        setSiteFeature(false);
    }

    function handleOver(e){
        e.target.style.backgroundColor = "revert";
  
        console.log("IN HEREEEEE");
    }


  return (
    <>
      <div className="popup">
           <div className="icon-wrap">
                <i className="tim-icons icon-simple-remove icon" onClick={props.closePopup}>
                </i>
            </div>

                <div className="colors" style={showSiteFeature ? {margin:"0px"} : null}>
                    <div className="toggle-containers" style={showSiteFeature ? {padding:"5px"} : null}>
                    <ButtonGroup
                        className="btn-group-toggle"
                        data-toggle="buttons"
                    >
                        <Button
                            tag="label"
                            color="info"
                            id="0"
                            size="lg"
                            className={classNames("btn-neutral")}
                            onClick={handleSite}
                        >
                            <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                Edit Sites
                            </span>
                        </Button>
                        <Button
                            color="info"
                            id="1"
                            size="lg"
                            tag="label"
                            className={classNames("btn-neutral")}
                            onClick={handleThemes}
                        >
                            <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                Edit Themes
                            </span>
                        </Button>
                    </ButtonGroup>

                {/* Theme Feature */}
                </div>
                    {showThemeFeature ?
                        <Row>
                            <Col>
                                <div className="options">
                                    <div id="title" className="myButton" style={currentButton=="Title"? {backgroundColor: `${titleColor}`,color:"white",opacity:1, border: "3px solid #dadada"} : {backgroundColor: `${titleColor}`,color:"white", opacity:.7}} onClick={handleClick}>
                                        Title Color
                                    </div>
                                    <div id="background" className="myButton" style={currentButton=="Background"? {backgroundColor: `${backColor}`,color:"white",opacity:1, border: "2px solid #dadada"}: {backgroundColor: `${backColor}`,color:"white", opacity:.7}} onClick={handleClick}>
                                        Background Color
                                    </div>
                                    <div id="site" className="myButton" style={currentButton=="Site"? {backgroundColor: `${siteColor}`,color:"white",opacity:1, border: "2px solid #dadada"} : {backgroundColor: `${siteColor}`,color:"white", opacity:.7}} onClick={handleClick}>
                                        Site Color
                                    </div>
                                    <div id="icon" className="myButton" style={currentButton=="Icon"? {backgroundColor: `${iconColor}`,color:"white",opacity:1, border: "2px solid #dadada"} : {backgroundColor: `${iconColor}`,color:"white", opacity:.7}} onClick={handleClick}>
                                        Icon Color
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <ChromePicker color={chromeColor} disableAlpha onChangeComplete={handleColorPicker} />
                            </Col>
                        </Row>
                        : null
                    }
                </div>

                {/* Site Feature */}
                <div className="add-site">
                    {showSiteFeature ?
                        <div className="sContainer">
                            <table className="siteTable">
                                {Object.values(claimedAccounts).map(item => (
                                    <tr className="siteTr">
                                        <td className="siteTd">
                                            <div className="add-remove-button">Add</div>
                                            <span className="site-info">{item.site.name}</span>: {item.userName}
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                        : null
                    }
                    
                </div>
          
            </div>
        </>
    );
}

export default Colors;

//https://www.tailorbrands.com/blog/logo-color-combinations
