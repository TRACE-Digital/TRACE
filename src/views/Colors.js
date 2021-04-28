import React, { useState, useEffect } from 'react';
import { Row, Col } from "reactstrap";
import { ChromePicker } from 'react-color'
import { Button, ButtonGroup } from "reactstrap";
import classNames from "classnames";

import { ThirdPartyAccount,  ClaimedAccount, ManualAccount } from "trace-search";
// import { icon } from '@fortawesome/fontawesome-svg-core';


function Colors(props) {
    const [titleColor, setTitleColor] = useState(props.page.colorScheme.titleColor);
    const [backColor, setBackgroundColor] = useState(props.page.colorScheme.backgroundColor);
    const [siteColor, setSiteColor] = useState(props.page.colorScheme.siteColor);
    const [iconColor, setIconColor] = useState(props.page.colorScheme.iconColor);
    const [disabled, setDisabled] = useState(false);
    const [chromeColor, setChromeColor] = useState();
    const [, setPlsRender] = useState(false);
    const [currentButton, setCurrentButton] = useState("Title");
    const [showThemeFeature, setThemeFeature] = useState(false);
    const [showSiteFeature, setSiteFeature] = useState(true);
    const [colorProps, ] = useState([{
        "titleColor": "#FFFFFF",
        "backgroundColor": "#1E1D2A",
        "siteColor": "#26283A",
        "iconColor": "Default"
    }])



    

    // const [claimedAccounts, setClaimedAccounts] = useState({});
    // const [onProfile, setOnProfile] = useState(false);



    // Load the initial accounts that we need and
    // register for any future changes
    useEffect(() => {
        const triggerRender = () => {
            setPlsRender(prev => !prev);
        };

        const loadAccounts = async () => {
            try {
                // Load what we need from the database into memory
                await ClaimedAccount.loadAll();
                await ManualAccount.loadAll();

                setPlsRender(prev => !prev);
            } catch (e) {
                console.error("Failed to load accounts from the database!");
                console.error(e);
            }
            console.log(ThirdPartyAccount.accountCache.items);
            setTitleColor(props.page.colorScheme.titleColor);
            colorProps[0].titleColor = props.page.colorScheme.titleColor;
            setBackgroundColor(props.page.colorScheme.backgroundColor);
            colorProps[0].backgroundColor = props.page.colorScheme.backgroundColor;
            setSiteColor(props.page.colorScheme.siteColor);
            colorProps[0].siteColor = props.page.colorScheme.siteColor;
            setIconColor(props.page.colorScheme.iconColor);
            colorProps[0].iconColor = props.page.colorScheme.iconColor;
        }

        ClaimedAccount.accountCache.events.on('change', triggerRender);
        ManualAccount.accountCache.events.on('change', triggerRender);

        loadAccounts();

        const cleanup = () => {
            ClaimedAccount.accountCache.events.removeListener('change', triggerRender);
            ManualAccount.accountCache.events.removeListener('change', triggerRender);
        };

        return cleanup;
    }, []);

    const displayableAccounts = [].concat(
        Object.values(ClaimedAccount.accounts)
    ).concat(
        Object.values(ManualAccount.accounts)
    );





    // /**
    //  * Monitor for new claimed accounts. Every time the accounts array is updated, re-render to show the proper tiles.
    //  */
    // useEffect(() => {
    //     const loadAccounts = async () => {
    //     try {
    //         // Load all accounts from the database into memory
    //         await ThirdPartyAccount.loadAll();
    //         // setPlsRender((current) => !current);
    //     } catch (e) {
    //         console.error("Failed to load accounts from the database!");
    //         console.error(e);
    //         return {};
    //     }
    //     return accounts;
    //     };

    //     loadAccounts().then(() => {
    //     setClaimedAccounts(accounts);
    //     setTitleColor(props.page.colorScheme.titleColor);
    //     setBackgroundColor(props.page.colorScheme.backgroundColor);
    //     setSiteColor(props.page.colorScheme.siteColor);
    //     setIconColor(props.page.colorScheme.iconColor);
    //     });

    // }, [accounts]);


    function handleAdd(item) {
        console.log("ENTERED ADD");
        props.page.accounts.push(item);
        setPlsRender(prev => !prev);
        props.onUpdatePage(null);
    }

    function handleRemove(item) {
        console.log("ENTERED REMOVE");
        props.page.accounts.splice(props.page.accounts.indexOf(item), 1);
        setPlsRender(prev => !prev);
        console.log(props.page.accounts);
        props.onUpdatePage(null);
    }

    function handleDefaultIcon(e){
        setDisabled(true);
        setCurrentButton("Default Icon");
        colorProps[0].iconColor = "Default";
        props.onSelectLanguage(colorProps);
    }

    function handleCustomIcon(e){
        setDisabled(false);
        setCurrentButton("Custom Icon");
        setChromeColor(e.target.style.backgroundColor);
    }

    function handleColorPicker(e) {
        setChromeColor(e);
        console.log(currentButton);
        if (currentButton === "Title") {
            setTitleColor(e.hex);
            colorProps[0].titleColor = e.hex;
            props.onSelectLanguage(colorProps);
        }
        else if (currentButton === "Site") {
            setSiteColor(e.hex);
            colorProps[0].siteColor = e.hex;
            props.onSelectLanguage(colorProps);
        }
        else if (currentButton === "Custom Icon") {
            setIconColor(e.hex);
            colorProps[0].iconColor = e.hex;
            props.onSelectLanguage(colorProps);
        }
        else if (currentButton === "Background") {
            setBackgroundColor(e.hex);
            colorProps[0].backgroundColor = e.hex;
            props.onSelectLanguage(colorProps);
        }
    }

    function handleClick(e) {
        setDisabled(false);
        console.log(e.target.id);
        if (e.target.id === "title") {
            setCurrentButton("Title");
            setChromeColor(e.target.style.backgroundColor);
        }
        else if (e.target.id === "site") {
            setCurrentButton("Site");
            setChromeColor(e.target.style.backgroundColor);
        }
        else if (e.target.id === "background") {
            setCurrentButton("Background");
            setChromeColor(e.target.style.backgroundColor);
        }
        else if (e.target.id === "defaultIcon") {
            setCurrentButton("Default Icon");
        }
    }

    function handleSite(e) {
        setThemeFeature(false);
        setSiteFeature(true);
    }

    function handleThemes(e) {
        setThemeFeature(true);
        setSiteFeature(false);
    }

    return (
        <>
            <div className="popup">
                <div className="icon-wrap">
                    <i className="tim-icons icon-simple-remove icon" onClick={props.closePopup}>
                    </i>
                </div>

                <div className="colors" style={showSiteFeature ? { margin: "0px" } : null}>
                    <div className="toggle-containers" style={showSiteFeature ? { padding: "5px" } : null}>
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
                            <Col style={{"padding-right":"0px"}}>
                                <div className="options">
                                    <div id="title" 
                                        className="myButton" 
                                        style={currentButton === "Title" ? 
                                            {"box-shadow": "0 0 6px #ba54fa", backgroundColor: `${titleColor}`
                                            , color: (`${titleColor}` === "#FFFFFF" || `${titleColor}` === "#ffffff" ?  "black" :  "white")} : 
                                            { backgroundColor: `${titleColor}`, 
                                            color: (`${titleColor}` === "#FFFFFF" || `${titleColor}` === "#ffffff" ?  "black" :  "white")}} 
                                        onClick={handleClick}>
                                            Title Color
                                    </div>
                                    <div id="background" 
                                        className="myButton" 
                                        style={currentButton === "Background" ? 
                                            {"box-shadow": "0 0 6px #ba54fa", backgroundColor: `${backColor}`, 
                                            color: (`${backColor}` === "#FFFFFF" || `${backColor}` === "#ffffff" ?  "black" :  "white")} : 
                                            { backgroundColor: `${backColor}`, 
                                            color: (`${backColor}` === "#FFFFFF" || `${backColor}` === "#ffffff" ?  "black" :  "white")}} 
                                        onClick={handleClick}>
                                            Background Color
                                    </div>
                                    <div id="site" 
                                        className="myButton" 
                                        style={currentButton === "Site" ? 
                                            { "box-shadow": "0 0 6px #ba54fa", backgroundColor: `${siteColor}`, 
                                            color: (`${siteColor}` === "#FFFFFF" || `${siteColor}` === "#ffffff" ?  "black" :  "white")} : 
                                            {backgroundColor: `${siteColor}`, 
                                            color: (`${backColor}` === "#FFFFFF" || `${backColor}` === "#ffffff" ?  "black" :  "white")}} 
                                        onClick={handleClick}>
                                            Site Color
                                    </div>
                                    <div className="two-icon-buttons">
                                        <div id="defaultIcon" 
                                            className="company-colors" 
                                            style={currentButton === "Default Icon" ? 
                                                {"box-shadow": "0 0 6px #ba54fa", backgroundColor: `#ba54fa`, color: "white" } : 
                                                {backgroundColor: (`${colorProps[0].iconColor}` === "Default"  && currentButton !== "Custom Icon" ? `#ba54fa` : "grey"), color: "white"}} 
                                            onClick={handleDefaultIcon}>
                                                Default Icon
                                        </div>
                                        <div id="customIcon" 
                                            className="custom-colors" 
                                            style={currentButton === "Custom Icon"? 
                                                {"box-shadow": "0 0 6px #ba54fa", backgroundColor: `${iconColor}`, color: "white" } : 
                                                {backgroundColor: (`${colorProps[0].iconColor}` !== "Default" ? `${colorProps[0].iconColor}` : "grey"), color: "white"}} 
                                            onClick={handleCustomIcon}>
                                                Custom Icon
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col style={disabled ? {pointerEvents: "none", opacity: "0.4"} : null}>
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
                                {displayableAccounts.map(item => (
                                    <tr className="siteTr">
                                        <td className="siteTd">
                                            {props.page.accounts.includes(item) ?
                                                <div className="remove-button" onClick={() => { handleRemove(item) }}>Remove</div> :
                                                <div className="add-button" onClick={() => { handleAdd(item) }}>Add</div>}
                                            <div className="site-info">{item.site.name}: <span className="userName">{item.userName}</span></div>
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
