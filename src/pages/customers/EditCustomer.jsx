import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getAUserRoute } from "../../lib/endPoints.js";
import * as Icons from "react-icons/tb";
import country from '../../api/country.json';
import Badge from "../../components/common/Badge.jsx";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Offcanvas from "../../components/common/Offcanvas.jsx";
import Thumbnail from "../../components/common/Thumbnail.jsx";
import Accordion from "../../components/common/Accordion.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import TableAction from "../../components/common/TableAction.jsx";
import Customers from '../../api/Customers.json';
import Orders from '../../api/Orders.json';
import Rating from "../../components/common/Rating.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Toggler from "../../components/common/Toggler.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Reviews from '../../api/Reviews.json';
import Divider from "../../components/common/Divider.jsx";
import Modal from "../../components/common/Modal.jsx";

const EditCustomer = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { customerId } = useParams();
  const [user, setUser] = useState({});
  const [address, setAddress] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState()

  const getUser = async () => {
    try {
      setIsLoading(true);
      const res = await axiosPrivate.get(`${getAUserRoute}/${customerId}`);
      console.log(res.data, 'get a user');
      setUser(res?.data?.data?.user)
      setAddress(res?.data?.data?.address)
      setOrderHistory(res?.data?.data?.orderHistory)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (key, value) => {
    setFields({
      ...fields,
      [key]: value,
    });
  };

  // const isVendorCheck = (isCheck) => {
  //   setFields({
  //     ...fields,
  //     isVendor: isCheck,
  //   });
  // };

  // const [status, setStatus] = useState([
  //   {
  //     value: "active",
  //     label: "active",
  //   },
  //   {
  //     value: "locked",
  //     label: "locked",
  //   },
  // ]);

  // const handleStatusSelect = (isSelect) => {
  //   setFields({
  //     ...fields,
  //     status: isSelect.label,
  //   });
  // };

  const handleCountrySelect = (isSelect) => {
    setFields({
      ...fields,
      status: isSelect.label,
    });
  };

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  // const handleOpenOffcanvas = () => {
  //   setIsOffcanvasOpen(true);
  // };

  const handleCloseOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  // const actionItems = ["Delete", "View"];

  // const handleActionItemClick = (item, itemID) => {
  //   var updateItem = item.toLowerCase();
  //   if (updateItem === "delete") {
  //     alert(`#${itemID} item delete `);
  //   } else if (updateItem === "view") {
  //     navigate(`/ catalog / product / manage / ${itemID}`);
  //   }
  // };

  useEffect(() => {
    getUser()
  }, [])

  console.log(user)


  return (
    <section>
      <div className="container">
        <div className="wrapper flex flex-col lg:flex-row">
          <div className="content">
            {/* base details */}
            <div className="content_item">
              <h2 className="sub_heading">Detail</h2>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the customer name"
                  label="Name"
                  icon={<Icons.TbUser />}
                  value={user?.firstName + " " + user?.lastName}
                // onChange={(value) => handleInputChange("name", value)}
                />
              </div>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the customer email"
                  label="Email"
                  icon={<Icons.TbMail />}
                  value={user?.email}
                // onChange={(value) => handleInputChange("email", value)}
                />
              </div>
              <div className="column">
                <Input
                  type="tel"
                  placeholder="Enter the customer phone"
                  label="Phone"
                  icon={<Icons.TbPhone />}
                  value={user.mobile}
                // onChange={(value) => handleInputChange("phone", value)}
                />
              </div>
              {/* <div className="column">
                <Input
                  type="date"
                  placeholder="Enter the customer phone"
                  label="Date"
                  icon={<Icons.TbCalendar />}
                  value={user.date}
                />
              </div>
              <div className="column">
                <Input
                  type="password"
                  placeholder="Enter the customer password"
                  label="password"
                  icon={<Icons.TbLock />}
                  value={user.password}
                />
              </div>
              <div className="column">
                <Input
                  type="password"
                  placeholder="Enter the customer password confirmation"
                  label="password confirmation"
                  icon={<Icons.TbLockCheck />}
                  value={user.passwordConfirm}
                />
              </div> */}
            </div>

            {/* Address */}
            <div className="content_item">
              <h2 className="sub_heading">
                <span>Addresses</span>
                {/* <Button
                  className="sm"
                  label="new address"
                  icon={<Icons.TbPlus />}
                  onClick={handleOpenOffcanvas}
                /> */}
              </h2>
              <Offcanvas isOpen={isOffcanvasOpen} onClose={handleCloseOffcanvas} className="lg">
                <div className="offcanvas-head">
                  <h2>add address</h2>
                </div>
                <div className="offcanvas-body">
                  <div className="content_item">
                    <div className="column_3">
                      <Input
                        type="text"
                        placeholder="Address name"
                        label="Address Name"
                        className="sm"
                        value={user.addressName}
                        onChange={(value) => handleInputChange("addressName", value)}
                      />
                    </div>
                    <div className="column_3">
                      <Input
                        type="tel"
                        placeholder="Address Phone"
                        label="Address Phone"
                        className="sm"
                        value={user.addressPhone}
                        onChange={(value) => handleInputChange("addressPhone", value)}
                      />
                    </div>
                    <div className="column_3">
                      <Input
                        type="number"
                        placeholder="Zip code"
                        label="Zip code"
                        className="sm"
                        value={user.AddressZipCode}
                        onChange={(value) => handleInputChange("addressZipCode", value)}
                      />
                    </div>
                    <div className="column_3">
                      <Input
                        type="email"
                        placeholder="Address Email"
                        label="Address Email"
                        className="sm"
                        value={user.addressEmail}
                        onChange={(value) => handleInputChange("addressEmail", value)}
                      />
                    </div>
                    <div className="column">
                      <Input
                        type="text"
                        placeholder="Address Street"
                        label="Address Street"
                        className="sm"
                        value={user.addressStreet}
                        onChange={(value) => handleInputChange("addressStreet", value)}
                      />
                    </div>
                    <div className="column">

                      <MultiSelect
                        placeholder="Select Country"
                        isSelected={user.addressCountry}
                        onClick={handleCountrySelect}
                        options={country}
                        className="sm"
                        isMulti={false}
                      />
                    </div>
                    <div className="column_3">
                      <Input
                        type="text"
                        placeholder="Address State"
                        label="Address State"
                        className="sm"
                        value={user.addressState}
                        onChange={(value) => handleInputChange("addressState", value)}
                      />
                    </div>
                    <div className="column_3">
                      <Input
                        type="text"
                        placeholder="Address City"
                        label="Address City"
                        className="sm"
                        value={user.addressCity}
                        onChange={(value) => handleInputChange("addressCity", value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="offcanvas-footer">
                  <Button
                    label="discard"
                    onClick={handleCloseOffcanvas}
                    className="outline"
                  />
                  <Button
                    label="Add"
                    onClick={handleCloseOffcanvas}
                  />
                </div>
              </Offcanvas>

              <div className="column" >
                <Accordion title={`Delivery Address`}>
                  <table className="bordered">
                    <thead>
                      <tr>
                        <th>Street</th>
                        <th>city</th>
                        <th>State</th>
                        <th>zip code</th>
                        <th>Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{address?.street}</td>
                        <td>{address?.city}</td>
                        <td>{address?.state}</td>
                        <td>{address?.pincode}</td>
                        <td>{address?.phoneNumber}</td>
                      </tr>
                    </tbody>
                  </table>
                </Accordion>
              </div>
            </div>

            {/* Payment */}
            <div className="content_item">
              <h2 className="sub_heading">Order</h2>
              <div className="column">
                <div className="table_responsive">
                  <table className="bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Transaction ID</th>
                        <th>Payment Method</th>
                        <th>Amount</th>
                        <th>Status</th>
                        {/* <th>actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory?.map((order, key) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>
                            <Link to={`/customers/manage/order/${order?._id.toString()} `}>#{key+1}<Icons.TbExternalLink /></Link>
                          </td>
                          <td>{order?.merchantOrderId}</td>
                          <td>{order?.payMode}</td>
                          <td>{order?.amount}</td>
                          <td className="td_status">
                            {order.status.toLowerCase() === "processing" ||
                              order.status.toLowerCase() === "completed" ||
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
                              order.status.toLowerCase() === "locked" ||
                              order.status.toLowerCase() === "discontinued" ? (
                              <Badge
                                label={order.status}
                                className="light-danger"
                              />
                            ) : order.status.toLowerCase() === "on sale" ||
                              order.status.toLowerCase() === "featured" ||
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
                              "nodata"
                            )}
                          </td>

                          {/* <td className="td_action">
                            <TableAction
                              actionItems={actionItems}
                              onActionItemClick={(item) =>
                                handleActionItemClick(item, product._id)
                              }
                            />
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* <div className="content_item">
              <h2 className="sub_heading">reviews</h2>
              <div className="column">
                <table className="bordered">
                  <thead>
                    <tr>
                      <th className="td_id">ID</th>
                      <th>Product ID</th>
                      <th>Rating</th>
                      <th>Review Text</th>
                      <th>Review Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Reviews.map(review => (
                      <tr key={review.review_id}>
                        <td className="td_id">#{review.review_id}</td>
                        <td>{review.product_id}</td>
                        <td>
                          <Rating value={review.rating}/>
                        </td>
                        <td className="td_review"><p>{review.review_text}</p></td>
                        <td>{review.review_date}</td>
                        <td className="td_status">
                          {review.status.toLowerCase() === "active" ||
                           review.status.toLowerCase() === "completed" ||
                           review.status.toLowerCase() === "approved" ||
                           review.status.toLowerCase() === "delivered" ||
                           review.status.toLowerCase() === "shipped" ||
                           review.status.toLowerCase() === "new" ||
                           review.status.toLowerCase() === "coming soon" ? (
                             <Badge
                               label={review.status}
                               className="light-success"
                             />
                           ) : review.status.toLowerCase() === "inactive" ||
                             review.status.toLowerCase() === "out of stock" ||
                             review.status.toLowerCase() === "rejected" ||
                             review.status.toLowerCase() === "locked" ||
                             review.status.toLowerCase() === "discontinued" ? (
                             <Badge
                               label={review.status}
                               className="light-danger"
                             />
                           ) : review.status.toLowerCase() === "on sale" ||
                               review.status.toLowerCase() === "featured" ||
                               review.status.toLowerCase() === "processing" ||
                               review.status.toLowerCase() === "pending" ? (
                             <Badge
                               label={review.status}
                               className="light-warning"
                             />
                           ) : review.status.toLowerCase() === "archive" ||
                               review.status.toLowerCase() === "pause" ? (
                             <Badge
                               label={review.status}
                               className="light-secondary"
                             />
                           ) : (
                             review.status
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
          <div className="sidebar flex">
            {/* <div className="sidebar_item">
              <h2 className="sub_heading">Action</h2>
              <Button
                label="save & exit"
                icon={<Icons.TbDeviceFloppy />}
                className=""
              />
              <Button
                label="save"
                icon={<Icons.TbCircleCheck />}
                className="success"
              />
            </div> */}
            {/* <div className="sidebar_item">
              <h2 className="sub_heading">Status</h2>
              <div className="column">
                <Dropdown
                  placeholder="select stock status"
                  selectedValue={user.status}
                  onClick={handleStatusSelect}
                  options={status}
                // className="sm"
                />
              </div>
            </div> */}
            <div className="sidebar_item">
              <h2 className="sub_heading">Profile Picture</h2>
              <div className="column">
                <Thumbnail
                  preloadedImage={"/src/assets/dummy.jpg"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditCustomer