import React, { useEffect, useState } from "react";
import * as Icons from "react-icons/tb";
import Orders from "../../api/Orders.json";
import Products from "../../api/Products.json";
import Customers from "../../api/Customers.json";
import { Link, useParams } from "react-router-dom";
import Badge from "../../components/common/Badge.jsx";
import Rating from "../../components/common/Rating.jsx";
import Button from "../../components/common/Button.jsx";
import Profile from "../../components/common/Profile.jsx";
import truck from "../../images/common/delivery-truck.gif";
import { useGetOrderById } from "../../hooks/orderHooks/useGetOrderById.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import { orderRoute } from "../../lib/endPoints.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { TableLoading } from "../../components/common/TableLoading.jsx";
// import truck from '../../images/common/delivery-truck-2.gif'
// import truck from '../../images/common/delivery-truck-3.gif'
import { PDFDownloadLink } from "@react-pdf/renderer";
import { IoDownloadOutline } from "react-icons/io5";
import PdfReport from "./PdfReport";

const OrderDetail = () => {
  const { orderID } = useParams();
  console.log(orderID);
  const { order, loading, error, setOrder, refetch } = useGetOrderById(orderID);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "");
  const axiosPrivate = useAxiosPrivate();
  const [trackingID, setTrackingID] = useState(order?.waybill || "");
  const [courierPartner, setCourierPartner] = useState(order?.deliveryPartner || "");  
  const [trackingLoading, setTrackingLoading] = useState(false);
useEffect(() => {
  if (order) {
    setTrackingID(order?.waybill || "");
    setCourierPartner(order?.deliveryPartner || "");
  }
}, [order])

  if (loading)
    return (
      <>
        <TableLoading />
      </>
    );
  if (error) return <p>Error fetching order details.</p>;
  if (!order) return <p>Order not found.</p>;

  console.log(order);
  const customer = order?.userId;
  // Customers.find(
  //   (customer) => customer.id.toString() === order.customer_id.toString()
  // );
  const StatusOptions = [
    { value: "processing", label: "Processing" },
    { value: "billed", label: "Billed" },
    { value: "packed", label: "Packed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "returned", label: "Returned" },
  ];

  const Status = [
    "processing",
    "billed",
    "packed",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
  ];
  const handleStatusChange = async (newStatus) => {
    try {
      await axiosPrivate.put(`${orderRoute}/${orderID}`, { status: newStatus });
      setSelectedStatus(newStatus);
      refetch(); // Fetch updated order details
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  const products = order?.items;

  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    setTrackingLoading(true);
    try {
      const updatedData = {
        waybill: trackingID,
        deliveryPartner: courierPartner,
      };

      await axiosPrivate.put(`${orderRoute}/${orderID}`, updatedData);
      refetch(); // Refresh order details after successful update
    } catch (error) {
      console.error("Failed to update tracking details:", error);
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <section className="orders">
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">
                <span>Order #{order.merchantOrderId}</span>

                <PDFDownloadLink
                  document={<PdfReport data={order} />}
                  fileName={`Invoice.pdf`}
                >
                  <Button
                    icon={<Icons.TbDownload />}
                    label="invoice"
                    className="bg_light_success sm"
                  />
                </PDFDownloadLink>
              </h2>
              <table className="bordered">
                <thead>
                  <tr>
                    <th>image</th>
                    <th>name</th>
                    <th>Item price</th>
                    <th>Quantity</th>
                    <th>Rating</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={
                            product?.thumbnail?.location || "/public/dummy.jpg"
                          }
                          alt=""
                        />
                      </td>
                      <td>
                        <Link
                          to={`/catalog/product/manage/${product._id.toString()}`}
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td>₹{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <Rating value={product?.ratings?.average_rating} />
                      </td>
                      <td>₹{product.price * product.quantity}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5" className="td_no_p">
                      <b>Sub Total</b>
                    </td>
                    <td colSpan="1" className="td_no_p">
                      <b>
                        ₹
                        {products.reduce((total, item) => {
                          const extraCharges =
                            item.variations?.reduce(
                              (acc, elem) => acc + elem?.additionalPrice,
                              0
                            ) || 0;
                          return (
                            total + (item.price + extraCharges) * item.quantity
                          );
                        }, 0)}
                      </b>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="5" className="td_no_p">
                      <b>Tax {order?.couponCode} </b>
                    </td>
                    <td colSpan="1" className="td_no_p">
                      <b>₹{order?.totalTax || 0}</b>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="5" className="td_no_p">
                      <b>Shipping Charge </b>
                    </td>
                    <td colSpan="1" className="td_no_p">
                      <b>₹{order?.deliveryCharge || 0}</b>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="5" className="td_no_p">
                      <b>Discount {order?.couponCode} </b>
                    </td>
                    <td colSpan="1" className="td_no_p">
                      <b>-₹{order?.discount || 0}</b>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="5" className="td_no_p">
                      <b>Total amount</b>
                    </td>
                    <td colSpan="1" className="td_no_p">
                      <b>₹{order?.amount}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="content_item">
              <h2 className="sub_heading">
                <span>Order Status</span>
                <div className="flex gap-3">
                  <Dropdown
                    placeholder={"Update the Status"}
                    options={StatusOptions}
                    selectedValue={selectedStatus}
                    onClick={(option) => handleStatusChange(option.value)}
                  />
                  <Button
                    icon={<Icons.TbShoppingCartCancel />}
                    label="Cancel order"
                    className="bg_light_danger sm"
                  />
                </div>
              </h2>
              <div className="order_status">
                {Status.map((status, index) => {
                  // Icon Mapping
                  const statusIcons = {
                    processing: <Icons.TbChecklist />,
                    billed: <Icons.TbReload />,
                    packed: <Icons.TbPackage />,
                    shipped: <Icons.TbTruckDelivery />,
                    delivered: <Icons.TbTruckLoading />,
                    cancelled: <Icons.TbShoppingBagCheck />,
                    returned: <Icons.TbArrowBack />,
                  };

                  return (
                    <div key={index} className="order_status_item">
                      <div className="order_status_icon">
                        {statusIcons[status.toLowerCase()] || (
                          <Icons.TbAlertCircle />
                        )}{" "}
                        {/* Default icon */}
                      </div>
                      <div className="order_status_content">
                        <h3>{status}</h3> {/* Correct status name */}
                        <h5>
                          {order?.status === status.toLowerCase()
                            ? "Current Status"
                            : "Pending"}
                        </h5>
                        <p>
                          {order?.status === status.toLowerCase()
                            ? new Date(order?.updatedAt).toLocaleDateString(
                                "en-GB"
                              )
                            : "Not Updated"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <div className="logistics_item">
                <img src={truck} alt="" height="100px" />
                <p>
                  <b>Order Date: </b>{" "}
                  {new Date(order?.orderDate).toLocaleDateString("en-GB")}
                </p>
                <p>
                  <b>Shipping Address: </b>
                  {order?.shipAddress.street}, {order?.shipAddress.city},{" "}
                  {order.shipAddress.state}, {order?.shipAddress.zip}
                </p>
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading mb-4">Tracking Details</h2>

              <form onSubmit={handleTrackingSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="trackingID"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tracking ID
                  </label>
                  <input
                    id="trackingID"
                    type="text"
                    value={trackingID}
                    onChange={(e) => setTrackingID(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter tracking ID"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="courierPartner"
                    className="text-sm font-medium text-gray-700"
                  >
                    Courier Partner
                  </label>
                  <input
                    id="courierPartner"
                    type="text"
                    value={courierPartner}
                    onChange={(e) => setCourierPartner(e.target.value)}
                    className="border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter courier partner name"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className={`w-full py-2 rounded-lg text-white font-medium transition ${
                    trackingLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-400"
                  }`}
                >
                  {trackingLoading ? "Updating..." : "Update Tracking"}
                </button>
              </form>
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">Payment Details:</h2>
              <div className="column">
                <div className="detail_list">
                  <div className="detail_list_item">
                    <b>Transaction ID:</b>
                    <p>{order?.transactionId ?? "NIL"}</p>
                  </div>
                  <div className="detail_list_item">
                    <b>Payment Method:</b>
                    <p>{order?.payMode}</p>
                  </div>
                  <div className="detail_list_item">
                    <b>Amount:</b>
                    <p>₹{order?.amount}</p>
                  </div>
                  <div className="detail_list_item">
                    <b>Payment Status:</b>
                    {order.payStatus.toLowerCase() === "completed" ||
                    order.payStatus.toLowerCase() === "coming soon" ? (
                      <Badge
                        label={order.payStatus}
                        className="light-success"
                      />
                    ) : order.payStatus.toLowerCase() === "failed" ? (
                      <Badge label={order.payStatus} className="light-danger" />
                    ) : order.payStatus.toLowerCase() === "pending" ? (
                      <Badge
                        label={order.payStatus}
                        className="light-warning"
                      />
                    ) : order.payStatus.toLowerCase() === "refunded" ? (
                      <Badge
                        label={order.payStatus}
                        className="light-secondary"
                      />
                    ) : (
                      order.payStatus
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Customer Details:</h2>
              <div className="column">
                <Profile
                  name={`${customer.firstName} ${customer.lastName}`}
                  slogan="customer"
                  link={`/customers/manage/${customer._id}`}
                  src={customer.image || "/public/profile.jpg"}
                />
              </div>
              <div className="column">
                <div className="detail_list">
                  <div className="detail_list_item">
                    <Icons.TbMail />
                    <p>{customer?.email}</p>
                  </div>
                  <div className="detail_list_item">
                    <Icons.TbPhone />
                    <p>{customer?.mobile}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">shipping Address:</h2>
              <div className="column">
                <div className="detail_list">
                  <div className="detail_list_item">
                    <Icons.TbPoint />
                    <p>{order?.shipAddress?.street}</p>
                  </div>
                  <div className="detail_list_item">
                    <Icons.TbPoint />
                    <p>{order?.shipAddress?.city}</p>
                  </div>
                  <div className="detail_list_item">
                    <Icons.TbPoint />
                    <p>{order?.shipAddress?.state}</p>
                  </div>
                  <div className="detail_list_item">
                    <Icons.TbPoint />
                    <p>{order?.shipAddress?.pincode}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Billing Address:</h2>
              <div className="column">
                <div className="detail_list">
                  <div className="detail_list_item">
                    <Icons.TbPoint />
                    <p>{order.billAddress.street}</p>
                  </div>
                  <div className="detail_list_item">
                    <Icons.TbPoint />
                    <p>{order.billAddress.city}</p>
                  </div>
                  <div className="detail_list_item">
                    <Icons.TbPoint />
                    <p>{order.billAddress.state}</p>
                  </div>
                  <div className="detail_list_item">
                    <Icons.TbPoint />
                    <p>{order.billAddress.pincode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
