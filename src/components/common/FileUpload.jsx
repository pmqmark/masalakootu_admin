import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as Icons from "react-icons/tb";
import Button from "./Button.jsx";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js"
import { uploadMultiFilesRoute } from '../../lib/endPoints.js';

const DropZone = ({ uploadedFiles, setUploadedFiles }) => {
  const axiosPrivate = useAxiosPrivate()
  const [loading, setLoading] = useState(false); 
  // const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback(async acceptedFiles => {
    // const filesWithPreview = acceptedFiles.map(file => Object.assign(file, {
    //   preview: URL.createObjectURL(file),
    //   id: Date.now() + file.name 
    // }));
    // setUploadedFiles(prevFiles => [...prevFiles, ...filesWithPreview]);
    setLoading(true);
    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('files', file)
    })

    try {
      const response = await axiosPrivate.post(uploadMultiFilesRoute, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      )
      const data = response?.data;

      if (data?.success === true && data?.data?.files?.length > 0) {
        setUploadedFiles([...uploadedFiles, ...data?.data?.files])
      }

    } catch (error) {
      console.error('Error uploading files:', error)
    }finally {
      setLoading(false); 
    }

  }, [uploadedFiles]);

  const onDelete = key => {
    const filtered = uploadedFiles?.filter(file => file.key !== key)
    console.log({ filtered })
    setUploadedFiles(filtered);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  console.log({ getRootProps: { ...getRootProps() }, getInputProps: { ...getInputProps() } })

  console.log({ uploadedFiles })

  return (
    <div className="drop-zone-container">
      <div {...getRootProps()} className="drop-zone">
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select files</p>
      </div>
      {loading && (
        <div className="flex justify-start items-center mt-4">
          <Icons.TbLoader2 className="animate-spin text-3xl text-blue-500" />
        </div>
      )}
      {
        uploadedFiles.length > 0 ?
          <div className="uploaded-images">
            {uploadedFiles?.map((file, key) => (
              <div key={key} className="uploaded-image-container">
                <figure className="uploaded-image">
                  <img src={file?.location} alt={file?.name} />
                  <Button onClick={() => onDelete(file?.key)} icon={<Icons.TbTrash />} className="sm" />
                </figure>
                <span className="line_clamp">{file?.name}</span>
              </div>
            ))}
          </div>
          : ""
      }
    </div>
  );
};

export default DropZone;
