import React, { useState } from 'react';
import axios from "axios";
import { Button, Row, Col, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

// Github stuff
const owner = "TRACE-Digital"
const repo = "TRACE";
const labels = ["trace users"];
const team = ["jmcker", "charlorr", "isabelbattag", "cchan207", "jlmolskness", "cohenchris"]

const issueAlert = "Thank you for contacting us. Our team has been alerted. Your Github issue has been created at https://github.com/TRACE-Digital/TRACE/issues. \n\nClick OK to open your issue in another tab, CANCEL to stay.";

const RequestWebsiteForm = (props) => {    
    const [title, setTitle] = useState('');
    const [website, setWebsite] = useState('');
    const [other, setOther] = useState('');
    const [showError, setShowError] = useState(false);

    function onTitleChange(e) {
        setShowError(false);
        setTitle(e);
    }

    function onWebsiteChange(e) {
        setShowError(false);
        setWebsite(e);
    }

    function onOtherChange(e) {
        setShowError(false);
        setOther(e);
    } 

    async function createIssue() {
        const description = ("**What website do you want added to our automated search algorithm**\n")
            .concat(website,
            "\n\n**Additional context**\n", other);

        try {
            await axios.post(
                "https://yfv9ur3vth.execute-api.us-east-2.amazonaws.com/prod/issue",
                {
                  owner: owner,
                  repo: repo,
                  title: title,
                  body: description,
                  assignees: team,
                  labels: labels,
                }
              );
        } catch (error) {
            console.log(error);
        }
    }

    function clearInputs() {
        var inputs = document.querySelectorAll("[id='input']");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
        }
        setTitle('');
        setWebsite('');
        setOther('');
    }

    function handleSubmit(e) {
        console.log(title);
        console.log(website);
        console.log(other);

        if (title && website) {
            setShowError(false);
            createIssue();
            clearInputs();
            if (window.confirm(issueAlert)) {
                window.open("https://github.com/TRACE-Digital/TRACE/issues");
            }
        }
        else {
            setShowError(true);
        }
    }

    return (
        <div className="issue-forms">
            <h1 className="title">{props.text}</h1>
            <p className="description">Use this form to request support for a website in the automated search. 
            Please make sure the site you are requesting has a public profile page. We cannot find private accounts like emails or uber.</p>
            <Form>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="title">Title</Label><span className="asterisk">*</span>
                            <Input type="text" name="title" id="input" onChange={(e) => onTitleChange(`${e.target.value}`)}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="website">Please list the website(s) you would like supported</Label>
                            <span className="asterisk">*</span>
                            <Input type="textarea" name="website" id="input" onChange={(e) => onWebsiteChange(`${e.target.value}`)}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="other">Add any other context about the feature request here</Label>
                            <Input type="textarea" name="other" id="input" onChange={(e) => onOtherChange(`${e.target.value}`)}/>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
            <div className="submit-button-container">
                <Button onClick={handleSubmit}>
                    Submit
                </Button>
                <div className={showError ? "error-message-visible" : "error-not-visible"}>
                    Warning: required fields are empty
                </div>
            </div>
        </div>

    );
}

export default RequestWebsiteForm;