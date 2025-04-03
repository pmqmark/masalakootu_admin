import React, { useState } from 'react'
import Input from '../common/Input';
import * as Icons from "react-icons/tb";
import MultiSelect from '../common/MultiSelect';

import CreatableSelect from 'react-select/creatable';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { zoneRoute } from '../../lib/endPoints';
import { toast } from 'sonner';

const PriceVsWt = ({ item, index, removeHandler, data, setData }) => {

    const handleInputChange = (field, val) => {
        const modifiedCriteriaArr = data?.criteria?.map((elem, idx) => {
            if (idx === index) {
                elem[field] = val
            }
            return elem;
        })
        setData((prev) => ({ ...prev, criteria: modifiedCriteriaArr }))
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex gap-4'>
                <h4>Weight - Price : {index + 1}</h4>
                <button
                    onClick={() => removeHandler(index)}
                    className={`bg-red-600 text-white px-2 rounded text-sm`}
                > X </button>
            </div>

            <div className='flex gap-4'>
                <Input
                    type="text"
                    placeholder="Enter the weight in grams"
                    label="Weight in grams"
                    value={item?.value}
                    onChange={(value) => handleInputChange("value", value)}
                />

                <Input
                    type="text"
                    placeholder="Enter the price"
                    label="Price in Rs."
                    value={item?.price}
                    onChange={(value) => handleInputChange("price", value)}
                />

            </div>
        </div>
    )
}

export default PriceVsWt