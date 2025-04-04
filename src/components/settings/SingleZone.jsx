import React, { useState } from 'react'
import Input from '../common/Input';
import * as Icons from "react-icons/tb";
import MultiSelect from '../common/MultiSelect';

import CreatableSelect from 'react-select/creatable';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { zoneRoute } from '../../lib/endPoints';
import { toast } from 'sonner';

const SingleZone = ({ item, index, removeHandler }) => {
    const axiosPrivate = useAxiosPrivate()
    const [data, setData] = useState(item)
    const initialOptions = item?.pincodes?.map(item => ({ label: item, value: item })) ?? []

    const [selectedOptions, setSelectedOptions] = useState(initialOptions);

    const selectHandleChange = (newValue) => {
        setSelectedOptions(newValue);
        setData((prev) => ({ ...prev, pincodes: newValue?.map(item => item?.value) }))
    };

    const handleInputChange = (field, value) => {
        setData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        try {
            console.log("Btn clicked")

            if (!data?.name?.trim()) {
                return toast.info('Add a name')
            }

            const response = await axiosPrivate.put(`${zoneRoute}/${item?._id}`, data)

            if (response?.data?.success) {
                toast.success("Updated")
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
                <label>Zone no. {index + 1}</label>
                <button
                    onClick={handleSubmit}
                    className={`bg-green-600 text-white px-2 rounded text-sm`}
                >
                    Save</button>

                <button
                    onClick={() => removeHandler(item?._id)}
                    className={`bg-red-600 text-white px-2 rounded text-sm`}
                >
                    Remove</button>

            </div>
            <div className='flex flex-col gap-4'>
                <Input
                    type="text"
                    placeholder="Enter the Zone name"
                    label="Zone Name"
                    icon={<Icons.TbSmartHome />}
                    value={data?.name}
                    onChange={(value) => handleInputChange("name", value)}
                />

                <label className={`text-sm`}>Enter Pincodes</label>
                <div className='w-full'>
                    <CreatableSelect
                        isMulti
                        options={initialOptions}
                        value={selectedOptions}
                        onChange={selectHandleChange}
                    />
                </div>

                {/* <p>Current Pincodes:</p>
                <pre>{JSON.stringify(selectedOptions?.map(item => item?.label))}</pre> */}

            </div>

        </div>
    )
}

export default SingleZone