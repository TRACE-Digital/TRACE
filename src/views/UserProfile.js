/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Row,
  Col,
} from "reactstrap";

import Charlene from '../assets/img/BabyPics/Charlene.jpeg';
import Chris from '../assets/img/BabyPics/Chris.jpg';
import Cora from '../assets/img/BabyPics/Cora.JPG';
import Isabel from '../assets/img/BabyPics/Isabel.png';
import Jack from '../assets/img/BabyPics/Jack.png';
import Jakob from '../assets/img/BabyPics/Jakob.jpeg';


function UserProfile() {
  var images = [
    {image : Charlene, label : 'Charlene Orr'},
    {image : Chris, label : 'Chris Cohen'},
    {image : Cora, label : 'Cora Chan'},
    {image : Isabel, label : 'Isabel Battaglioli'},
    {image : Jack, label : 'Jack McKernan'},
    {image : Jakob, label : 'Jakob Molskness'},
  ];

  function getPicture(item) {
    return (
        <Col md={3}>
            <img className="baby-pics" alt="" src={`${item.image}`}></img>
            <div className="dev-name">
                <text>{item.label} </text>
            </div>
        </Col>
    );
}

  return (
    <>
      <div className="content">
        <h3 className="header">Meet the Developers</h3>
        <Row>
          { images.map(getPicture) }
        </Row>
      </div>
    </>
  );
}

export default UserProfile;
