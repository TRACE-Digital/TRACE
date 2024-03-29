import React, { useState } from 'react';
import { Button, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';

import { ManualAccount, tags, supportedSites } from 'trace-search';

const AddPopup = (props) => {
    const [categories, setCategories] = useState([]);
    const [username, setUsername] = useState('');
    const [siteName, setSiteName] = useState('');
    const [url, setUrl] = useState('');
    const [showError, setShowError] = useState(false);
    const [dbError, setDbError] = useState(null);
    const [urlError, setUrlError] = useState(false);

    function handleClickCheckbox(e) {
        console.log(e.target.value);

        if (categories.includes(e.target.value)) {
            categories.splice(categories.indexOf(e.target.value), 1);
            setCategories([...categories]);
            console.log(categories);
        }
        else {
            categories.push(e.target.value);
            setCategories([...categories]);
            console.log(categories);
        }
    }

    function onSiteChange(e) {
        setDbError(null);
        setShowError(false);
        setSiteName(e);
    }

    function onUsernameChange(e) {
        setDbError(null);
        setShowError(false);
        setUsername(e);
    }

    function onUrlChange(e) {
        setDbError(null);
        setShowError(false);
        setUrl(e);
    }

    async function handleSubmit(e) {
        console.log(siteName);
        console.log(username);
        console.log(url);

        if (siteName && username && url) {
            if (url.includes("http")){
                    // Add to database
                let foundLogo;
                let foundColor;
                const domain = new URL(url).hostname;
                
                for (const site of Object.values(supportedSites)) {
                    if (site.url.includes(domain) || site.urlMain.includes(domain)) {
                        foundLogo = site.logoClass;
                        foundColor = site.logoColor;
                    }
                }

                foundLogo = foundLogo || 'fas fa-question fa-sm';
                const manualSite = { url: url, name: siteName, tags: categories, logoClass: foundLogo, logoColor: foundColor};
                const manualAccount = new ManualAccount(manualSite, username);
                setShowError(false);
                setUrlError(false);

                try {
                    await manualAccount.save();
                    props.closePopup();
                } catch (e) {
                    if (e.message === "Document update conflict") {
                        setDbError("Account already exists");
                    } else {
                    setDbError(e.message);
                    }
                }
            }
            else{
                setShowError(true);
                setUrlError(true);
            }
        }
        else {
            setShowError(true);
        }
        console.log(showError);
    }

    return (
        <div className="site-popup">
            <i className="tim-icons icon-simple-remove icon" onClick={props.closePopup}></i>
            <h1 className="title">{props.text}</h1>
            <Form>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="siteName">Site Name</Label><span className="asterisk">*</span>
                            <Input type="text" name="site" style={{color: "black"}} id="siteName" placeholder="eg. Instagram" onChange={(e) => onSiteChange(`${e.target.value}`)}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="username">Username</Label><span className="asterisk">*</span>
                            <Input type="text" name="username" style={{color: "black"}} id="username" placeholder="eg. coraychan" onChange={(e) => onUsernameChange(`${e.target.value}`)}/>
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <Label for="siteUrl">Account URL</Label><span className="asterisk">*</span>
                    <Input type="text" name="url" id="siteUrl" style={{color: "black"}} placeholder="eg. http://www.instagram.com/coraychan" onChange={(e) => onUrlChange(`${e.target.value}`)}/>
                </FormGroup>
                <Label for="tags">Tags</Label>
                <Row>
                    {tags.map(tag => (
                        <Col lg="3" xs="3" key={tag}>
                            <input
                                type="checkbox"
                                value={tag}
                                onClick={handleClickCheckbox}
                                defaultChecked={false}
                            />
                            <span className="checkbox-name">{tag}</span>
                        </Col>
                    ))}
                </Row>
            </Form>
            <div className="add-button-container">
                <Button onClick={handleSubmit}>
                    Add to Dashboard
                </Button>
                <div className={showError ? "error-message-visible" : "error-not-visible"}>
                    {urlError ? "Warning: url not valid" : "Warning: required fields are empty"}
                </div>
                <div className={dbError ? "error-message-visible" : "error-not-visible"}>
                    { dbError ? "Error: " + dbError : ""}
                </div>
            </div>
        </div>
    );
}

export default AddPopup;
