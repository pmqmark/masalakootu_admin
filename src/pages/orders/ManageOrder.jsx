import { Link, useNavigate } from "react-router-dom";
import * as Icons from "react-icons/tb";
import Orders from "../../api/Orders.json";
import Customers from "../../api/Customers.json";
import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import SelectOption from "../../components/common/SelectOption.jsx";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { orderRoute } from "../../lib/endPoints.js";

const ManageOrders = () => {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setLoading] = useState(false)
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const navigate = useNavigate();
  const [tableRow, setTableRow] = useState([
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ]);

  // const orders = Orders;
  const [orders, setOrders] = useState([])

  // const customer = orders.map(order => {
  //   const customerId = order.customer_id;
  //   const customer = Customers.find(customer => customer.id === customerId);
  //   return customer;
  // });



  const bulkAction = [
    { value: "delete", label: "Delete" },
    { value: "category", label: "Category" },
    { value: "status", label: "Status" },
  ];

  const bulkActionDropDown = (selectedOption) => {
    console.log(selectedOption);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      orders.forEach((order) => {
        updateChecks[order.id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckOrder = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const showTableRow = (selectedOption) => {
    setSelectedValue(selectedOption.label);
  };


  const actionItems = ["Delete", "View", "Edit"];

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item.toLowerCase();
    if (updateItem === "delete") {
      alert(`#${itemID} item delete`);
    } else if (updateItem === "view") {
      navigate(`/orders/manage/${itemID.toString()}`);
    }
  };

  const getOrders = async () => {
    setLoading(true)
    try {
      const res = await axiosPrivate.get(`${orderRoute}/all`);
      console.log(res.data, 'get all Orders');
      setOrders(res?.data?.data?.orders)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <section className="orders">
      <div className="container">
        <div className="wrapper">
          <div className="content transparent">
            <div className="content_head">
              <Dropdown
                placeholder="Bulk Action"
                className="sm"
                onClick={bulkActionDropDown}
                options={bulkAction}
              />
              <Input
                placeholder="Search Order..."
                className="sm table_search"
              />
              <div className="btn_parent">
                <Link to="/orders/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Create Order</span>
                </Link>
                <Button label="Advance Filter" className="sm" />
                <Button label="save" className="sm" />
              </div>
            </div>
            <div className="content_body">
              <div className="table_responsive">
                <table className="separate">
                  <thead>
                    <tr>
                      <th className="td_checkbox">
                        <CheckBox
                          onChange={handleBulkCheckbox}
                          isChecked={bulkCheck}
                        />
                      </th>
                      <th className="td_id">id</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>phone</th>
                      <th>amount</th>
                      <th>shipping amount</th>
                      <th>payment method</th>
                      <th>payment status</th>
                      <th>actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, key) => {
                      return (
                        <tr key={key}>
                          <td className="td_checkbox">
                            <CheckBox
                              onChange={(isCheck) =>
                                handleCheckOrder(isCheck, order._id)
                              }
                              isChecked={specificChecks[order.id] || false}
                            />
                          </td>
                          <td className="td_id">{order._id}</td>
                          <td>
                            <Link to={`/customers/manage/${order.userId?._id}`}>
                              {`${order?.userId?.firstName ?? ""} ${order?.userId?.lastName ?? ""}`}
                            </Link>
                          </td>
                          <td>{order.userId?.email}</td>
                          <td>{order.userId?.mobile}</td>
                          <td> ₹{order.amount}</td>
                          <td> ₹{order.deliveryCharge}</td>
                          <td>{order.payMode}</td>
                          <td>
                            {order.status.toLowerCase() === "active" ||
                              order.status.toLowerCase() === "completed" ||
                              order.status.toLowerCase() === "approved" ||
                              order.status.toLowerCase() === "delivered" ||
                              order.status.toLowerCase() === "shipped" ||
                              order.status.toLowerCase() === "new" ||
                              order.status.toLowerCase() === "coming soon" ? (
                              <Badge
                                label={order.status}
                                className="light-success"
                              />
                            ) : order.status.toLowerCase() === "inactive" ||
                              order.status.toLowerCase() === "out of stock" ||
                              order.status.toLowerCase() === "returned" ||
                              order.status.toLowerCase() === "cancelled" ||
                              order.status.toLowerCase() === "discontinued" ? (
                              <Badge
                                label={order.status}
                                className="light-danger"
                              />
                            ) : order.status.toLowerCase() === "packed" ||
                              order.status.toLowerCase() === "billed" ||
                              order.status.toLowerCase() === "shipping" ||
                              order.status.toLowerCase() === "processing" ||
                              order.status.toLowerCase() === "pending" ? (
                              <Badge
                                label={order.status}
                                className="light-warning"
                              />
                            ) : order.status.toLowerCase() === "archive" ||
                              order.status.toLowerCase() === "pause" ? (
                              <Badge
                                label={order.status}
                                className="light-secondary"
                              />
                            ) : (
                              order.status
                            )}
                          </td>
                          <td className="td_action">
                            <TableAction
                              actionItems={actionItems}
                              onActionItemClick={(item) =>
                                handleActionItemClick(item, order.id)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="content_footer">
              <Dropdown
                className="top show_rows sm"
                placeholder="please select"
                selectedValue={selectedValue}
                onClick={showTableRow}
                options={tableRow}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageOrders;