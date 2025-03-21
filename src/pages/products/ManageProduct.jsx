import * as Icons from "react-icons/tb";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Offcanvas from "../../components/common/Offcanvas.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import RangeSlider from "../../components/common/RangeSlider.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";
import { getAllProducts } from "../../lib/endPoints.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import axios from "../../config/axios.js";
import { TableLoading } from "../../components/common/TableLoading.jsx";
// import Products from "../../api/Products.json";

const ManageProduct = () => {
  const [fields, setFields] = useState({
    name: "",
    sku: "",
    store: "",
    status: "",
    priceRange: [0, 100],
  });
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const [tableRow, setTableRow] = useState([
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ]);

  const axiosPrivate = useAxiosPrivate();

  const handleInputChange = (key, value) => {
    setFields({
      ...product,
      [key]: value,
    });
  };
  // const products = Products;

  const getProduct = async () => {
    setLoading(true)
    try {
      const res = await axiosPrivate.get(getAllProducts);
      console.log(res.data, 'get all products');
      setProducts(res?.data?.data?.result)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProduct()
  }, [])

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
      products.forEach((product) => {
        updateChecks[product.id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckProduct = (isCheck, id) => {
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
      alert(`#${itemID} item delete`);
    } else if (updateItem === "edit") {
      navigate(`/catalog/product/manage/${itemID}`);
    }
  };

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const handleToggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  const handleCloseOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  const handleSliderChange = (newValues) => {
    setFields({
      ...fields,
      priceRange: newValues,
    })
  };

  const stores = [
    { label: 'FashionFiesta' },
    { label: 'TechTreasures' },
    { label: 'GadgetGrove' },
    { label: 'HomeHarbor' },
    { label: 'HealthHaven' },
    { label: 'BeautyBoutique' },
    { label: "Bookworm's Haven" },
    { label: 'PetParadise' },
    { label: 'FoodieFinds' }
  ];
  const status = [
    { label: 'In Stock' },
    { label: 'Out of Stock' },
    { label: 'Available Soon' },
    { label: 'Backorder' },
    { label: 'Refurbished' },
    { label: 'On Sale' },
    { label: 'Limited Stock' },
    { label: 'Discontinued' },
    { label: 'Coming Soon' },
    { label: 'New Arrival' },
    { label: 'Preorder' },
  ];
  const handleSelectStore = (selectedValues) => {
    setFields({
      ...fields,
      store: selectedValues,
    })
  };

  const handleSelectStatus = (selectedValues) => {
    setFields({
      ...fields,
      status: selectedValues.label,
    })
  };


  return (
    <section className="products">
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
              <Button
                label="Advance Filter"
                className="sm"
                icon={<Icons.TbFilter />}
                onClick={handleToggleOffcanvas}
              />
              <Input
                placeholder="Search Product..."
                className="sm table_search"
              />
              <Offcanvas
                isOpen={isOffcanvasOpen}
                onClose={handleCloseOffcanvas}
              >
                <div className="offcanvas-head">
                  <h2>Advance Search</h2>
                </div>
                <div className="offcanvas-body">
                  <div className="column">
                    <Input
                      type="text"
                      placeholder="Enter the product name"
                      label="Name"
                      value={fields.name}
                      onChange={(value) => handleInputChange("name", value)}
                    />
                  </div>
                  <div className="column">
                    <Input
                      type="text"
                      label="Price"
                      value={fields.price}
                      placeholder="Enter the product price"
                      onChange={(value) => handleInputChange("price", value)}
                    />
                  </div>
                  <div className="column">
                    <MultiSelect
                      options={stores}
                      placeholder="Select Store"
                      label="Store"
                      isSelected={fields.store}
                      onChange={handleSelectStore}
                    />
                  </div>
                  <div className="column">
                    <Dropdown
                      options={status}
                      placeholder="Select Store"
                      label="Store"
                      selectedValue={fields.status}
                      onClick={handleSelectStatus}
                    />
                  </div>
                  <div className="column">
                    <RangeSlider label="Price range" values={fields.priceRange} onValuesChange={handleSliderChange} />
                  </div>
                </div>
                <div className="offcanvas-footer">
                  <Button
                    label="Discard"
                    className="sm outline"
                    icon={<Icons.TbX />}
                    onClick={handleCloseOffcanvas}
                  />
                  <Button
                    label="Filter"
                    className="sm"
                    icon={<Icons.TbFilter />}
                    onClick={handleCloseOffcanvas}
                  />
                </div>
              </Offcanvas>
              <div className="btn_parent">
                <Link to="/catalog/product/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Create Product</span>
                </Link>
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
                      <th className="td_image">image</th>
                      <th colSpan="4">name</th>
                      <th>price</th>
                      <th>store</th>
                      <th>sku</th>
                      <th>created at</th>
                      <th className="td_status">status</th>
                      <th className="td_status">stock status</th>
                      <th className="td_action">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      isLoading ? (
                        <tr>
                        <td colSpan="13" className="text-center">
                          <TableLoading />
                        </td>
                      </tr>
                      ) : (
                        products.map((product, key) => {
                          return (
                            <tr key={key}>
                              <td className="td_checkbox">
                                <CheckBox
                                  onChange={(isCheck) =>
                                    handleCheckProduct(isCheck, product?._id)
                                  }
                                  isChecked={specificChecks[product?._id] || false}
                                />
                              </td>
                              <td className="td_id">{product?._id}</td>
                              <td className="td_image">
                                {
                                  product?.thumbnail ? (<img
                                    src={product?.thumbnail?.location}
                                    alt={product?.name}
                                  />) : (<img
                                    src='/public/dummy.jpg'
                                    alt={product?.name}
                                  />
                                  )
                                }

                              </td>
                              <td colSpan="4">
                                <Link to={product.id}>{product.name}</Link>
                              </td>
                              <td>
                                {`${product.price} `}
                                <b>{product?.currency}</b>
                              </td>
                              <td>
                                <Link>{product?.brand}</Link>
                              </td>
                              <td>{product?.sku}</td>
                              <td>{product?.createdAt.split("T")[0]}</td>
                              <td className="td_status">
                                {product?.ratings?.average_rating}
                              </td>
                              <td className="td_status">
                                {product?.stock ? (
                                  <Badge
                                    label="In Stock"
                                    className="light-success"
                                  />
                                ) : product?.stock < 10 &&
                                  product?.stock > 0 ? (
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
                              <td className="td_action">
                                <TableAction
                                  actionItems={actionItems}
                                  onActionItemClick={(item) =>
                                    handleActionItemClick(item, product?._id)
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })
                      )
                    }

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

export default ManageProduct;
