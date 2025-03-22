import { Link } from 'react-router-dom';
import * as Icons from "react-icons/tb";
import Bar from '../../charts/Bar.jsx';
import Area from '../../charts/Area.jsx';
import Products from '../../api/Products.json';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Profile from '../../components/common/Profile.jsx';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate.js';
import { bestProdsRoute, dashboardRoute, getAllMetrics, getOrderStatus, getRecentOrder, getSaleAnalytics, orderRoute } from '../../lib/endPoints.js';

const Overview = () => {
	const axiosPrivate = useAxiosPrivate();
	const [metrics, setMetrics] = useState({});
	const [recentOrder, setRecentOrder] = useState();
	const [areaData, setAreaData] = useState({});
	const [orders, setOrders] = useState({});
	const [orderStatus, setOrdersStatus] = useState({});
	const [loading, setLoading] = useState(false);

	const dummyImage = '../../../public/dummy.png'

	const getData = async () => {
		setLoading(true)
		try {
			const results = await Promise.allSettled([
				axiosPrivate.get(getAllMetrics),
				axiosPrivate.get(getOrderStatus),
				axiosPrivate.get(getRecentOrder),
				axiosPrivate.get(`${orderRoute}/all`),
				axiosPrivate.get(getSaleAnalytics),
			]);

			if (results[0].status === "fulfilled") {
				// console.log(results[0].value.data?.data)
				setMetrics(results[0].value.data?.data);
			} else {
				console.error("Failed to fetch user:", results[0]?.reason);
			}

			if (results[1].status === "fulfilled") {
				// console.log(results[1].value.data?.data?.orderStatusesAndCounts)
				setOrdersStatus(results[1].value.data?.data?.orderStatusesAndCounts);
			} else {
				console.error("Failed to fetch orders:", results[1]?.reason);
			}

			if (results[2].status === "fulfilled") {
				// console.log(results[2].value.data?.data?.result)
				setOrders(results[2].value.data?.data?.result);
			} else {
				console.error("Failed to fetch notifications:", results[2]?.reason);
			}
			if (results[3].status === "fulfilled") {
				// console.log(results[3].value.data?.data)
				const orders = results[3].value?.data?.data?.orders;
				setRecentOrder(Array.isArray(orders) ? orders.slice(0, 15) : []);
			} else {
				console.error("Failed to fetch notifications:", results[3]?.reason);
			}
			if (results[4].status === "fulfilled") {
				// console.log(results[4].value.data?.data)
				const result = results[4].value?.data?.data?.result;
				setAreaData(result);
			} else {
				console.error("Failed to fetch notifications:", results[4]?.reason);
			}

		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	const getAllData = async () => {
		try {
			setLoading(true)
			const response = await axiosPrivate.get(dashboardRoute)

			if (response.data?.success === true) {
				const { metrics_data,
					recent_orders,
					recent_users,
					best_prods,
					sale_analytics } = response.data?.data;

				setMetrics(metrics_data)
				setRecentOrder(recent_orders)
				setAreaData(sale_analytics)
			}

		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		// getData()
		getAllData()
	}, [])

	console.log(recentOrder)
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
								<Button
									label="Total Sale"
									className="sm"
								/>
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
										<th>Status</th>
										<th>Quantity</th>
									</tr>
								</thead>
								<tbody>
									{Products.map((product, key) => (
										<tr key={key}>
											<td>
												<Profile
													src={product.images.thumbnail}
													slogan={product.category}
													name={product.name}
												/>
											</td>
											<td>{product.category}</td>
											<td>${product.price}</td>
											<td>
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
											</td>
											<td>{product.inventory.quantity}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<div className="sidebar">
						{/* <div className="sidebar_item">
							<h2 className="sub_heading">Audience</h2>
							<Bar />
						</div> */}
						<div className="sidebar_item">
							<h2 className="sub_heading">Recent Orders</h2>
							<div className="recent_orders column">
								{recentOrder?.map((product, key) => (
									<Link key={key} to={`/orders/manage/${product?._id}`} className="recent_order">
										<figure className="recent_order_img">
											<img src={product?.thumbnail?.location ? product?.thumbnail?.location : dummyImage} alt="" />
										</figure>
										<div className="recent_order_content">
											<h4 className="recent_order_title">{product?.name}</h4>
											<p className="recent_order_category">{product?.name}</p>
										</div>
										<div className="recent_order_details">
											<h5 className="recent_order_price">${product?.price}</h5>
											<p className="recent_order_quantity">items: {product?.quantity}</p>
										</div>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Overview