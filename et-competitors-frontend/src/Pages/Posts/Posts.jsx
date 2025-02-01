import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useQueries, useQuery, useMutation } from "@tanstack/react-query";
import { getData, setData } from "../../Services/AxiosAPIServices";
import {
  companiesUrl,
  postUrl,
  socialMediaAccountsUrl,
  socialMediaAppsUrl,
  subTypesUrl,
  typesUrl,
} from "../../Utils/utils";
import toast from "react-hot-toast";

export default function Posts() {
  const [newPostData, setNewPostData] = useState({});

  function handelNewPost(data) {
    const dataMap = new Map(Object.entries(data));
    if (dataMap.get("coverImage") === "") {
      dataMap.delete("coverImage");
    }
    const finalData = Object.fromEntries(dataMap);
    finalData.publishDate = new Date(finalData.publishDate);
    const url = finalData.postUrl;
    finalData.postUrl = {
      postUrl: url,
      socialMediaAppId: data.socialMediaAppId,
    };
    setNewPostData(finalData);
    postMutation.mutate();
  }

  const newPostSchema = yup.object().shape({
    title: yup
      .string()
      .min(5, "يجب ان لا يقل عن 5 حروف")
      .required("مطلوب")
      .trim(),
    description: yup
      .string()
      .min(10, "يجب ان لا يقل عن 10 حروف")
      .max(1000, "يجب ان لا يزيد عن ألف حرف")
      .required("مطلوب")
      .trim(),
    coverImage: yup.string().url("يجب ان يحتوي على رابط").nullable(),
    postUrl: yup.string().url("يجب ان يحتوي على رابط").required("مطلوب"),
    publishDate: yup
      .date()
      .min(new Date(2000, 0, 1), "يجب ان لا يقل عن عام 2000")
      .max(new Date(), "يجب ان يسبق تاريخ اليوم")
      .required("مطلوب"),
    publisherId: yup.string().notOneOf([""]).required("مطلوب"),
    socialMediaAccountId: yup.string().notOneOf([""]).required("مطلوب"),
    socialMediaAppId: yup.string().notOneOf([""]).required("مطلوب"),
    typeId: yup.string().notOneOf([""]).required("مطلوب"),
    subTypeId: yup.string().notOneOf([""]).required("مطلوب"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      coverImage: "",
      postUrl: "",
      publishDate: "",
      publisherId: "",
      socialMediaAccountId: "",
      socialMediaAppId: "",
      typeId: "",
      subTypeId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    onSubmit: handelNewPost,
    validationSchema: newPostSchema,
  });
  /* Get Request */
  function getPostsCompanies() {
    return getData(companiesUrl + "/all");
  }

  function getSocialMediaAccounts(id) {
    return getData(socialMediaAccountsUrl + `/${id}`);
  }

  const { data: companiesList } = useQuery({
    queryKey: ["postCompanies"],
    queryFn: getPostsCompanies,
    select: (data) => data?.companies,
  });

  const { data: socialMediaAccounts } = useQuery({
    queryKey: ["scoialMediaAccounts", formik.values.publisherId],
    queryFn: () => getSocialMediaAccounts(formik.values.publisherId),
    select: (data) => data?.companySocialAccounts,
    enabled: !!formik.values.publisherId,
  });

  const [types, subTypes, socialMediaApps] = useQueries({
    queries: [
      {
        queryKey: ["types"],
        queryFn: () => getData(typesUrl + "/all"),
        select: (data) => data?.types,
      },
      {
        queryKey: ["subTypes"],
        queryFn: () => getData(subTypesUrl + "/all"),
        select: (data) => data?.subTypes,
      },
      {
        queryKey: ["socialMediaApps"],
        queryFn: () => getData(socialMediaAppsUrl + "/all"),
        select: (data) => data?.socialMediaApps,
      },
    ],
  });

  /* Post Request */
  function createNewPost(url, newPost) {
    return setData(url, newPost);
  }
  const postMutation = useMutation({
    mutationKey: ["newPost"],
    mutationFn: () => createNewPost(postUrl, newPostData),
    onError: (error) => {
      toast.error(`${error.message} يوجد خطأ ما:`);
      //console.log("error");
    },
    onSuccess: () => {
      //console.log("success");
      toast.success("تم الحفظ بنجاح");
      formik.resetForm();
      setNewPostData({});
    },
  });

  return (
    <div className="h-full w-full overflow-y-scroll ">
      <h1 className="text-4xl text-center text-gray-700 font-bold mb-5">
        منشور جديد
      </h1>
      <form
        onSubmit={formik.handleSubmit}
        className=" grid grid-cols-2  gap-x-2 px-3 py-2 "
      >
        {/* Title */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            العنوان
          </label>
          <input
            className={`shadow border ${
              formik.errors.title && formik.touched.title && "border-red-400"
            }  rounded w-full py-2 px-3 text-gray-700`}
            id="title"
            name="title"
            type="text"
            placeholder="العنوان"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.errors.title && formik.touched.title && (
            <p className="text-red-500 text-xs italic">{formik.errors.title}</p>
          )}
        </div>
        {/* Description */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            الوصف
          </label>
          <textarea
            className={`shadow border ${
              formik.errors.description &&
              formik.touched.description &&
              "border-red-400"
            }  rounded w-full py-2 px-3 text-gray-700`}
            placeholder="الوصف"
            rows="1"
            id="description"
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          ></textarea>
          {formik.errors.description && formik.touched.description && (
            <p className="text-red-500 text-xs italic">
              {formik.errors.description}
            </p>
          )}
        </div>
        {/* Cover Image */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="coverImage"
          >
            رابط الغلاف
          </label>
          <input
            className={`shadow border ${
              formik.errors.coverImage &&
              formik.touched.coverImage &&
              "border-red-400"
            }  rounded w-full py-2 px-3 text-gray-700`}
            id="coverImage"
            type="url"
            placeholder="رابط الغلاف"
            name="coverImage"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.coverImage}
          />
          {formik.errors.coverImage && formik.touched.coverImage && (
            <p className="text-red-500 text-xs italic">
              {formik.errors.coverImage}
            </p>
          )}
        </div>
        {/* Post Url */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="postUrl"
          >
            روابط المنشور
          </label>
          <div className=" flex items-center w-full gap-x-1">
            <div className="w-full">
              <input
                className={`shadow border ${
                  formik.errors.postUrl &&
                  formik.touched.postUrl &&
                  "border-red-400"
                }  rounded w-full py-2 px-3 text-gray-700`}
                id="postUrl"
                type="url"
                placeholder="رابط المنشور"
                name="postUrl"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.postUrl}
              />
              {formik.errors.postUrl && formik.touched.postUrl && (
                <p className="text-red-500 text-xs italic">
                  {formik.errors.postUrl}
                </p>
              )}
            </div>
            {/* <div className="w-1/2">
              
              <div className="mb-4">
                <select
                  id="socialMediaAppId"
                  name="socialMediaAppId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.socialMediaAppId}
                  className={`shadow border ${
                    formik.errors.socialMediaAppId &&
                    formik.touched.socialMediaAppId &&
                    "border-red-400"
                  }  rounded w-full py-2 px-3 text-gray-700`}
                >
                  <option disabled value={""}>
                    أختر منصة تواصل اجتماعي
                  </option>
                  {socialMediaApps.data?.map((item, index) => (
                    <option value={item.id} key={index}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {formik.errors.socialMediaAppId &&
                  formik.touched.socialMediaAppId && (
                    <p className="text-red-500 text-xs italic">
                      {formik.errors.socialMediaAppId}
                    </p>
                  )}
              </div>
            </div> */}
          </div>
        </div>
        {/* publish date */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="publishDate"
          >
            تاريخ النشر
          </label>
          <input
            className={`shadow border ${
              formik.errors.publishDate &&
              formik.touched.publishDate &&
              "border-red-400"
            }  rounded w-full py-2 px-3 text-gray-700`}
            id="publishDate"
            type="date"
            placeholder="تاريخ النشر"
            name="publishDate"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.publishDate}
          />
          {formik.errors.publishDate && formik.touched.publishDate && (
            <p className="text-red-500 text-xs italic">
              {formik.errors.publishDate}
            </p>
          )}
        </div>
        {/* Company id */}
        <div className="mb-4">
          <label
            htmlFor="publisherId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            الشركة
          </label>
          <select
            id="publisherId"
            name="publisherId"
            onChange={formik.handleChange}
            value={formik.values.publisherId}
            className={`shadow border ${
              formik.errors.publisherId &&
              formik.touched.publisherId &&
              "border-red-400"
            }  rounded w-full py-2 px-3 text-gray-700`}
          >
            <option value={""} disabled>
              أختر شركة
            </option>
            {companiesList?.map((item, index) => (
              <option value={item.id} key={index}>
                {item.name}
              </option>
            ))}
          </select>
          {formik.errors.publisherId && formik.touched.publisherId && (
            <p className="text-red-500 text-xs italic">
              {formik.errors.publisherId}
            </p>
          )}
        </div>
        {/* Company Account Id */}
        <div className="mb-4">
          <label
            htmlFor="socialMediaAccountId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            حساب التواصل الاجتماعي للشركة
          </label>
          <select
            disabled={!formik.values.publisherId ? true : false}
            id="socialMediaAccountId"
            name="socialMediaAccountId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.socialMediaAccountId}
            className={`shadow border ${
              formik.errors.socialMediaAccountId &&
              formik.touched.socialMediaAccountId &&
              "border-red-400"
            }  rounded w-full py-2 px-3 text-gray-700`}
          >
            <option disabled value={""}>
              أختر حساب تواصل للشركة
            </option>
            {socialMediaAccounts?.map((item, index) => (
              <option className="truncate" value={item.id} key={index}>
                {item.profileUrl.split("/").slice(1, 3)}
              </option>
            ))}
          </select>
          {formik.errors.socialMediaAccountId &&
            formik.touched.socialMediaAccountId && (
              <p className="text-red-500 text-xs italic">
                {formik.errors.socialMediaAccountId}
              </p>
            )}
        </div>
        {/* Social Media app Id */}
        <div className="mb-4">
          <label
            htmlFor="socialMediaAppId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            منصة التواصل الأجتماعي
          </label>
          <select
            id="socialMediaAppId"
            name="socialMediaAppId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.socialMediaAppId}
            className={`shadow border ${
              formik.errors.socialMediaAppId &&
              formik.touched.socialMediaAppId &&
              "border-red-400"
            }  rounded w-full py-2 px-3 text-gray-700`}
          >
            <option disabled value={""}>
              أختر منصة تواصل اجتماعي
            </option>
            {socialMediaApps.data?.map((item, index) => (
              <option value={item.id} key={index}>
                {item.name}
              </option>
            ))}
          </select>
          {formik.errors.socialMediaAppId &&
            formik.touched.socialMediaAppId && (
              <p className="text-red-500 text-xs italic">
                {formik.errors.socialMediaAppId}
              </p>
            )}
        </div>
        {/* Type Id */}
        <div className="mb-4">
          <label
            htmlFor="typeId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            فئة المنشور
          </label>
          <select
            id="typeId"
            name="typeId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.typeId}
            className={`shadow border ${
              formik.errors.typeId && formik.touched.typeId && "border-red-400"
            }  rounded w-full py-2 px-3 text-gray-700`}
          >
            <option disabled value={""}>
              أختر فئة المنشور
            </option>
            {types.data?.map((item, index) => (
              <option value={item.id} key={index}>
                {item.name}
              </option>
            ))}
          </select>
          {formik.errors.typeId && formik.touched.typeId && (
            <p className="text-red-500 text-xs italic">
              {formik.errors.typeId}
            </p>
          )}
        </div>
        {/* Sub Type Id */}
        <div className="mb-6">
          <label
            htmlFor="subTypeId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            نوع المنشور
          </label>
          <select
            id="subTypeId"
            name="subTypeId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.subTypeId}
            className={`shadow border ${
              formik.errors.subTypeId &&
              formik.touched.subTypeId &&
              "border-red-400"
            }  rounded w-full py-2 px-3 text-gray-700`}
          >
            <option disabled value={""}>
              أختر نوع المنشور
            </option>
            {subTypes.data?.map((item, index) => (
              <option value={item.id} key={index}>
                {item.name}
              </option>
            ))}
          </select>
          {formik.errors.subTypeId && formik.touched.subTypeId && (
            <p className="text-red-500 text-xs italic">
              {formik.errors.subTypeId}
            </p>
          )}
        </div>
        {/* Button Submit */}
        <button
          disabled={postMutation.isPending}
          className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {postMutation.isPending ? "يتم الحفظ..." : "حفظ"}
        </button>
      </form>
    </div>
  );
}
