import * as Icons from "react-icons/tb";
import Tags from "../../api/Tags.json";
import Taxes from "../../api/Taxes.json";
import Labels from "../../api/Labels.json";
import Products from "../../api/Products.json";
import React, { useState, useEffect } from "react";
import Variations from "../../api/Variations.json";
import Colloctions from "../../api/Colloctions.json";
import Modal from "../../components/common/Modal.jsx";
import Input from "../../components/common/Input.jsx";
import Tagify from "../../components/common/Tagify.jsx";
import Button from "../../components/common/Button.jsx";
import Attributes from "../../api/ProductAttributes.json";
import Divider from "../../components/common/Divider.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Textarea from "../../components/common/Textarea.jsx";
import Offcanvas from "../../components/common/Offcanvas.jsx";
import Accordion from "../../components/common/Accordion.jsx";
import FileUpload from "../../components/common/FileUpload.jsx";
import TextEditor from "../../components/common/TextEditor.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { productRoute } from "../../lib/endPoints.js";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";

const AddProduct = ({ productData }) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const editProduct = location.state?.product;

  const initialState = {
    name: "",
    description: "",
    brand: "",
    price: 0,
    thumbnail: null,
    images: [],
    stock: 0,
    variations: [],
    tags: [],
    hsn:"", 
    tax:0,
  };

  const clonedState = _.cloneDeep(initialState);

  const [product, setProduct] = useState(editProduct || initialState);

  const [selectOptions, setSelectOptions] = useState([
    {
      value: "success",
      label: "in stock",
    },
    {
      value: "danger",
      label: "out of stock",
    },
    {
      value: "warning",
      label: "On backorder",
    },
  ]);

  const [selectedValue, setSelectedValue] = useState({
    stockValue: "",
    attribute: "",
    attributeValue: "",
  });

  const handleInputChange = (key, value) => {
    setProduct({
      ...product,
      [key]: value,
    });
  };

  // useEffect(() => {
  //   const profit = product.price - product.costPerItem;
  //   const margin = profit / product.price * 100;
  //   setProduct({
  //     ...product,
  //     profit: profit,
  //     margin: margin ? margin : '',
  //   });
  // }, [product.price, product.costPerItem])

  const handleStockSelect = (selectedOption) => {
    setSelectedValue({
      ...selectedValue,
      stockValue: selectedOption.label,
    });
  };

  const attributes = Attributes.map((attribute) => ({
    label: attribute.name,
    value: attribute.name,
  }));

  const [attributeOption, setAttributeOption] = useState(attributes);

  const handleAttributeSelect = (selectedOption) => {
    setSelectedValue({
      ...selectedValue,
      attribute: selectedOption.label,
    });
  };

  const [faqs, setFaqs] = useState([]);

  const handleFaqQuestion = (e) => {
    e.preventDefault();
    if (product.question && product.answer) {
      setFaqs([
        ...faqs,
        {
          question: product.question,
          answer: product.answer,
        },
      ]);
      setProduct({
        ...product,
        question: "",
        answer: "",
      });
    }
  };

  const uniqueCategories = [
    ...new Set(Products.map((product) => product.category)),
  ];

  const category = uniqueCategories.map((category) => ({
    label: category,
  }));

  const [tags, setTags] = useState(Tags);
  const [taxes, setTaxes] = useState(Taxes);
  const [colloctions, setColloctions] = useState(Colloctions);
  const [labels, setLabels] = useState(Labels);

  const handleCheckTax = (id, checked) => {
    setTaxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, isChecked: checked } : checkbox
      )
    );
  };
  const handleCheckCollection = (id, checked) => {
    setColloctions((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, isChecked: checked } : checkbox
      )
    );
  };
  const handleCheckLabels = (id, checked) => {
    setLabels((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, isChecked: checked } : checkbox
      )
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getAttributesString = (attributes) => {
    const availableAttributes = Object.values(attributes).filter(
      (value) => value
    );
    return availableAttributes.join(" / ");
  };

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const handleOpenOffcanvas = () => {
    setIsOffcanvasOpen(true);
  };

  const handleCloseOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  const actionItems = ["Delete", "View"];

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item.toLowerCase();
    if (updateItem === "delete") {
      alert(`#${itemID} item delete`);
    } else if (updateItem === "view") {
      setIsOffcanvasOpen(true);
    }
  };

  console.log({ product });
  console.log({ initialState });

  const submitHandler = async () => {
    try {
      let response;
      if (editProduct) {
        // Update existing product
        response = await axiosPrivate.put(`${productRoute}/${editProduct._id}`, product);
      } else {
        // Create a new product
        response = await axiosPrivate.post(productRoute, product);
      }
  
      const data = response?.data;
      if (data?.success === true) {
        toast.success(editProduct ? "Product Updated" : "New Product Added");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  

  const saveAndExit = async () => {
    await submitHandler();
    navigate("/catalog/product/manage");
  };

  const saveProduct = async () => {
    await submitHandler();
    const clonedState = _.cloneDeep(initialState);
    setProduct(clonedState);
  };

  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">Product Info</h2>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the product name"
                  label="Name"
                  icon={<Icons.TbShoppingCart />}
                  value={product.name}
                  onChange={(value) => handleInputChange("name", value)}
                />
              </div>

              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the HSN code"
                  label="HSN Code"
                  value={product.hsn}
                  onChange={(value) => handleInputChange("hsn", value)}
                />
              </div>

              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the Brand"
                  label="Brand"
                  value={product.brand}
                  onChange={(value) => handleInputChange("brand", value)}
                />
              </div>

              <div className="column">
                <TextEditor
                  label="Description"
                  placeholder="Enter a description"
                  value={product.description}
                  onChange={(value) => handleInputChange("description", value)}
                />
              </div>
            </div>

            <div className="content_item">
              <h2 className="sub_heading">Product Images</h2>
              <FileUpload
                uploadedFiles={product?.images}
                setUploadedFiles={(val) =>
                  setProduct((prev) => ({ ...prev, images: val }))
                }
              />
            </div>

            <div className="content_item">
              <h2 className="sub_heading">Thumbnail</h2>
              <FileUpload
                uploadedFiles={product?.thumbnail ? [product?.thumbnail] : []}
                setUploadedFiles={(val) =>
                  setProduct((prev) => ({
                    ...prev,
                    thumbnail: val[val?.length - 1],
                  }))
                }
              />
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">Publish</h2>
              <Button
                label="save & exit"
                icon={<Icons.TbDeviceFloppy />}
                className="success"
                onClick={saveAndExit}
              />

              {/* <Button
                label="save"
                icon={<Icons.TbCircleCheck />}
                className=""
                onClick={saveProduct}
              /> */}
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">
                <span>Price</span>
              </h2>
              <div className="column">
                <Input
                  type="number"
                  placeholder="Enter the price"
                  value={product.price}
                  onChange={(value) =>
                    handleInputChange("price", parseFloat(value))
                  }
                  className="sm"
                />
              </div>
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">
                <span>tax %</span>
              </h2>
              <div className="column">
                <Input
                  type="number"
                  placeholder="Enter the tax"
                  value={product.tax}
                  onChange={(value) =>
                    handleInputChange("tax", parseFloat(value))
                  }
                  className="sm"
                />
              </div>
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">
                <span>stock</span>
              </h2>
              <div className="column">
                <Input
                  type="number"
                  placeholder="Enter the product quantity"
                  value={product.stock}
                  onChange={(value) =>
                    handleInputChange("stock", parseInt(value))
                  }
                  className="sm"
                />
              </div>
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">tags</h2>
              <Tagify
                tagsData={Tags}
                tags={product.tags}
                setTags={(val) =>
                  setProduct((prev) => ({ ...prev, tags: val }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
