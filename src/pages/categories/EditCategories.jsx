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
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { archiveCategory, categoryRoute, getAllProducts } from "../../lib/endPoints.js";
import { toast } from "sonner";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal.jsx";
import { useParams } from "react-router-dom";
import MultiSelectDupe from "../../components/common/MultiSelectDupe.jsx";

const EditCategories = () => {
  const axiosPrivate = useAxiosPrivate();
  const [cats, setCats] = useState([])
  const [isLoading, setLoading] = useState(false)

  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemID, setSelectedItemID] = useState(null);
  const dummyImage = "../../../public/dummy.png"

  const { categoryid } = useParams()
  console.log({ categoryid })

  const navigate = useNavigate()

  const [cataImage] = useState({})
  const [fields, setCategories] = useState({
    name: "",
    description: "",
    image: cataImage,
    productIds: [],
    parent: null,
  });

  const [products, setProducts] = useState([]);
  const [options,setOptions] = useState([])

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

  const getACat = async (id) => {
    setLoading(true)
    try {
      const res = await axiosPrivate.get(`${categoryRoute}/${id}`);
      const data = res?.data?.data?.category

      const fmtData = {
        image: data?.image?.location,
        name: data?.name,
        description: data?.description,
        parent: data?.parent?._id,
        productIds: data?.productIds?.map(item => item?._id),
      }

      setOptions(data?.productIds?.map(item => ({ label: item?.name, value: item?._id })))

      setCategories(fmtData)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { getACat(categoryid) }, [categoryid])

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
      const res = await axiosPrivate.put(`${categoryRoute}/${categoryid}`, fields)
      if (res.data.success === true) {
        toast.success("Category updated")
        await refresh()
      }
    } catch (error) {
      console.log(error)
    }
  }


  console.log({ fields })

  return (
    <div className="sidebar">
      <div className="sidebar_item">
        <h2 className="sub_heading">edit category</h2>
        <div className="column">
          <Thumbnail
            setImage={handleInputChange}
          />
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
          <MultiSelectDupe
            label="Select Products"
            placeholder="Select Products"
            onChange={selectProducts}
            isMulti={true}
            options={products}
            isSelected={options}
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
          onClick={() => navigate("/catalog/categories/manage")}
        />
        <Button
          label="save"
          className="text-white bg-green-600 border-none"
          onClick={submitHandler}
        />
      </div>
    </div>
  )
}

export default EditCategories