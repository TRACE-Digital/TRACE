import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Auth } from 'aws-amplify';

function Graph(props) {

  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);

  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  async function fetchData(interval) {

    const currentUser = await Auth.currentUserPoolUser();
    const sub = currentUser.attributes.sub;

    var formdata = new FormData();
    formdata.append("idSite", props.idSite); // from profile page
    formdata.append("pageUrl", `/a-${sub}/${props.pageUrl}`); // public page url

    let labelFrequency = 1; // default is a label at every data point
    if (interval === "1 Year") {
      formdata.append("period", "month");
      formdata.append("date", "last12");

    } else if (interval === "6 Months") {
      formdata.append("period", "week");
      formdata.append("date", "last26");
      labelFrequency = 4;

    } else if (interval === "1 Month") {
      formdata.append("period", "day");
      formdata.append("date", "last31");
      // labelFrequency = 7;

    } else if (interval === "1 Week") {
      formdata.append("period", "day");
      formdata.append("date", "last7");

    } else {
      return [];
    }

    formdata.append("token_auth", "anonymous");

    var config = {
      method: 'POST',
      url: 'https://analytics.tracedigital.tk/?module=API&method=Actions.getPageUrl&format=JSON',
      data: formdata,
    };

    let analyticsData = {};
    try {
      const response = await axios(config);
      analyticsData = response.data;
    }
    catch(error) {
      console.error(error);
    }

  const data = [];

  // Add label logic in here
  const tempLabels = [];
  let count = 0;
  for (const key in analyticsData) {

    if (analyticsData.hasOwnProperty(key)) {

      if (count % labelFrequency === 0) {
        const date = new Date(key.split(',')[0]);

        if (interval === "1 Year" || interval === "6 Months") {
          tempLabels.push(`${months[date.getMonth()]} ${date.getFullYear()}`);

        } else if (interval === "1 Month") {
          tempLabels.push(`${months[date.getMonth()]} ${date.getDate()}`);
        } else if (interval === "1 Week") {
          tempLabels.push(`${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`);
        }

      } else {
        tempLabels.push('');
      }


      if (analyticsData[key].length !== 0) {
        data.push(analyticsData[key][0].nb_hits);
      }
      else {
        data.push(0);
      }
    }
    count++;
  }

    setLabels(tempLabels);
    return data;
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchData(props.interval);
        setData(data);
      }
      catch {
        console.error('Error retrieving data');
        setData([]);
      }
    })();
  }, [props.interval]);


  let chart = {
    visitorData: (canvas) => {
      let ctx = canvas.getContext("2d");

      let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
      gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
      gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

      return {
        labels: labels,
        datasets: [
          {
            label: props.dataLabel,
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: "#1f8ef1",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: "#1f8ef1",
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: "#1f8ef1",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: data,
          },
        ],
      };
    },
    options: defaultOptions,
  }

  return (
    <>
      <Line
        data={chart.visitorData}
        options={chart.options}
      />
    </>
  );
}

export default Graph;


// ##############################
// // // Chart variables
// #############################

// chartExample1 and chartExample2 options
let defaultOptions = {
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  tooltips: {
    backgroundColor: "#f5f5f5",
    titleFontColor: "#333",
    bodyFontColor: "#666",
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: 0,
    position: "nearest",
  },
  responsive: true,
  scales: {
    yAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: "rgba(29,140,248,0.0)",
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 5,
          padding: 20,
          fontColor: "#9a9a9a",
        },
      },
    ],
    xAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: "rgba(29,140,248,0.1)",
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9a9a9a",
        },
      },
    ],
  },
};
