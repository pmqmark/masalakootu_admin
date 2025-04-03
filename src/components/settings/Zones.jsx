import React, { useEffect, useState } from 'react'
import Input from '../common/Input';
import * as Icons from "react-icons/tb";
import MultiSelect from '../common/MultiSelect';
import axios from '../../config/axios';
import { zoneRoute } from '../../lib/endPoints';
import SingleZone from './SingleZone';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'sonner';

const Zones = () => {
    const axiosPrivate = useAxiosPrivate()
    const [zonelist, setZonelist] = useState([]);

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


    const addNewZone = async () => {
        const existingZones = zonelist.filter(zone => zone.name.startsWith("New Zone"));

        let newZoneNumber = 1;
        if (existingZones.length > 0) {
            const numbers = existingZones
                .map(zone => parseInt(zone.name.replace("New Zone ", ""), 10))
                .filter(num => !isNaN(num));

            newZoneNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 2;
        }

        const newZoneName = `New Zone ${newZoneNumber}`;

        const response = await axiosPrivate.post(`${zoneRoute}`, { name: `${newZoneName}`, pincodes: [] })

        if (response?.data?.success) {
            toast.success("New Zone Added")
            setZonelist((prev) => ([...prev, response?.data?.data?.result]))
        }
    }

    const removeZone = async (itemId) => {
        const response = await axiosPrivate.delete(`${zoneRoute}/${itemId}`)

        if (response?.data?.success) {
            toast.success("Zone Deleted")
            const newList = zonelist.filter(item => item?._id?.toString() !== itemId)
            setZonelist(newList)
        }
    }

    useEffect(() => { getManyZones() }, [])


    return (
        <div className={`flex flex-col gap-4`}>
            <div className='flex'>
                <h2 className="sub_heading">Zone-wise Pincodes</h2>
                <button
                    onClick={addNewZone}
                    className={`bg-blue-500 text-white px-2 rounded text-sm `}
                >Add</button>
            </div>

            {
                zonelist?.map((item, index) => (
                    <SingleZone key={item?._id} item={item} index={index} removeHandler={removeZone} />
                ))
            }
        </div>
    )
}

export default Zones