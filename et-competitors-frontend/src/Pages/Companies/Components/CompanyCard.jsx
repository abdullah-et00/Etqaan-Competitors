import { Link } from "react-router-dom";
export default function CompanyCard({ company }) {
  return (
    <Link
      className="w-full h-auto flex flex-col group bg-white border shadow-sm rounded-xl overflow-hidden hover:shadow-lg focus:outline-none focus:shadow-lg transition"
      to={`company-details/${company.id}`}
    >
      <div className="relative pt-[30%] sm:pt-[50%] lg:pt-[70%] rounded-t-xl overflow-hidden">
        <img
          className="size-full absolute top-0 start-0 object-cover group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out rounded-t-xl"
          src={company?.logo}
          alt="Card Image"
        />
      </div>
      <div className="p-2">
        <h3 className="my-1 text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-blue-800">
          {company?.name}
        </h3>
        <p className="my-2 text-base md:text-lg lg:text-xl line-clamp-1 text-gray-500 ">
          {company?.description}
        </p>
      </div>
    </Link>
  );
}
