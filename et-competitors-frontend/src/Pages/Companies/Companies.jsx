import React from "react";
import { Outlet, useOutlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getData } from "../../Services/AxiosAPIServices";
import { companiesUrl } from "../../Utils/utils";
import CompanyCard from "./Components/CompanyCard";
import Loading from "../../Components/Loading";
import toast from "react-hot-toast";
export default function Companies() {
  const isOutlet = useOutlet();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => await getData(companiesUrl + "/all"),
    select: (data) => data?.companies,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    //toast.error(error.message||"Error");
    return (
      <div className="h-screen bg-red-50/50 flex flex-col justify-center items-center">
        <div className="text-8xl">☹</div>
        <div className="text-8xl text-red-500 font-bold">Error</div>
        <div className="text-red-300 font-bold text-4xl">{error.message}</div>
      </div>
    );
  }

  return isLoading ? (
    <Loading />
  ) : isOutlet ? (
    <Outlet />
  ) : (
    <div className="h-full overflow-y-scroll p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 justify-items-center ">
        {data?.map((company) => (
          <CompanyCard company={company} key={company?.id} />
        ))}
      </div>
    </div>
  );
}
