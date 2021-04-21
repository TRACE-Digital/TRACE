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
import React, { useEffect, useState, } from "react";
<<<<<<< Updated upstream
// react plugin used to create charts
import { Line } from "react-chartjs-2";
=======
>>>>>>> Stashed changes
import { ProfilePage } from 'trace-search';
import Graph from "components/Graph/Graph.js";
import axios from "axios";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from "reactstrap";

function Analytics(props) {
  const [page, setPage] = useState(null);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [totalGraph, setTotalGraph] = useState("1 Year");


  const toggleTimeDropdown = () => setTimeDropdownOpen((prevState) => !prevState);

  async function fetchData(id) {

    try {
      await axios.post(

      );
    } catch (error) {
      console.log(error);
    }

    // fetch("https://api.example.com/items")
    //   .then(res => res.json())
    //   .then(
    //     (result) => {
    //       this.setState({
    //         isLoaded: true,
    //         items: result.items
    //       });
    //     },
    //     // Note: it's important to handle errors here
    //     // instead of a catch() block so that we don't swallow
    //     // exceptions from actual bugs in components.
    //     (error) => {
    //       this.setState({
    //         isLoaded: true,
    //         error
    //       });
    //     }
    //   )

    const resp = {
      "2021-04-04": [],
      "2021-04-05": [],
      "2021-04-06": [],
      "2021-04-07": [],
      "2021-04-08": [],
      "2021-04-09": [
          {
              "label": "/username",
              "nb_visits": 1,
              "nb_uniq_visitors": 1,
              "nb_hits": 5,
              "sum_time_spent": 2132,
              "exit_nb_uniq_visitors": "1",
              "exit_nb_visits": "1",
              "avg_time_on_page": 426,
              "bounce_rate": "0%",
              "exit_rate": "100%",
              "url": "https://public.tracedigital.tk/username"
          }
      ],
      "2021-04-10": [
          {
              "label": "/username",
              "nb_visits": 1,
              "nb_uniq_visitors": 1,
              "nb_hits": 1,
              "sum_time_spent": 0,
              "entry_nb_uniq_visitors": "1",
              "entry_nb_visits": "1",
              "entry_nb_actions": "1",
              "entry_sum_visit_length": "0",
              "entry_bounce_count": "1",
              "exit_nb_uniq_visitors": "1",
              "exit_nb_visits": "1",
              "avg_time_on_page": 0,
              "bounce_rate": "100%",
              "exit_rate": "100%",
              "url": "https://public.tracedigital.tk/username"
          }
      ]
  };

  const graphData = [];

  for (const key in resp) {
    if (resp.hasOwnProperty(key)) {
        if (resp[key].length !== 0) {
          graphData.push(resp[key][0].nb_hits);
        }
        else {
          graphData.push(0);
        }

    }
  }

    return graphData;
  }

  // Memoise (if page renders too many times)
  // https://rossbulat.medium.com/how-to-memoize-in-react-3d20cbcd2b6e

  useEffect(() => {
    (async () => {
      const results = await ProfilePage.loadAll();
      if (results.length > 0) {
        setPage(results[0]);
      } else {
        setPage(null);
      }
      setBgChartData("data1");
    })();
  }, []);

  console.log(page);

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
                    <Dropdown isOpen={timeDropdownOpen} toggle={toggleTimeDropdown} style={{display: "inline", marginRight: "10px"}}>
                      <DropdownToggle caret>{totalGraph}
                        <b className="caret d-none d-lg-block d-xl-block" style={{marginLeft: "-15px", marginTop: "-11px"}} />
                      </DropdownToggle>
                      <DropdownMenu style={{marginTop: "15px"}}>
                        <DropdownItem onClick={() => setTotalGraph("1 Month")}>
                          1 Month
                        </DropdownItem>
                        <DropdownItem divider tag="li" />
                        <DropdownItem onClick={() => setTotalGraph("3 Months")}>
                          3 Months
                        </DropdownItem>
                        <DropdownItem divider tag="li" />
                        <DropdownItem onClick={() => setTotalGraph("6 Months")}>
                          6 Months
                        </DropdownItem>
                        <DropdownItem divider tag="li" />
                        <DropdownItem onClick={() => setTotalGraph("1 Year")}>
                          1 Year
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Graph dataLabel="Visitors" fetchData={() => fetchData("id")}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          {/* Map here */}
          {page && page.accounts.map((account) => (
             <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">{account.site.name}</h5>
                  <CardTitle tag="h3">
                    <Button style={{float: "right"}}>6 Months
                      <b className="caret d-none d-lg-block d-xl-block" style={{marginLeft: "-15px", marginTop: "-11px"}} />
                    </Button>
                    <i className="tim-icons icon-bell-55 text-info" /> 44 Visitors
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area" >
                    <Graph
                      dataLabel="Link Clicks"
                      fetchData={() => fetchData("id")}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default Analytics;
