import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from "reactstrap";
import { ChromePicker } from 'react-color'
import { Button, ButtonGroup } from "reactstrap";
import classNames from "classnames";
import NotificationAlert from "react-notification-alert";

import { ThirdPartyAccount,  ClaimedAccount, ManualAccount } from "trace-search";
import BadWordsFilter from 'bad-words';

const filter = new BadWordsFilter();
filter.addWords('facebook');
filter.addWords('thisisnotallowed');

function Colors(props) {

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

    const notificationAlertRef = useRef(null);
    const toast = (message, type) => {
    var options = {};
    options = {
        place: "bc",
        message: (<span>{message}</span>),
        type: type,
        autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
    }

    // const [claimedAccounts, setClaimedAccounts] = useState({});
    // const [onProfile, setOnProfile] = useState(false);

    // if (false) {
    //     setColorProps(false);
    // }


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
    displayableAccounts.sort((a, b) => a.site.name.localeCompare(b.site.name));





    function handleAdd(item) {
        console.log("ENTERED ADD");

        const values = [item.url, item.site.name, item.userName, item.site.url];
        for (const value of values) {
            if (filter.isProfane(value)) {
                const cleaned = filter.clean(value);
                toast(`Could not add ${item.site.name} - @${item.userName}!\n\nThe following field contains content not allowed on public pages:\n    '${value}'\n    '${cleaned}'`, "danger");
                return;
            }
        }

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
        props.page.colorScheme.iconColor = "Default";
        setPlsRender(prev => !prev);
        props.onSelectLanguage(null);
    }

    function handleCustomIcon(e){
        setDisabled(false);
        setCurrentButton("Custom Icon");
        setChromeColor(props.page.colorScheme.iconColor);
    }

    function handleColorPicker(e) {
        setChromeColor(e);

        if (currentButton === "Title") {
            props.page.colorScheme.titleColor = e.hex;
            setPlsRender(prev => !prev);
            props.onSelectLanguage(null);
        }
        else if (currentButton === "Site") {
            props.page.colorScheme.siteColor = e.hex;
            setPlsRender(prev => !prev);
            props.onSelectLanguage(null);

        }
        else if (currentButton === "Custom Icon") {
            // props.page.colorScheme.iconColor = e.hex;
            props.page.colorScheme.iconColor = e.hex;
            setPlsRender(prev => !prev);
            props.onSelectLanguage(null);

        }
        else if (currentButton === "Background") {
            props.page.colorScheme.backgroundColor = e.hex;
            setPlsRender(prev => !prev);
            props.onSelectLanguage(null);
        }


    }

    function handleClick(e) {
        setDisabled(false);

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
            <div className="react-notification-alert-container">
                <NotificationAlert ref={notificationAlertRef} />
            </div>
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
                                            {"box-shadow": "0 0 6px #ba54fa", backgroundColor: `${props.page.colorScheme.titleColor}`
                                            , color: (`${props.page.colorScheme.titleColor}` === "#FFFFFF" || `${props.page.colorScheme.titleColor}` === "#ffffff" ?  "black" :  "white")} :
                                            { backgroundColor: `${props.page.colorScheme.titleColor}`,
                                            color: (`${props.page.colorScheme.titleColor}` === "#FFFFFF" || `${props.page.colorScheme.titleColor}` === "#ffffff" ?  "black" :  "white")}}
                                        onClick={handleClick}>
                                            Title Color
                                    </div>
                                    <div id="background"
                                        className="myButton"
                                        style={currentButton === "Background" ?
                                            {"box-shadow": "0 0 6px #ba54fa", backgroundColor: `${props.page.colorScheme.backgroundColor}`,
                                            color: (`${props.page.colorScheme.backgroundColor}` === "#FFFFFF" || `${props.page.colorScheme.backgroundColor}` === "#ffffff" ?  "black" :  "white")} :
                                            { backgroundColor: `${props.page.colorScheme.backgroundColor}`,
                                            color: (`${props.page.colorScheme.backgroundColor}` === "#FFFFFF" || `${props.page.colorScheme.backgroundColor}` === "#ffffff" ?  "black" :  "white")}}
                                        onClick={handleClick}>
                                            Background Color
                                    </div>
                                    <div id="site"
                                        className="myButton"
                                        style={currentButton === "Site" ?
                                            { "box-shadow": "0 0 6px #ba54fa", backgroundColor: `${props.page.colorScheme.siteColor}`,
                                            color: (`${props.page.colorScheme.siteColor}` === "#FFFFFF" || `${props.page.colorScheme.siteColor}` === "#ffffff" ?  "black" :  "white")} :
                                            {backgroundColor: `${props.page.colorScheme.siteColor}`,
                                            color: (`${props.page.colorScheme.siteColor}` === "#FFFFFF" || `${props.page.colorScheme.siteColor}` === "#ffffff" ?  "black" :  "white")}}
                                        onClick={handleClick}>
                                            Site Color
                                    </div>
                                    <div className="two-icon-buttons">
                                        <div id="defaultIcon"
                                            className="company-colors"
                                            style={currentButton === "Default Icon" ?
                                                {"box-shadow": "0 0 6px #ba54fa", backgroundColor: `#ba54fa`, color: "white" } :
                                                {backgroundColor: (`${props.page.colorScheme.iconColor}` === "Default"  && currentButton !== "Custom Icon" ? `#ba54fa` : "grey"), color: "white"}}
                                            onClick={handleDefaultIcon}>
                                                Default Icon
                                        </div>
                                        <div id="customIcon"
                                            className="custom-colors"
                                            style={currentButton === "Custom Icon"?
                                                {"box-shadow": "0 0 6px #ba54fa", backgroundColor: `${props.page.colorScheme.iconColor}`, color: "white" } :
                                                {backgroundColor: (`${props.page.colorScheme.iconColor}` !== "Default" ? `${props.page.colorScheme.iconColor}` : "grey"), color: "white"}}
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
                                    <tr key={item.id} className="siteTr">
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
