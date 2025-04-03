import React, { useState } from 'react'
import Input from '../common/Input';
import * as Icons from "react-icons/tb";
import MultiSelect from '../common/MultiSelect';

import CreatableSelect from 'react-select/creatable';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { zoneRoute } from '../../lib/endPoints';
import { toast } from 'sonner';

const SingleZone = ({ item, index }) => {
    const axiosPrivate = useAxiosPrivate()
    const [data, setData] = useState(item)
    const initialOptions = item?.pincodes?.map(item => ({ label: item, value: item })) ?? []

    const [selectedOptions, setSelectedOptions] = useState(initialOptions);

    const selectHandleChange = (newValue) => {
        setSelectedOptions(newValue);
    };

    const handleInputChange = (field, value) => {
        setData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        try {
            console.log("Btn clicked")
            const response = await axiosPrivate.put(`${zoneRoute}/${item?._id}`, {
                name: data?.name,
                pincodes: selectedOptions?.map(item => item?.value)
            })

            if (response?.data?.success) {
                toast.success("Updated")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <div>
                <label>Zone {index + 1}</label>
                <button onClick={handleSubmit}> Save</button>
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