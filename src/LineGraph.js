import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildchartdata = (data, casestype = "cases") => {
    const chartdata = [];
    let lastdatapoint;
    for (let date in data.cases) {
      if (lastdatapoint) {
        const newdatapoint = {
          x: date,
          y: data[casestype][date] - lastdatapoint,
        };
        chartdata.push(newdatapoint);
      }
      lastdatapoint = data[casestype][date];
    }
    return chartdata;
  };

function LineGraph({ casestype="cases", ...props }) {
  const [data, setdata] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          let chartdata = buildchartdata(data, casestype);
          console.log(chartdata);
          setdata(chartdata);
        });
    };

    fetchData();
  }, [casestype]);

    

  return (
    <div className={props.className}>
      {/* <h1>iam a graph</h1> */}
      {data?.length > 0 && (
        <Line
        options={options}
        data={{
          datasets: [
            {
              backgroundColor: "rgba(204,16,52,0.5)",
              borderColor: "#cc1034",
              data: data,
            },
          ],
        }}
      />
      )}
      
    </div>
  );
}

export default LineGraph;
