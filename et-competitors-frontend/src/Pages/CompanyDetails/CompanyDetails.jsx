import React from "react";
import {
  useParams,
  Link,
  useOutlet,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/Services/AxiosAPIServices";
import { companiesUrl } from "@/Utils/utils";
import toast from "react-hot-toast";
import Loading from "@/Components/Loading";
import BreadCrumb from "@/Components/BreadCrumb";

export default function CompanyDetails() {
  const { id } = useParams();
  const isOutlet = useOutlet();
  const location = useLocation().pathname.split("/");

  const company = useQuery({
    queryKey: ["company", id],
    queryFn: async () => await getData(companiesUrl + `/report/${id}`),
    refetchOnWindowFocus: false,
  });


  if (company.isError) {
    //toast.error(company.error.message);
    return (
      <div className="h-screen bg-red-50/50 flex flex-col justify-center items-center">
        <div className="text-8xl">☹</div>
        <div className="text-8xl text-red-500 font-bold">Error</div>
        <div className="text-red-300 font-bold text-4xl">{company.error.message}</div>
      </div>
    );
  }
  
  let count = 0;
  if (company.isSuccess) {
    for (let i = 0; i < company?.data?.report?.postsRepo?.length; i++) {
      count += parseInt(company?.data?.report?.postsRepo[i].count);
    }
  }

  return company.isLoading ? (
    <Loading />
  ) : isOutlet ? (
    <Outlet />
  ) : (
    <section className="bg-gray-50/30 py-24 relative xl:mr-0 lg:mr-5 mr-0">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <BreadCrumb crumbs={[{name:"/" ,link:location[0]},  { name:"تفاصيل الشركة","link":location[1] + "/" + location[2]}]} />
        <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
          <div className="w-full lg:justify-start justify-center items-start flex">
            <div className="sm:w-[564px] w-full sm:h-[646px] h-full rounded-3xl sm:border relative shadow-xl">
              <img
                className="w-full h-full rounded-3xl object-cover"
                src={company?.data?.company?.logo}
                alt="company image"
              />
            </div>
          </div>
          <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
            <div className="w-full flex-col justify-center items-start gap-8 flex">
              <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                <h6 className="text-gray-400 text-lg font-normal leading-relaxed">
                  عن الشركة
                </h6>
                <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                  <h2 className="text-indigo-700 text-2xl sm:text-3xl lg:text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                    {company?.data?.company?.name}
                  </h2>
                  <p className="text-gray-500 text-base md:text-lg lg:text-xl font-normal leading-relaxed lg:text-start text-center">
                    {company?.data?.company?.description}
                  </p>
                </div>
                <div className="flex flex-col gap-y-3">
                  <h6 className="text-2xl font-bold">
                    حسابات التواصل الأجتماعي:
                  </h6>
                  <div className="flex items-center gap-x-4">
                    {company?.data?.company?.socialMediaAccounts?.map(
                      (item, index) => (
                        <Link to={item?.profileUrl} key={index} target="_blank">
                          <img
                            key={index}
                            src={item?.socialMediaApps?.logo}
                            alt="company logo"
                            className="rounded-2xl object-cover size-12 border border-gray-100"
                          />
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full flex-col justify-center items-start gap-6 flex">
                <div className="flex flex-col gap-2">
                  <h6 className="text-2xl font-bold ">
                    إحصائيات المنشورات خلال
                    <span className="text-indigo-700 font-extrabold">
                      {" "}
                      {company?.data?.report?.quarter}
                    </span>
                  </h6>
                  <h6 className="text-gray-500 text-lg font-medium">بإجمالي</h6>
                </div>
                <div className="w-full justify-start items-center gap-2 grid md:grid-cols-2 grid-cols-1">
                  {count != 0 ? (
                    <Link
                      to={"posts"}
                      className="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:bg-indigo-50 hover:border-gray-400 transition-all duration-700 ease-in-out flex flex-col justify-center items-center gap-2.5"
                    >
                      <h4 className="text-indigo-800 text-6xl font-extrabold">
                        {count}
                      </h4>
                      <p className="text-gray-500 font-medium">منشور</p>
                    </Link>
                  ) : (
                    <div className="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex flex-col justify-center items-center gap-2.5">
                      <h4 className="text-indigo-800 text-6xl font-extrabold">
                        {count}
                      </h4>
                      <p className="text-gray-500 font-medium">منشور</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
