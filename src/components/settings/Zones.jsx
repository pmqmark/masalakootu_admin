import React, { useEffect, useState } from 'react'
import Input from '../common/Input';
import * as Icons from "react-icons/tb";
import MultiSelect from '../common/MultiSelect';
import axios from '../../config/axios';
import { zoneRoute } from '../../lib/endPoints';
import SingleZone from './SingleZone';

const Zones = () => {
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

    useEffect(() => { getManyZones() }, [])

    return (
        <div>
            <h2 className="sub_heading">Zone-wise Pincodes</h2>

            {
                zonelist?.map((item, index) => (
                    <SingleZone key={index} item={item} index={index} />
                ))
            }
        </div>
    )
}

export default Zones