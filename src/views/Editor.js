import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

function Editor() {
  return (
    <>
    <div className="content">

    <div className="editor-title">
      ISABEL BATTAGLIOLI
    </div>
       <Row>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-instagram"></i> </div>
              <div className = "editor-handle-name"> @INSTAGRAM HANDLE</div>
              <div className = "editor-link"> www.instagram.com </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-facebook-square"></i> </div>
              <div className = "editor-handle-name"> @FACEBOOK HANDLE</div>
              <div className = "editor-link"> www.facebook.com </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-snapchat"></i> </div>
              <div className = "editor-handle-name"> @SNAPCHAT HANDLE</div>
              <div className = "editor-link"> www.snapchat.com </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-twitter-square"></i> </div>
              <div className = "editor-handle-name"> @TWITTER HANDLE</div>
              <div className = "editor-link"> www.twitter.com </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-vine"></i> </div>
              <div className = "editor-handle-name"> @VINE HANDLE</div>
              <div className = "editor-link"> www.vine.com </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-user">
              <CardBody>
              <div className = "editor"> <i className="fab fa-pinterest-square"></i> </div>
              <div className = "editor-handle-name"> @PINTEREST HANDLE</div>
              <div className = "editor-link"> www.pinterest.com </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
    </div>
  </>
  );
}

export default Editor;
