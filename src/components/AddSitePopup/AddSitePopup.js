import React, { useState } from 'react';
import { Button, Row, Col, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import { tags } from 'trace-search';

const Popup = (props) => {
    const [categories, setCategories] = useState([]);
    const [username, setUsername] = useState('');
    const [site, setSite] = useState('');
    const [url, setUrl] = useState('');
    const [showError, setShowError] = useState(false);

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
        setShowError(false);
        setSite(e);
    }

    function onUsernameChange(e) {
        setShowError(false);
        setUsername(e);
    }

    function onUrlChange(e) {
        setShowError(false);
        setUrl(e);
    }

    function handleSubmit(e) {
        console.log(site);
        console.log(username);
        console.log(url);

        if (site && username && url) {
            // Add to database
            setShowError(false);
            props.closePopup();
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
                            <Input type="text" name="site" id="input" placeholder="eg. Instagram" onChange={(e) => onSiteChange(`${e.target.value}`)}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="username">Username</Label><span className="asterisk">*</span>
                            <Input type="text" name="username" id="input" placeholder="eg. coraychan" onChange={(e) => onUsernameChange(`${e.target.value}`)}/>
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <Label for="siteUrl">Account URL</Label><span className="asterisk">*</span>
                    <Input type="text" name="url" id="input" placeholder="eg. www.instagram.com/coraychan" onChange={(e) => onUrlChange(`${e.target.value}`)}/>
                </FormGroup>
                <Label for="tags">Tags</Label>
                <Row>
                    {tags.map(tag => (
                        <Col lg="3" key={tag}>
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
                    Warning: required fields are empty
                </div>
            </div>
        </div>
    );
}

export default Popup;