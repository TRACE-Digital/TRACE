import React, { useState } from "react";
import axios from "axios";

import {
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";

// Github stuff
const owner = "TRACE-Digital";
const repo = "TRACE";
const labels = ["trace users"];
const team = ["jmcker", "charlorr", "isabelbattag", "cchan207", "jlmolskness", "cohenchris"]

const issueAlert =
  "Thank you for contacting us. Our team has been alerted. Your Github issue has been created at https://github.com/TRACE-Digital/TRACE/issues. \n\nClick OK to open your issue in another tab, CANCEL to stay.";

const BugReportForm = (props) => {
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [other, setOther] = useState("");
  const [showError, setShowError] = useState(false);

  function onTitleChange(e) {
    setShowError(false);
    setTitle(e);
  }

  function onProblemChange(e) {
    setShowError(false);
    setProblem(e);
  }

  function onStepsChange(e) {
    setShowError(false);
    setSteps(e);
  }

  function onExpectedChange(e) {
    setShowError(false);
    setExpected(e);
  }

  function onOtherChange(e) {
    setShowError(false);
    setOther(e);
  }

  async function createIssue() {
    const description = "**Describe the bug**\n".concat(
      problem,
      "\n\n**To Reproduce**\n",
      steps,
      "\n\n**Expected behavior**\n",
      expected,
      "\n\n**Additional context**\n",
      other
    );

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
      inputs[i].value = "";
    }
    setTitle("");
    setProblem("");
    setSteps("");
    setExpected("");
    setOther("");
  }

  function handleSubmit(e) {
    console.log(title);
    console.log(problem);
    console.log(steps);
    console.log(expected);
    console.log(other);

    if (title && problem && steps) {
      setShowError(false);
      createIssue();
      clearInputs();
      if (window.confirm(issueAlert)) {
        window.open("https://github.com/TRACE-Digital/TRACE/issues");
      }
    } else {
      setShowError(true);
    }
  }

  return (
    <div className="issue-forms">
      <h1 className="title">{props.text}</h1>
      <p className="description">
        Use this form to report a bug. Please be as detailed as possible to help
        us fix the issue quickly.
      </p>
      <Form>
        <Row form>
          <Col md={12}>
            <FormGroup>
              <Label for="title">Title</Label>
              <span className="asterisk">*</span>
              <Input
                type="text"
                name="title"
                id="input"
                onChange={(e) => onTitleChange(`${e.target.value}`)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={12}>
            <FormGroup>
              <Label for="problem">Please describe the bug.</Label>
              <span className="asterisk">*</span>
              <Input
                type="textarea"
                name="problem"
                id="input"
                onChange={(e) => onProblemChange(`${e.target.value}`)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={12}>
            <FormGroup>
              <Label for="steps">
                Please list the steps to reproduce the behavior.
              </Label>
              <span className="asterisk">*</span>
              <Input
                type="textarea"
                name="steps"
                id="input"
                onChange={(e) => onStepsChange(`${e.target.value}`)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={12}>
            <FormGroup>
              <Label for="expected">
                Please provide a clear and concise description of what you
                expected to happen.
              </Label>
              <Input
                type="textarea"
                name="expected"
                id="input"
                onChange={(e) => onExpectedChange(`${e.target.value}`)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={12}>
            <FormGroup>
              <Label for="other">
                Add any other context about the feature request here.
              </Label>
              <Input
                type="textarea"
                name="other"
                id="input"
                onChange={(e) => onOtherChange(`${e.target.value}`)}
              />
            </FormGroup>
          </Col>
        </Row>
      </Form>
      <div className="submit-button-container">
        <Button onClick={handleSubmit}>Submit</Button>
        <div
          className={showError ? "error-message-visible" : "error-not-visible"}
        >
          Warning: required fields are empty
        </div>
      </div>
    </div>
  );
};

export default BugReportForm;