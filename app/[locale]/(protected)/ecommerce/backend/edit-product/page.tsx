"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditProduct = ({ product }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    thumbnail: { location: "", name: "", key: "" },
    images: [],
    stock: 0,
    tags: [],
    isFeatured: false,
    isArchived: false,
    reviews: [],
    variations: [],
  });

  useEffect(() => {
    if (product) {
      setProductData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, { location: fileUrl, name: file.name, key: "" }],
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setProductData((prev) => ({
      ...prev,
      thumbnail: { location: fileUrl, name: file.name, key: "" },
    }));
  };

  const handleRemoveImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Product Data:", productData);
  };

  return (
    <Card className="max-w-lg mx-auto p-4 border rounded-lg shadow-md">
      <CardHeader>
        <h1 className="text-xl font-bold">Edit Product</h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Product Name *</label>
            <Input type="text" name="name" value={productData.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <Input type="text" name="description" value={productData.description} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium">Brand</label>
            <Input type="text" name="brand" value={productData.brand} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium">Price *</label>
            <Input type="number" name="price" value={productData.price} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-medium">Stock</label>
            <Input type="number" name="stock" value={productData.stock} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium">Tags</label>
            <Input type="text" name="tags" value={productData.tags} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium">Thumbnail *</label>
            {productData.thumbnail.location && (
              <img src={productData.thumbnail.location} alt="Thumbnail" className="w-24 h-24 object-cover border rounded" />
            )}
            <Input type="file" accept="image/*" onChange={handleThumbnailChange} className="mt-2" />
          </div>
          <div>
            <label className="block font-medium">Product Images *</label>
            <div className="flex gap-2 flex-wrap">
              {productData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image.location} alt={`Product ${index}`} className="w-24 h-24 object-cover border rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <Input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="isFeatured" checked={productData.isFeatured} onChange={handleChange} />
              <span>Featured Product</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="isArchived" checked={productData.isArchived} onChange={handleChange} />
              <span>Archive Product</span>
            </label>
          </div>
          <div className="col-span-12 flex justify-end">
            <Button type="submit">Update Product</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProduct;
