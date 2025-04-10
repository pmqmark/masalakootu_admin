import Chart from "react-apexcharts";
import SaleProductData from "../api/SaleProductData.json";

const AreaChart = ({ data }) => {
  console.log(data)
  const options = {
    chart: {
      type: "area",
      width: '100%',
      fontFamily: "Inter, sans-serif",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#ffbf1c", "#ff852c"],
    fill: {
      shade: 'light',
      type: "gradient",
      gradient: {
        type: "vertical",
        opacityFrom: 0.6,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    xaxis: {
      categories: data?.categories,
      labels: {
        style: {
          colors: "#888",
        },
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: function (value) {
          return `₹${value}`;
        },
        style: {
          colors: "#888",
        },
      },
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: function (val) {
          return `₹${val}`;
        },
      },
      marker: {
        show: true,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "13px",
      fontWeight: 500,
      labels: {
        colors: "#888",
        useSeriesColors: false,
      },
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        strokeColor: "#fff",
        radius: 12,
        customHTML: undefined,
        onClick: undefined,
        offsetX: -2,
        offsetY: 1,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
      onItemClick: {
        toggleDataSeries: true,
      },
      onItemHover: {
        highlightDataSeries: true,
      },
    },
  };

  const series = [
    {
      name: data?.series?.[0]?.name,
      data: data?.series?.[0].data.map((item) => item.y),
    },
    {
      name: data?.series?.[1]?.name,
      data: data?.series?.[1]?.data.map((item) => item.y),
    },
  ];


  return (
    <div className="chart">
      <Chart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default AreaChart;
