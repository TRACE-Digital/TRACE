import React, { useState } from 'react';
import { Button, Row, Col, Form, FormGroup, Label, Input, } from 'reactstrap';
import axios from "axios";

// Github stuff
const owner = "TRACE-Digital"
const repo = "TRACE";
const labels = ["trace users"];
const team = ["jmcker", "charlorr", "isabelbattag", "cchan207", "jlmolskness", "cohenchris"]

const issueAlert = "Thank you for contacting us. Our team has been alerted. Your Github issue has been created at https://github.com/TRACE-Digital/TRACE/issues. \n\nClick OK to open your issue in another tab, CANCEL to stay.";

const RequestFeatureForm = (props) => {
    const [title, setTitle] = useState('');
    const [problem, setProblem] = useState('');
    const [solution, setSolution] = useState('');
    const [other, setOther] = useState('');
    const [showError, setShowError] = useState(false);

    function onTitleChange(e) {
        setShowError(false);
        setTitle(e);
    }

    function onProblemChange(e) {
        setShowError(false);
        setProblem(e);
    }

    function onSolutionChange(e) {
        setShowError(false);
        setSolution(e);
    }

    function onOtherChange(e) {
        setShowError(false);
        setOther(e);
    }

    function clearInputs() {
        var inputs = document.querySelectorAll("[id='input']");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
        }
        setTitle('');
        setProblem('');
        setSolution('');
        setOther('');
    }

    async function createIssue() {
        const description = ("**Is your feature request related to a problem? Please describe**\n")
            .concat(problem, "\n\n**Describe the solution you'd like**\n", solution,
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

    function handleSubmit(e) {
        console.log(title);
        console.log(problem);
        console.log(solution);
        console.log(other);

        if (title && solution) {
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
            <p className="description">Use this form to suggest a new feature for TRACE.</p>
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
                            <Label for="problem">Is your feature request related to a problem? Please describe.</Label>
                            <Input type="textarea" name="problem" id="input" onChange={(e) => onProblemChange(`${e.target.value}`)}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="solution">Describe the solution you'd like.</Label>
                            <span className="asterisk">*</span>
                            <Input type="textarea" name="solution" id="input" onChange={(e) => onSolutionChange(`${e.target.value}`)}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="other">Add any other context about the feature request here.</Label>
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

export default RequestFeatureForm;
