import React, { useState } from 'react'
import Input from '../common/Input';
import * as Icons from "react-icons/tb";
import MultiSelect from '../common/MultiSelect';

import CreatableSelect from 'react-select/creatable';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { chargeRoute, zoneRoute } from '../../lib/endPoints';
import { toast } from 'sonner';
import PriceVsWt from './PriceVsWt';

const SingleCharge = ({ item, index, removeHandler, zonelist }) => {
    const axiosPrivate = useAxiosPrivate()
    const [data, setData] = useState(item)

    const handleInputChange = (field, value) => {
        setData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        try {
            console.log("Btn clicked")

            if (!data?.zone) {
                return toast.info('Select a Zone')
            }

            const response = await axiosPrivate.put(`${chargeRoute}/${item?._id}`, data)

            if (response?.data?.success) {
                toast.success("Updated")
            }

        } catch (error) {
            console.log(error)
        }
    }

    const addNewCriteria = () => {
        setData((prev) => ({ ...prev, criteria: [...prev.criteria, { value: 0, price: 0 }] }))
    }

    const removeCriteria = (idx) => {
        setData((prev) => ({ ...prev, criteria: prev.criteria?.filter((_, index) => index !== idx) }))
    }

    console.log({ data })

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
                <label>Charge {index + 1}</label>
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
                <div className="column input_field_wrapper  flex flex-col items-start gap-2 ">
                    {
                        <label className="text-sm" >Select zone</label>
                    }
                    <select
                        label="Select zone"
                        placeholder="Select zone"
                        value={data.zone}
                        onChange={(e) => handleInputChange("zone", e.target.value || null)}
                        className="w-full p-3 rounded-lg border text-gray-400 focus:outline-none "
                    >
                        <option value="">Select a zone</option>
                        {
                            zonelist?.map((item) => (
                                <option key={item?._id} value={item?._id}> {item.name} </option>
                            ))
                        }
                    </select>
                </div>

                <div className='w-full flex flex-col gap-4 '>
                    <div className='flex gap-4'>
                        <label>Weight Vs Price list</label>
                        <button
                            onClick={addNewCriteria}
                            className={`bg-blue-500 text-white px-2 rounded text-sm `}
                        > + </button>
                    </div>
                    {
                        data?.criteria?.map((item, index) => (
                            <PriceVsWt key={index} item={item} index={index} removeHandler={removeCriteria} data={data} setData={setData} />
                        ))
                    }
                </div>

            </div>

        </div>
    )
}

export default SingleCharge