import Input from "../../components/common/Input.jsx";
import React from 'react'

const BatchRow = ({ batch, index, removeBatchRow, setProduct }) => {

    const inputChangeHandler = (name, value) => {
        setProduct((prev) => (
            {
                ...prev,
                batches: prev?.batches?.map((item, idx) => idx === index ? { ...item, [name]: value } : item)
            }
        )
        )
    }


    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-4">
                <h5>Batch {index + 1} :</h5>

                {
                    index > 0
                    &&
                    <button
                        onClick={() => removeBatchRow(index)}
                        className="bg-red-500 text-white text-sm px-2 rounded-md" >Remove</button>
                }
            </div>
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Enter the Batch Number"
                    label="Batch Number"
                    name="batchNumber"
                    value={batch?.batchNumber}
                    onChange={(value) => inputChangeHandler("batchNumber", value)}
                />

                <Input
                    type="text"
                    placeholder="Enter the Quantity"
                    label="Quantity"
                    name="quantity"
                    value={batch?.quantity}
                    onChange={(value) => inputChangeHandler("quantity", value)}
                />

                <Input
                    type="date"
                    placeholder="Enter Manufacturing Date"
                    label="Manufacturing Date"
                    name="mfgDate"
                    value={batch?.mfgDate ? new Date(batch?.mfgDate).toISOString().split("T")[0] : ""}
                    onChange={(value) => inputChangeHandler("mfgDate", value)}
                />

                <Input
                    type="date"
                    placeholder="Enter Expiry Date"
                    label="Expiry Date"
                    name="expDate"
                    value={batch?.expDate ? new Date(batch?.expDate).toISOString().split("T")[0] : ""}
                    onChange={(value) => inputChangeHandler("expDate", value)}
                />

            </div>
        </div>

    )
}

export default BatchRow