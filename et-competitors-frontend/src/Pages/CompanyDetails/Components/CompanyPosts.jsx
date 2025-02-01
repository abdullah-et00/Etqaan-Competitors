import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Table from "./Table";
import { companyPostsColumns } from "@/Constants/Constants";
import Loading from "@/Components/Loading";
import { useQueries } from "@tanstack/react-query";
import { getData } from "@/Services/AxiosAPIServices";
import { companiesUrl } from "@/Utils/utils";
import BreadCrumb from "@/Components/BreadCrumb";

export default function CompanyPosts() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const crumbs = location.pathname.split("/");
  const [currentType, setCurrentType] = useState(0);
  const [typeId, setTypeId] = useState();
  const [report, companyPosts] = useQueries({
    queries: [
      {
        queryKey: ["report"],
        queryFn: async () => await getData(companiesUrl + `/report/${id}`),
        //refetchOnWindowFocus: false,
      },
      {
        queryKey: ["companyPosts"],
        queryFn: async () =>
          await getData(companiesUrl + `/c-posts/${id}/${typeId}`),
        enabled: !!typeId,
        //refetchOnWindowFocus: false,
      },
    ],
  });
  useEffect(() => {
    if (report.data?.report?.postsRepo?.[currentType]?.id) {
      setTypeId(report.data.report.postsRepo[currentType].id);
    }
  }, [report.data, currentType]);

  /* useEffect(() => {
    if (report?.data && typeId === null) {
      setTypeId(report?.data?.report?.postsRepo[0]?.id);
      setCurrentType(0);
    }
  }, [report?.data]); */

  useEffect(() => {
    companyPosts.refetch();
  }, [typeId, currentType]);

  if (report.isError) {
    return (
      <div className="h-screen bg-red-50/50 flex flex-col justify-center items-center">
        <div className="text-8xl">☹</div>
        <div className="text-8xl text-red-500 font-bold">Error</div>
        <div className="text-red-300 font-bold text-4xl">{report.error.message}</div>
      </div>
    );
  }

  if (companyPosts.isError) {
    return (
      <div className="h-screen bg-red-50/50 flex flex-col justify-center items-center">
        <div className="text-8xl">☹</div>
        <div className="text-8xl text-red-500 font-bold">Error</div>
        <div className="text-red-300 font-bold text-4xl">{companyPosts.error.message}</div>
      </div>
    );
  }

  return (report?.isLoading || companyPosts?.isLoading) ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-4">
      <BreadCrumb
        crumbs={[
          { name: "/", link: crumbs[0] },
          { name: "تفاصيل الشركة", link: crumbs[1] + "/" + crumbs[2] },
          { name: "المنشورات", link: crumbs[3] },
        ]}
      />
      <div className="flex flex-col ">
        <h1 className="mt-2 mb-4 text-xl sm:text-2xl font-semibold text-gray-900">
          فئات المنشورات:
        </h1>
        <div className="flex gap-4">
          {report?.data?.report?.postsRepo?.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setTypeId(item.id);
                setCurrentType(index);
              }}
              className={`${
                currentType === index && "bg-gray-100"
              } cursor-pointer w-fit h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex flex-col justify-center items-center gap-2.5`}
            >
              <h4 className="text-indigo-800 text-6xl font-extrabold">
                {item?.count}
              </h4>
              <p className="text-gray-500 font-medium">{item?.type}</p>
            </div>
          ))}
        </div>
      </div>
      <Table
        header={"المنشورات"}
        tableColumnsNames={companyPostsColumns}
        tableRows={companyPosts?.data?.companyPosts}
      />
    </div>
  );
}


/* import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Table from "./Table";
import { companyPostsColumns } from "@/Constants/Constants";
import Loading from "@/Components/Loading";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/Services/AxiosAPIServices";
import { companiesUrl } from "@/Utils/utils";
import toast from "react-hot-toast";
import BreadCrumb from "@/Components/BreadCrumb";

export default function CompanyPosts() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const crumbs = location.pathname.split("/");

  const {
    data: report,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["c-report"],
    queryFn: async () => await getData(companiesUrl + `/report/${id}`),
    select: (data) => data.report,
  });

  

  if (isError) {
    //toast.error(error?.message);
    return (
      <div className="h-screen bg-red-50/50 flex justify-center items-center sm:text-2xl lg:text-3xl text-red-500 font-bold">
        Error: {error?.message}
      </div>
    );
  }

  const [typeId, setTypeId] = useState();
  const [currentType, setCurrentType] = useState(0);

  useEffect(() => {
    if (report) {
      setTypeId(report.postsRepo[0].id);
      setCurrentType(0);
    }
  }, [report]);

  const companyPosts = useQuery({
    queryKey: ["c-posts"],
    queryFn: async () =>
      await getData(companiesUrl + `/c-posts/${id}/${typeId}`),
    enabled:!! typeId
  });

  if (companyPosts?.isError) {
    //toast.error(companyPosts?.error?.message);
    return (
      <div className="h-screen bg-red-50/50 flex justify-center items-center sm:text-2xl lg:text-3xl text-red-500 font-bold">
        Error: {companyPosts?.error?.message}
      </div>
    );
  }

  useEffect(() => {
    companyPosts.refetch();
  }, [typeId, currentType]);

  return companyPosts?.isLoading || isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-4">
      <BreadCrumb
        crumbs={[
          { name: "/", link: crumbs[0] },
          { name: "تفاصيل الشركة", link: crumbs[1] + "/" + crumbs[2] },
          { name: "المنشورات", link: crumbs[3] },
        ]}
      />
      <div className="flex flex-col ">
        <h1 className="mt-2 mb-4 text-xl sm:text-2xl font-semibold text-gray-900">
          فئات المنشورات:
        </h1>
        <div className="flex gap-4">
          {report?.postsRepo?.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setTypeId(item?.id);
                setCurrentType(index);
              }}
              className={`${
                currentType === index && "bg-gray-100"
              } cursor-pointer w-fit h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex flex-col justify-center items-center gap-2.5`}
            >
              <h4 className="text-indigo-800 text-6xl font-extrabold">
                {item?.count}
              </h4>
              <p className="text-gray-500 font-medium">{item?.type}</p>
            </div>
          ))}
        </div>
      </div>
      <Table
        header={"المنشورات"}
        tableColumnsNames={companyPostsColumns}
        tableRows={companyPosts?.data?.companyPosts}
      />
    </div>
  );
} */
