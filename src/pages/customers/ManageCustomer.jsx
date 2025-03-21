import { usersBlockRoute, usersRoute } from "../../lib/endPoints.js";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import TableSkeleton from "../../components/common/TableSkeleton.jsx";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal.jsx";
// import * as Icons from "react-icons/tb";
// import SelectOption from "../../components/common/SelectOption.jsx";
// import Pagination from "../../components/common/Pagination.jsx";
// import Customers from "../../api/Customers.json";
// import Button from "../../components/common/Button.jsx";

const ManageCustomer = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setLoading] = useState(true)
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});

  // edit customer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemID, setSelectedItemID] = useState(null);

  // ------Pagination----------
  // const [currentPage, setCurrentPage] = useState(1);
  // const [selectedValue, setSelectedValue] = useState(5);
  // const [tableRow, setTableRow] = useState([
  //   { value: 2, label: "2" },
  //   { value: 5, label: "5" },
  //   { value: 10, label: "10" },
  // ]);

  const [customers, setCustomers] = useState([]);

  const bulkAction = [
    { value: "delete", label: "Delete" },
    // { value: "category", label: "Category" },
    { value: "status", label: "Status" },
  ];

  const bulkActionDropDown = (selectedOption) => {
    console.log(selectedOption);
  };

  // const onPageChange = (newPage) => {
  //   setCurrentPage(newPage);
  // };

  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      customers.forEach((customer) => {
        updateChecks[customer.id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckCustomer = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  // const showTableRow = (selectedOption) => {
  //   setSelectedValue(selectedOption.label);
  // };

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item?.toLowerCase();
    if (updateItem === "block" || updateItem === "unblock") {
      setSelectedItemID(itemID);
      setIsModalOpen(true);
    } else if (updateItem === "view") {
      navigate(`/customers/manage/${itemID}`);
    }
  };

  const getCustomers = async () => {
    setLoading(true)
    try {
      const res = await axiosPrivate.get(`${usersRoute}?role=user`);
      console.log(res.data, 'get all Customers');
      setCustomers(res?.data?.data?.users)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCustomers()
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      // Find the selected product before updating the state
      const selectedProduct = customers.find((p) => p._id === selectedItemID);
      const newStatus = selectedProduct?.isBlocked ? "unblocked" : "blocked";

      // Optimistically update the UI
      setCustomers((prevProducts) =>
        prevProducts.map((p) =>
          p._id === selectedItemID ? { ...p, isBlocked: !p.isBlocked } : p
        )
      );

      // Send the request to update the status
      const response = await axiosPrivate.patch(`${usersBlockRoute}/${selectedItemID}`, {
        status: newStatus,
      });


      console.log(response?.data)
      if (response.status === 201) {
        toast.success(`Product ${newStatus} successfully!`);
      }

      console.log(response)
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status.");
    } finally {
      setIsModalOpen(false); // Close modal after action
    }
  };


  return (
    <>
      {/* conformation modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemID={selectedItemID}
      />

      <section className="customer">
        <div className="container">
          <div className="wrapper">
            <div className="content transparent">
              <div className="content_head flex justify-between">
                <Dropdown
                  placeholder="Bulk Action"
                  className="sm"
                  onClick={bulkActionDropDown}
                  options={bulkAction}
                />
                <Input
                  placeholder="Search Customer..."
                  className="sm table_search"
                />
                {/* <div className="btn_parent">
                <Link to="/customers/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Create Customer</span>
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
                        <th colSpan="4">name</th>
                        <th>email</th>
                        <th className="td_status">status</th>
                        <th className="td_date">created at</th>
                        <th>actions</th>
                      </tr>
                    </thead>
                    {isLoading ? (
                      <TableSkeleton ColumnCount={10} />
                    ) : (
                      <tbody>
                        {customers?.map((customer, key) => {
                          return (
                            <tr key={key}>
                              <td className="td_checkbox">
                                <CheckBox
                                  onChange={(isCheck) =>
                                    handleCheckCustomer(isCheck, customer._id)
                                  }
                                  isChecked={specificChecks[customer._id] || false}
                                />
                              </td>
                              <td className="td_id">{key + 1}</td>

                              <td colSpan="4">
                                <Link to={customer.id?.toString()}>
                                  {`${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`}
                                </Link>
                              </td>
                              <td>{customer?.email}</td>
                              <td className="td_status">
                                {customer.isBlocked ? (
                                  <Badge
                                    label={`Blocked`}
                                    className="light-danger"
                                  />
                                ) : (
                                  <Badge
                                    label={`Active`}
                                    className="light-success"
                                  />
                                )}
                              </td>
                              <td className="td_date">
                                {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN') : 'NIL'}
                              </td>

                              <td className="td_action">
                                <TableAction
                                  actionItems={customer?.isBlocked ? ["Unblock", "view"] : ["Block", "view"]}
                                  onActionItemClick={(item) =>
                                    handleActionItemClick(item, customer._id)
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    )
                    }
                  </table>
                </div>
              </div>
              {/* <div className="content_footer">
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
            </div> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ManageCustomer;