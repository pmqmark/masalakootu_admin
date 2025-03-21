import "../../styles/tableSkeleton.css"

const TableSkeleton = ({ColumnCount}) => {
    return (
        <tbody className="w-full">
            {[...Array(3)].map((_, index) => (
                <tr key={index}>
                    {
                        [...Array(ColumnCount)].map((_, index) => (
                            <td key={index} className="loading ">
                                <div className="bar"></div>
                            </td>
                        ))
                    }

                </tr>
            ))}
        </tbody>
    );
};

export default TableSkeleton;
