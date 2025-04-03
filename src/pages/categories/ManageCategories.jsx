import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Divider from "../../components/common/Divider.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Textarea from "../../components/common/Textarea.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Thumbnail from "../../components/common/Thumbnail.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import TableSkeleton from "../../components/common/TableSkeleton.jsx";
// import * as Icons from "react-icons/tb";
// import Categories from "../../api/Categories.json";
// import Pagination from "../../components/common/Pagination.jsx";
// import Toggler from "../../components/common/Toggler.jsx";
import { archiveCategory, categoryRoute, getAllProducts } from "../../lib/endPoints.js";
import { toast } from "sonner";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal.jsx";

const ManageCategories = () => {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setLoading] = useState(false)
  const [cats, setCats] = useState([])
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  // edit category
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemID, setSelectedItemID] = useState(null);
  const navigate = useNavigate();

  // ------Pagination----------
  // const [currentPage, setCurrentPage] = useState(1);
  // const [selectedValue, setSelectedValue] = useState(5);
  // const [tableRow, setTableRow] = useState([
  //   { value: 2, label: "2" },
  //   { value: 5, label: "5" },
  //   { value: 10, label: "10" },
  // ]);

  const [cataImage] = useState({})
  const [fields, setCategories] = useState({
    name: "",
    description: "",
    image: cataImage,
    productIds: [],
    parent: null,
  });

  const [products, setProducts] = useState([]);
  const dummyImage = "../../../public/dummy.png"

  const handleInputChange = (key, value) => {
    setCategories({
      ...fields,
      [key]: value,
    });
  };

  const selectProducts = (selectedOptions) => {
    console.log({ selectedOptions })
    setCategories({
      ...fields,
      productIds: selectedOptions,
    });
  };


  const bulkAction = [
    { value: "delete", label: "Delete" },
    { value: "category", label: "Category" },
    { value: "status", label: "Status" },
  ];

  const bulkActionDropDown = (selectedOption) => {
    console.log(selectedOption);
  };

  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      fields.forEach((category) => {
        updateChecks[category.id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckCategory = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item?.toLowerCase();

    console.log(updateItem)
    if (updateItem === "delete" || updateItem === "enable") {
      setSelectedItemID(itemID);
      setIsModalOpen(true);
    }
    else if (updateItem === "edit") {
      navigate(`/catalog/categories/${itemID}`)
      // toast.warning("Please Contact Your Developer Team")
    }
  };

  const getCats = async () => {
    setLoading(true)
    try {
      const res = await axiosPrivate.get(`${categoryRoute}/all`);
      const data = res?.data?.data?.result
      setCats(data)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getProducts = async () => {
    setLoading(true)
    try {
      const res = await axiosPrivate.get(getAllProducts);

      if (res.data.success === true) {
        const prods = res.data.data?.result?.map(prod => ({
          value: prod._id,
          label: prod.name
        }))

        setProducts(prods)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCats()
    getProducts()
  }, [])

  const refresh = async () => {
    try {
      setCategories({
        name: "",
        description: "",
        productIds: [],
      })

      await getCats()

    } catch (error) {
      console.log(error)
    }
  }

  const submitHandler = async () => {
    console.log(fields);
    try {
      const res = await axiosPrivate.post(categoryRoute, fields)
      if (res.data.success === true) {
        toast.success("New Category added")
        await refresh()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      // Find the selected product before updating the state
      const selectedProduct = cats.find((p) => p._id === selectedItemID);
      const newStatus = selectedProduct?.isArchived ? "unarchived" : "archived";

      // console.log(newStatus,selectedProduct,products,selectedItemID)
      // Optimistically update the UI
      // setCats((prevProducts) =>
      //   prevProducts.map((p) =>
      //     p._id === selectedItemID ? { ...p, isArchived: !p.isArchived } : p
      //   )
      // );

      // Send the request to update the status
      const response = await axiosPrivate.patch(`${archiveCategory}/${selectedItemID}`, {
        status: newStatus,
      });


      console.log(response?.data)
      if (response.status === 201) {
        toast.success(`Product ${newStatus} successfully!`);
        getCats()
      }

      console.log(response)
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status.");
    } finally {
      setIsModalOpen(false); // Close modal after action
    }
  };

  console.log({ fields })

  return (
    <>
      {/* conformation modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemID={selectedItemID}
      />
      <section className="categories">
        <div className="container">
          <div className="wrapper flex flex-col md:flex-row">
            {/* category  */}
            <div className="sidebar">
              <div className="sidebar_item">
                <h2 className="sub_heading">add category</h2>
                <div className="column">
                  <Thumbnail setImage={handleInputChange} />
                </div>

                <div className="column">
                  <Input
                    type="text"
                    placeholder="Enter the fields name"
                    label="Name"
                    required
                    value={fields.name}
                    onChange={(value) => handleInputChange("name", value)}
                  />
                </div>

                <div className="column">
                  <Textarea
                    type="text"
                    placeholder="Description"
                    label="Description"
                    value={fields.description}
                    onChange={(value) => handleInputChange("description", value)}
                  />
                </div>
                <Divider />

                <div className="column">
                  <MultiSelect
                    label="Select Products"
                    placeholder="Select Products"
                    onChange={selectProducts}
                    isMulti={true}
                    options={products}
                    isSelected={null}
                  />
                </div>

                <div className="column input_field_wrapper  flex flex-col items-start gap-2 ">
                  {
                    <label className="text-sm" >Select Parent</label>
                  }
                  <select
                    label="Select parent"
                    placeholder="Select parent"
                    value={fields.parent}
                    onChange={(e) => handleInputChange("parent", e.target.value || null)}
                    className="w-full p-3 rounded-lg border text-gray-400 focus:outline-none "
                  >
                    <option value="">Select a Parent</option>
                    {
                      cats?.map((item) => (
                        <option value={item?._id}> {item.name} </option>
                      ))
                    }
                  </select>
                </div>

                {/* <div className="column">
                <Dropdown
                  label="Status"
                  placeholder="Select Status"
                  onClick={selectSelect}
                  options={statusOptions}
                  selectedValue={fields.status}
                />
              </div>

              <div className="column">
                <Toggler
                  label="Is featured?"
                  checked={fields.isFeatured}
                  onChange={handleFeaturedChange}
                />
              </div> */}

                <Divider />
                <Button
                  label="Discard"
                  className="right text-white border-none bg-red-500"
                />
                <Button
                  label="save"
                  className="text-white bg-green-600 border-none"
                  onClick={submitHandler}
                />
              </div>
            </div>

            {/* table */}
            <div className="content transparent">
              <div className="flex justify-between w-full">
                <Dropdown
                  placeholder="Bulk Action"
                  className="sm"
                  onClick={bulkActionDropDown}
                  options={bulkAction}
                />
                <Input
                  placeholder="Search Categories..."
                  className="sm table_search"
                />
                {/* <div className="btn_parent">
                <Link to="/catalog/category/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Create Categories</span>
                </Link>
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
                        <th className="td_image">image</th>
                        <th>name</th>
                        <th className="td_order">Description</th>
                        <th className="td_status">status</th>
                        <th>created at</th>
                        <th className="td_action">actions</th>
                      </tr>
                    </thead>
                    {isLoading ? (
                      <TableSkeleton ColumnCount={8} />
                    ) : (
                      <tbody>
                        {cats.map((category, key) => {
                          return (
                            <tr key={key}>
                              <td className="td_checkbox">
                                <CheckBox
                                  onChange={(isCheck) =>
                                    handleCheckCategory(isCheck, category.id)
                                  }
                                  isChecked={specificChecks[category.id] || false}
                                />
                              </td>
                              <td className="td_id">{key + 1}</td>
                              <td className="td_image">
                                <img src={category?.image?.location || dummyImage} alt={category.image?.name} />
                              </td>
                              <td>
                                <Link to={category._id}>{category.name}</Link>
                              </td>
                              <td className="td_order truncate max-w-[200px]">{category.description}</td>
                              <td className="td_status">
                                {category.isArchived ? (
                                  <Badge
                                    label={`Archived`}
                                    className="light-danger"
                                  />
                                ) : (
                                  <Badge
                                    label={`Active`}
                                    className="light-success"
                                  />
                                )}
                              </td>
                              <td>{category.createdAt?.split('T')[0] ?? 'NIL'}</td>
                              <td className="td_action">
                                <TableAction
                                  actionItems={category?.isArchived ? ["Enable", "edit"] : ["Delete", "edit"]}
                                  onActionItemClick={(item) =>
                                    handleActionItemClick(item, category._id)
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    )}
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

export default ManageCategories;
