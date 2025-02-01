import React from "react";
import { Link } from "react-router-dom";

export default function BreadCrumb({ crumbs }) {
  //crumbs=crumbs.slice(0,2)
  return (
    <nav
      className="my-4 p-4 text-sm sm:text-lg lg:text-xl"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-1  text-gray-600">
        {crumbs.map((item, index) =>
          index === 0 ? (
            <li key={index}>
              <Link to={"/"} className="block transition hover:text-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </Link>
            </li>
          ) : (
            <div className="flex items-center" key={index}>
              <li className="rtl:rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 20.247 6-16.5"
                  />
                </svg>
              </li>

              <li>
                {index === crumbs.length - 1 ? (
                  <div className="block transition text-gray-400">{item.name}</div>
                ) : (
                  <Link
                    to={`/${item.link}`}
                    className="block transition hover:text-blue-700"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            </div>
          )
        )}
      </ol>
    </nav>
  );
}
