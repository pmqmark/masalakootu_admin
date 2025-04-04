import { categoryRoute, getAllProducts } from "../../lib/endPoints.js";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Textarea from "../../components/common/Textarea.jsx";
import Thumbnail from "../../components/common/Thumbnail.jsx";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import MultiSelectDupe from "../../components/common/MultiSelectDupe.jsx";

const dummyImage = '../../../public/dummy.png';

const EditCategories = () => {
  const axiosPrivate = useAxiosPrivate();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { categoryid } = useParams();
  const navigate = useNavigate();

  // const [cataImage,setCataImage] = useState({});
  const [fields, setCategories] = useState({
    name: "",
    description: "",
    image: {},
    productIds: [],
    parent: null,
  });
  const [products, setProducts] = useState([]);
  const [options, setOptions] = useState([]);
  const [cataProducts, setCataProducts] = useState([]);

  const handleInputChange = (key, value) => {
    setCategories({
      ...fields,
      [key]: value,
    });
  };

  const selectProducts = (selectedOptions) => {
    setCategories({
      ...fields,
      productIds: selectedOptions,
    });
  };

  const getCats = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(`${categoryRoute}/all`);
      const data = res?.data?.data?.result;
      setCats(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const getACat = async (id) => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(`${categoryRoute}/${id}`);
      const data = res?.data?.data?.category;
      setCataProducts(data?.productIds);


      console.log(data)
      const fmtData = {
        image: data?.image,
        name: data?.name,
        description: data?.description,
        parent: data?.parent?._id,
        productIds: data?.productIds?.map(item => item?._id),
      };

      setOptions(data?.productIds?.map(item => ({ label: item?.name, value: item?._id })));
      setCategories(fmtData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch category details");
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(getAllProducts);
      if (res.data.success === true) {
        const assignedProductIds = cataProducts.map(p => p._id);
        const prods = res.data.data?.result
          ?.filter(prod => !assignedProductIds.includes(prod._id))
          ?.map(prod => ({
            value: prod._id,
            label: prod.name
          }));
        setProducts(prods);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      await getACat(categoryid);
      await getCats();
    } catch (error) {
      console.log(error);
      toast.error("Failed to refresh data");
    }
  };

  const submitHandler = async () => {
    setSaving(true);
    try {
      const existingProductIds = cataProducts.map(product => product._id);
      const allProductIds = [...new Set([
        ...existingProductIds,
        ...fields.productIds
      ])];
      const dataToSend = {
        ...fields,
        productIds: allProductIds
      };


      console.log(dataToSend, "all data")
      const res = await axiosPrivate.put(`${categoryRoute}/${categoryid}`, dataToSend);
      if (res.data.success === true) {
        toast.success("Category updated successfully");
        await refresh();
      }
      navigate("/catalog/categories/manage")
    } catch (error) {
      console.log(error);
      toast.error("Failed to update category");
    }
    finally {
      setSaving(false);
    }
  };

  const deleteProductFromCategory = async (productId) => {
    try {
      setLoading(true);
      // Filter out the product to be deleted
      const updatedProductIds = fields.productIds.filter(id => id !== productId);

      // Update local state immediately for better UX
      setCategories({
        ...fields,
        productIds: updatedProductIds,
      });

      // Update the options for MultiSelectDupe
      setOptions(options.filter(option => option.value !== productId));

      // Update the displayed products
      setCataProducts(cataProducts.filter(product => product._id !== productId));

      // Send the update to the server
      const res = await axiosPrivate.put(`${categoryRoute}/${categoryid}`, {
        ...fields,
        productIds: updatedProductIds,
      });

      if (res.data.success === true) {
        toast.success("Product removed from category");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove product");
      // Revert changes if API call fails
      await getACat(categoryid); // Refetch the category data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getACat(categoryid);
  }, [categoryid]);

  useEffect(() => {
    getCats();
    getProducts();
  }, []);


  console.log(fields, cataProducts)
  return (
    <div className="sidebar">
      <div className="bg-white p-[20px] w-full flex flex-col md:flex-row gap-5">
        <div className="w-full flex flex-col gap-3 mb-5 md:mb-10">
          <h2 className="sub_heading">Edit Category</h2>
          <div className="">
            <Thumbnail
              setImage={handleInputChange}
              preloadedImage={fields.image?.location}
            />
          </div>

          <div className="">
            <Input
              type="text"
              placeholder="Enter category name"
              label="Name"
              required
              value={fields.name}
              onChange={(value) => handleInputChange("name", value)}
            />
          </div>

          <div className="">
            <Textarea
              type="text"
              placeholder="Description"
              label="Description"
              value={fields.description}
              onChange={(value) => handleInputChange("description", value)}
            />
          </div>

          <div className="z-50">
            <MultiSelectDupe
              label="Select Products"
              placeholder="Select Products"
              onChange={selectProducts}
              isMulti={true}
              options={products}
              isSelected={options}
            />
          </div>

          <div className="input_field_wrapper flex flex-col items-start gap-2">
            <label className="text-sm">Select Parent</label>
            <select
              value={fields.parent || ""}
              onChange={(e) => handleInputChange("parent", e.target.value || null)}
              className="w-full p-3 rounded-lg border text-gray-400 focus:outline-none"
            >
              <option value="">Select a Parent</option>
              {cats?.map((item, index) => (
                <option key={index} value={item?._id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              label="Discard"
              className="right text-white border-none bg-red-500"
              onClick={() => navigate("/catalog/categories/manage")}
              disabled={loading}
            />
            <Button
              label={saving ? "Saving..." : "Save"}
              className="text-white bg-green-600 border-none"
              onClick={submitHandler}
              disabled={loading}>
              {saving && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </Button>
          </div>
        </div>

        <div className="w-full min-h-screen md:w-[40%]">
          <h2 className="sub_heading">Category Products</h2>
          {cataProducts.length === 0 ? (
            <p className="text-gray-500 mt-4">No products in this category</p>
          ) : (
            <div className="recent_orders column mt-3">
              {cataProducts?.map((product, key) => (
                <div key={key} className="recent_order border p-2 rounded shadow-lg flex justify-between items-center mb-3">
                  <Link
                    className="flex-grow flex items-center"
                  >
                    <figure className="recent_order_img w-16 h-16 flex-shrink-0">
                      <img
                        src={product?.thumbnail?.location || dummyImage}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </figure>
                    <div className="recent_order_content ml-3">
                      <h4 className="recent_order_title font-medium">{product?.name}</h4>
                      <div className="recent_order_details">
                        <h5 className="recent_order_price text-sm">
                          <span className="text-gray-500">Price: </span>
                          ₹{product?.price}
                        </h5>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => deleteProductFromCategory(product._id)}
                    className="ml-4 p-2 text-red-500 hover:text-red-700 transition-colors"
                    disabled={loading}
                    aria-label="Remove product"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCategories;