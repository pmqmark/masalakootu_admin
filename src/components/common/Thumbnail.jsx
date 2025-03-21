import { useState } from "react";
import * as Icons from "react-icons/tb";
import Button from './Button.jsx';
import Image from '../../images/common/thumbnail.png';
import { toast } from "sonner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { uploadSingleFilesRoute } from "../../lib/endPoints.js";
import FadeLoader from "react-spinners/FadeLoader";

const Thumbnail = ({ className, required, preloadedImage, onClick, setImage }) => {
  const axiosPrivate = useAxiosPrivate();
  const [uploadedImage, setUploadedImage] = useState(preloadedImage || null);
  const [isLoading, setLoading] = useState(false)

  const handleDelete = () => {
    setUploadedImage(null);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }

    const formData = new FormData();
    formData.append("file", file)

    setLoading(true);
    try {
      const res = await axiosPrivate.post(uploadSingleFilesRoute, formData, {
        headers: {
          'Content-Type': "multipart/form-data"
        }
      });
      console.log(res?.data);
      const data = res?.data;
      if (data?.success === true) {
        toast.success(res?.data?.message);

        const { size, ...rest } = res?.data?.data?.file || {}
        setImage("image", rest)
        console.log(size)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Please contact your site providers")
    } finally {
      setLoading(false)
    }
  };

  if (isLoading) {
    return (<div className={`thumbnail ${className ? className : ""}`} >
      <figure className="uploaded-image">
        <div className="my-10">
          <FadeLoader />
        </div>
        <label htmlFor="imageUpload">
          <Icons.TbPencil className="thumbnail_edit" />
        </label>
      </figure>
    </div>)
  }

  return (
    <>
      <div className={`thumbnail ${className ? className : ""}`} >
        <figure className="uploaded-image">
          {uploadedImage ? (
            <img src={uploadedImage} alt="Product Thumbnail" />
          ) : (
            <img src={Image} className="defualt_img" alt="Product Thumbnail" />
          )}
          <label htmlFor="imageUpload">
            <Icons.TbPencil className="thumbnail_edit" />
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {uploadedImage && (
            <Button onClick={handleDelete} icon={<Icons.TbTrash />} className="delete_button sm" />
          )}
        </figure>
        {required ? <small>{required}</small> : ""}
      </div>
    </>
  );
};

export default Thumbnail;