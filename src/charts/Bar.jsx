import React from "react";
import ReactApexChart from "react-apexcharts";
import AudienceData from '../api/AudienceData.json';

const OrdersChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false
      },
      fontFamily: "Inter, sans-serif"
    },
    colors: ["#ffbf1c", "#ff852c"],
    fill: {
      shade: 'light',
      type: "solid",
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
      }
    },
    xaxis: {
      categories: data.map((item) => item?.day),
    },
    yaxis: {
      show: false,
    },
    grid: {
      borderColor: "#f1f1f1",
      show: false,
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false
    }
  };

  const chartSeries = [
    {
      name: "Users",
      data: data.map((item) => item?.userCount)
    },
  ];

  return (
    <div className="chart">
      <ReactApexChart options={chartOptions} series={chartSeries} type="bar" />
    </div>
  );
};

export default OrdersChart;