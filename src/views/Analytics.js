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
import React, { useEffect, useState } from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// react plugin used to create charts
import { Line, Bar } from 'react-chartjs-2';
import { ProfilePage } from 'trace-search';

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from 'reactstrap';

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
  chartExample5,
  chartExample6,
  chartExample7,
} from 'variables/charts.js';

function Dashboard(props) {
  const [bigChartData, setbigChartData] = React.useState('data1');
  const [page, setPage] = useState(null);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [totalGraph, setTotalGraph] = useState('1 Year');
  const [oneGraph, setOneGraph] = useState('6 Months');
  const [secondGraph, setSecondGraph] = useState('6 Months');
  const [thirdGraph, setThirdGraph] = useState('6 Months');

  const toggleTimeDropdown = () => setTimeDropdownOpen(prevState => !prevState);

  const setBgChartData = name => {
    setbigChartData(name);
  };

  useEffect(() => {
    (async () => {
      const results = await ProfilePage.loadAll();
      if (results.length > 0) {
        setPage(results[0]);
      } else {
        setPage(null);
      }
    })();
  }, []);

  return (
    <>
      <div className="content">
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Public Profile Visitors</h5>
                    <CardTitle tag="h2">123 Total Visitors</CardTitle>
                  </Col>
                  <Col sm="6">
                    <Dropdown
                      isOpen={timeDropdownOpen}
                      toggle={toggleTimeDropdown}
                      style={{ display: 'inline', marginRight: '10px' }}
                    >
                      <DropdownToggle caret>
                        {totalGraph}
                        <b
                          className="caret d-none d-lg-block d-xl-block"
                          style={{ marginLeft: '-15px', marginTop: '-11px' }}
                        />
                      </DropdownToggle>
                      <DropdownMenu style={{ marginTop: '15px' }}>
                        <DropdownItem onClick={() => setTotalGraph('1 Month')}>1 Month</DropdownItem>
                        <DropdownItem divider tag="li" />
                        <DropdownItem onClick={() => setTotalGraph('3 Months')}>3 Months</DropdownItem>
                        <DropdownItem divider tag="li" />
                        <DropdownItem onClick={() => setTotalGraph('6 Months')}>6 Months</DropdownItem>
                        <DropdownItem divider tag="li" />
                        <DropdownItem onClick={() => setTotalGraph('1 Year')}>1 Year</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {/* 1 Year */}
                {totalGraph === '1 Year' && (
                  <div className="chart-area">
                    <Line data={chartExample1[bigChartData]} options={chartExample1.options} />
                  </div>
                )}
                {/* 6 Months */}
                {totalGraph === '6 Months' && (
                  <div className="chart-area">
                    <Line data={chartExample5[bigChartData]} options={chartExample5.options} />
                  </div>
                )}
                {totalGraph === '3 Months' && (
                  <div className="chart-area">
                    <Line data={chartExample6[bigChartData]} options={chartExample6.options} />
                  </div>
                )}
                {totalGraph === '1 Month' && (
                  <div className="chart-area">
                    <Line data={chartExample7[bigChartData]} options={chartExample7.options} />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Instagram</h5>
                <CardTitle tag="h3">
                  <Button style={{ float: 'right' }}>
                    6 Months
                    <b
                      className="caret d-none d-lg-block d-xl-block"
                      style={{ marginLeft: '-15px', marginTop: '-11px' }}
                    />
                  </Button>
                  <i className="tim-icons icon-bell-55 text-info" /> 44 Visitors
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line data={chartExample2.data} options={chartExample2.options} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Twitter</h5>
                <CardTitle tag="h3">
                  <Button style={{ float: 'right' }}>
                    6 Months
                    <b
                      className="caret d-none d-lg-block d-xl-block"
                      style={{ marginLeft: '-15px', marginTop: '-11px' }}
                    />
                  </Button>
                  <i className="tim-icons icon-delivery-fast text-primary" /> 27 Visitors
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line data={chartExample3.data} options={chartExample3.options} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Facebook</h5>
                <CardTitle tag="h3">
                  <Button style={{ float: 'right' }}>
                    6 Months
                    <b
                      className="caret d-none d-lg-block d-xl-block"
                      style={{ marginLeft: '-15px', marginTop: '-11px' }}
                    />
                  </Button>
                  <i className="tim-icons icon-send text-success" /> 18 Visitors
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line data={chartExample4.data} options={chartExample4.options} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
