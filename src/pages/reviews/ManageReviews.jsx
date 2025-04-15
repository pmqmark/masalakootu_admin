import * as Icons from "react-icons/tb";
import Reviews from "../../api/Reviews.json";
import Products from "../../api/Products.json";
import Customers from "../../api/Customers.json";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Rating from "../../components/common/Rating.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import SelectOption from "../../components/common/SelectOption.jsx";
import useGetAllReviews from "../../hooks/reviewsHooks/useGetAllReviews.js";
import TableSkeleton from "../../components/common/TableSkeleton.jsx";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal.jsx";
import { reviewsApi } from "../../lib/endPoints.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { toast } from "sonner";

const ManageReviews = () => {
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemID, setSelectedItemID] = useState(null);
  const navigate = useNavigate();
  const [tableRow, setTableRow] = useState([
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ]);
  const { reviews, loading, error, refetch } = useGetAllReviews();
  const axiosPrivate = useAxiosPrivate();
  const productIds = Reviews.map((review) => review.product_id.toString());
  const customerIds = Reviews.map((review) => review.customer_id.toString());

  const product = Products.filter((product) =>
    productIds.includes(product.id.toString())
  );
  const customer = Customers.filter((customer) =>
    customerIds.includes(customer.id.toString())
  );
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
      reviews.forEach((review) => {
        updateChecks[review.review_id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckReview = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const showTableRow = (selectedOption) => {
    setSelectedValue(selectedOption.label);
  };

  const actionItems = ["Delete", "edit"];

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item.toLowerCase();
    if (updateItem === "delete") {
      setSelectedItemID(itemID);
      console.log(itemID)
      setIsModalOpen(true);
    } else if (updateItem === "edit") {
      navigate(`/reviews/${itemID}`);
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      // Find the selected product before updating the state
      const selectedReviews = reviews.find((p) => p._id === selectedItemID);
      const newStatus = selectedReviews?.isArchived ? "unarchived" : "archived";
      // Send the request to update the status
      const response = await axiosPrivate.patch(`${reviewsApi}/${selectedItemID}`, {
        status: newStatus,
      });

      if (response.status === 200) {
        toast.success(`Review ${newStatus} successfully!`);
        refetch()
      }
    } catch (error) {
      console.error("Error updating Review status:", error);
      toast.error("Failed to update Review status.");
    } finally {
      setIsModalOpen(false); // Close modal after action
    }
  };

  return (
    <section className="reviews">
      <div className="container">
        <div className="wrapper">
          <div className="content transparent">
            <div className="content_head justify-between">
              <Dropdown
                placeholder="Bulk Action"
                className="sm"
                onClick={bulkActionDropDown}
                options={bulkAction}
              />
              <Input
                placeholder="Search Review..."
                className="sm table_search"
              />
              {/* <div className="btn_parent">
                <Link to="/catalog/review/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Create Review</span>
                </Link>
                <Button label="Advance Filter" className="sm" />
                <Button label="save" className="sm" />
              </div> */}
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
                      <th>Product</th>
                      <th>Customer</th>
                      <th>Stars</th>
                      <th>Comment</th>
                      <th>created at</th>
                      <th className="td_status">status</th>
                      <th>actions</th>
                    </tr>
                  </thead>
                  {loading ? (
                    <TableSkeleton ColumnCount={9} />
                  ) : (
                    reviews.map((review, key) => {
                      return (
                        <tbody>
                          <tr key={key}>
                            <td className="td_checkbox">
                              <CheckBox
                                onChange={(isCheck) =>
                                  handleCheckReview(
                                    isCheck,
                                    review._id.toString()
                                  )
                                }
                                isChecked={
                                  specificChecks[review._id.toString()] || false
                                }
                              />
                            </td>
                            <td className="td_id">{key+1}</td>
                            <td>{review?.productId?.name}</td>
                            <td>
                              <Link
                                to={`/customers/manage/${review?.userId?._id}`}
                              >{`${review?.userId?.firstName} ${review?.userId?.lastName}`}</Link>
                            </td>
                            <td>
                              <Rating value={review.rating} />
                            </td>
                            <td className="td_review">
                              <p>{review.comment}</p>
                            </td>
                            <td>
                              {new Date(review.createdAt).toLocaleString(
                                "en-US",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }
                              )}
                            </td>

                            <td className="td_status">
                              {review.isArchived === false  ? (
                                <Badge
                                  label="Active"
                                  className="light-success"
                                />
                              ) : (
                                <Badge
                                  label="Inactive"
                                  className="light-danger"
                                />
                              )}
                            </td>

                            <td className="td_action">
                              <TableAction
                                actionItems={actionItems}
                                onActionItemClick={(item) =>
                                  handleActionItemClick(item, review._id)
                                }
                              />
                            </td>
                          </tr>
                        </tbody>
                      );
                    })
                  )}
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
        {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleDeleteConfirm}
              itemID={selectedItemID}
            />
    </section>
  );
};

export default ManageReviews;
