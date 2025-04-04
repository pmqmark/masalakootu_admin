import React, { useEffect, useState } from 'react'
import Input from '../common/Input';
import * as Icons from "react-icons/tb";
import MultiSelect from '../common/MultiSelect';
import axios from '../../config/axios';
import { chargeRoute, zoneRoute } from '../../lib/endPoints';
import SingleCharge from './SingleCharge';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'sonner';


const Charges = () => {
    const axiosPrivate = useAxiosPrivate()
    const [chargelist, setchargelist] = useState([]);
    const [zonelist, setZonelist] = useState([]);

    const getManycharges = async () => {
        try {
            const response = await axios.get(chargeRoute)

            const data = response?.data;

            if (data.success === true) {
                const result = data?.data?.result;
                const alt = result?.map(item => ({ ...item, zone: item?.zone?._id }))
                setchargelist(alt)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const addNewcharge = async () => {
        const response = await axiosPrivate.post(`${chargeRoute}`, {
            kind: 'shipping',
            basis: 'weight',
            zone: null,
            criteria: []
        })

        if (response?.data?.success) {
            toast.success("New charge Added")
            const result = response?.data?.data?.result

            setchargelist((prev) => ([...prev, result]))
        }
    }

    const removecharge = async (itemId) => {
        const response = await axiosPrivate.delete(`${chargeRoute}/${itemId}`)

        if (response?.data?.success) {
            toast.success("charge Deleted")
            const newList = chargelist.filter(item => item?._id?.toString() !== itemId)
            setchargelist(newList)
        }
    }

    const getManyZones = async () => {
        try {
            const response = await axios.get(zoneRoute)

            const data = response?.data;

            if (data.success === true) {
                setZonelist(data?.data?.result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { getManycharges(); getManyZones() }, [])


    return (
        <div className={`flex flex-col gap-4`}>
            <div className='flex'>
                <h2 className="sub_heading">Delivery Charges</h2>
                <button
                    onClick={addNewcharge}
                    className={`bg-blue-500 text-white px-2 rounded text-sm `}
                >Add</button>
            </div>

            {
                chargelist?.map((item, index) => (
                    <SingleCharge key={item?._id} item={item} index={index} removeHandler={removecharge} zonelist={zonelist} />
                ))
            }
        </div>
    )
}

export default Charges