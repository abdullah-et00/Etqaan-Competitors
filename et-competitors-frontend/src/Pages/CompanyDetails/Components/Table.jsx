import Pagination from "@/components/Pagination";
import { noImage } from "@/Constants/Constants";
import { useState, useEffect } from "react";

export default function Table({ header, tableColumnsNames, tableRows }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setBlogsPerPage] = useState(15);
  // Pagination Calculation:
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableRows?.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [tableRows]);

  return (
    <>
      <div className=" bg-white block sm:flex items-center justify-between border-b border-gray-200 ">
        <div className="mb-1 w-full">
          {/* Section 1 */}
          <div className="mb-4">
            {/* Header */}
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {header}
            </h1>
          </div>
        </div>
      </div>
      {/* Table Data */}
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden">
              <table className="table-fixed min-w-full divide-y divide-gray-200">
                {/* Header */}
                <thead className="bg-gray-100">
                  {/* Columns */}
                  <tr>
                    {tableColumnsNames.map((column, index) =>
                      index == 0 ? (
                        <th
                          key={index}
                          scope="col"
                          className="p-4 whitespace-nowrap text-center text-lg text-gray-500"
                        >
                          {column}
                        </th>
                      ) : (
                        <th
                          key={index}
                          scope="col"
                          className="p-4 whitespace-nowrap text-right text-lg text-gray-500"
                        >
                          {column}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                {/* Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Rows */}
                  {currentItems?.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {/* Index */}
                      <td className="p-4 text-center text-lg font-bold text-gray-900 ">
                        {index + 1}
                      </td>

                      {/* Cover Image */}
                      <td className="p-4 flex items-center whitespace-nowrap space-x-6 mr-12 lg:mr-0">
                        <a href={row?.coverImage} target="_blank">
                          <img
                            className="w-24 h-24 object-cover rounded-lg shadow"
                            src={row?.coverImage || noImage}
                            alt={`Course Image ${index}`}
                          />
                        </a>
                      </td>

                      {/* Social Media Icon ${row?.postsUrls?.length===1?"justify-center":"justify-start"} */}
                      <td className="p-4 text-center">
                        <div className={`flex  items-center gap-x-1`}>
                          {row?.postsUrls?.map((item, index) => (
                            <a key={index} href={item?.postUrl} target="_blank">
                              <img
                                className="w-10 h-10 object-cover rounded-full shadow"
                                src={item?.socialMediaApp?.logo || noImage}
                                alt={`Social App Image ${index}`}
                              />
                            </a>
                          ))}
                        </div>
                      </td>

                      {/* Title */}
                      <td className="p-2 text-xl font-bold text-gray-900 ">
                        <p className="truncate  w-56">{row?.title}</p>
                      </td>
                      {/* posts count 
                      <td className="p-4 text-xl font-bold text-gray-900 text-center">
                        <p className="truncate">{row?.postCounts}</p>
                      </td>*/}

                      {/* Description */}
                      <td className="p-4 text-gray-500 w-[35%]">
                        <p className="text-base  font-semibold line-clamp-1">
                          {row?.description}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="bg-gray-100 sticky sm:flex items-center w-full sm:justify-between bottom-0 right-0 border-t border-gray-200">
        <div className="flex gap-x-2 items-center mb-2 sm:mb-0">
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            paginate={(newPage) => setCurrentPage(newPage)}
            totalItems={tableRows?.length}
          />
        </div>
      </div>
    </>
  );
}
