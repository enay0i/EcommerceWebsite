import React from "react";

const TableComponent = ({ header, columns, data }) => {
  return (
    <div className="container mx-auto mt-2">
      {header && <h1>{header}</h1>}
      <table className="min-w-full bg-cyan border mx-2">
        <thead>
          <tr className="bg-white-200">
            {columns.map((col, index) => (
              <th
                key={index}
                className="py-2  border-b bg-gray-400  border-white-300" 
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-white-100">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="py-2 px-2 border-b border-white-300 items-end">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
