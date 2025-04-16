import { Link } from "react-router-dom";
import * as Icons from "react-icons/tb";
import Bar from "../../charts/Bar.jsx";
import Area from "../../charts/Area.jsx";
// import Products from '../../api/Products.json';
// import Badge from '../../components/common/Badge.jsx';
import Button from "../../components/common/Button.jsx";
import Profile from "../../components/common/Profile.jsx";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { dashboardRoute, getStockreport } from "../../lib/endPoints.js";
import { TableLoading } from "../../components/common/TableLoading.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";

const Overview = () => {
  const axiosPrivate = useAxiosPrivate();
  const [metrics, setMetrics] = useState({});
  const [recentOrder, setRecentOrder] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [areaData, setAreaData] = useState({});
  const [bestProds, setBestProds] = useState([]);
  const [stockReportData, setStockReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dummyImage = "../../../public/dummy.png";

  const getAllData = async () => {
	try {
	  setLoading(true);
  
	  const [dashboardRes, stockReportRes] = await Promise.all([
		axiosPrivate.get(dashboardRoute),
		axiosPrivate.get(getStockreport)
	  ]);
  
	  if (dashboardRes.data?.success === true) {
		const {
		  metrics_data,
		  recent_orders,
		  recent_users,
		  best_prods,
		  sale_analytics
		} = dashboardRes.data.data;
  
		setMetrics(metrics_data);
		setRecentOrder(recent_orders);
		setAreaData(sale_analytics);
		setBestProds(best_prods);
		setRecentUsers(recent_users);
	  }
  
	  if (stockReportRes.data?.success) {
		console.log(stockReportRes.data.data.result ,"stock")
		setStockReportData(stockReportRes.data.data.result);
	  }
  
	} catch (error) {
	  console.log(error);
	} finally {
	  setLoading(false);
	}
  };
  
  useEffect(() => {
    getAllData();
  }, []);

  const handleStockReportDownload = () => {
	if (!stockReportData || stockReportData.length === 0) {
	  return console.warn("No stock report data available.");
	}
  
	// Map and filter the required fields
	const filteredData = stockReportData.map((item, index) => ({
	  no: index + 1,
	  name: item.name ?? "N/A",
	  hsn: item.hsn ?? "N/A",
	  stock: item.stock ?? 0,
	}));
  
	const ws = XLSX.utils.json_to_sheet(filteredData);
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Stock Report");
  
	const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
	const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
	saveAs(blob, `StockReport-${new Date().toISOString().split("T")[0]}.xlsx`);
  };
  
  console.log(recentOrder);

  if (loading)
    return (
      <>
        <TableLoading />
      </>
    );

  return (
    <section>
      <div className="container">
        <div className="wrapper flex flex-col lg:flex-row">
          <div className="content">
            <div className="content_item sale_overview">
              <div className="sale_overview_card">
                <Icons.TbShoppingCart />
                <div className="sale_overview_content">
                  <h5 className="sale_title">Total Sale</h5>
                  <h4 className="sale_value">₹{metrics?.totalSale}</h4>
                </div>
              </div>
              <div className="sale_overview_card">
                <Icons.TbShoppingBag />
                <div className="sale_overview_content">
                  <h5 className="sale_title">Total Orders</h5>
                  <h4 className="sale_value">{metrics?.totalOrders}</h4>
                </div>
              </div>
              <div className="sale_overview_card">
                <Icons.TbPackage />
                <div className="sale_overview_content">
                  <h5 className="sale_title">Total Items</h5>
                  <h4 className="sale_value">{metrics?.totalItems}</h4>
                </div>
              </div>
              <div className="sale_overview_card">
                <Icons.TbChartBar />
                <div className="sale_overview_content">
                  <h5 className="sale_title">Total Revenue</h5>
                  <h4 className="sale_value">₹{metrics?.totalRevenue}</h4>
                </div>
              </div>
            </div>
            <div className="content_item">
              <h2 className="sub_heading">
                <span>Sale Analytic</span>
                <div className="flex gap-3">
                  <Button
				  icon={<FiDownload/>}
                    label="Stock report"
                    className="sm"
                    onClick={handleStockReportDownload}
                  />
                  <Button label="Total Sale" className="sm" />
                </div>
              </h2>
              <Area data={areaData} />
            </div>
            <div className="content_item">
              <h2 className="sub_heading">Best selling products</h2>
              <table className="simple">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    {/* <th>Status</th> */}
                  </tr>
                </thead>
                <tbody>
                  {bestProds.map((product, key) => (
                    <tr key={key}>
                      <td>
                        <Profile
                          src={product?.thumbnail?.location ?? dummyImage}
                          slogan={product.category ?? "N/A"}
                          name={product.productName}
                        />
                      </td>
                      <td>{product.category ?? "N/A"}</td>
                      <td>₹{product.price}</td>
                      <td>{product.totalQuantity}</td>
                      {/* <td>
												{product.inventory.in_stock ? (
													<Badge
														label="In Stock"
														className="light-success"
													/>
												) : product.inventory.quantity < 10 &&
													product.inventory.quantity > 0 ? (
													<Badge
														label="Low Stock"
														className="light-warning"
													/>
												) : (
													<Badge
														label="Out of Stock"
														className="light-danger"
													/>
												)}
											</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">New users</h2>
              <Bar data={recentUsers} />
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">Recent Orders</h2>
              <div className="recent_orders column">
                {recentOrder?.map((product, key) => (
                  <Link
                    key={key}
                    to={`/orders/manage/${product?._id}`}
                    className="recent_order"
                  >
                    <figure className="recent_order_img">
                      <img
                        src={
                          product?.thumbnail?.location
                            ? product?.thumbnail?.location
                            : dummyImage
                        }
                        alt=""
                      />
                    </figure>
                    <div className="recent_order_content">
                      <h4 className="recent_order_title">{product?.name}</h4>
                      <p className="recent_order_category">{product?.name}</p>
                    </div>
                    <div className="recent_order_details">
                      <h5 className="recent_order_price">₹{product?.price}</h5>
                      <p className="recent_order_quantity">
                        items: {product?.quantity}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
