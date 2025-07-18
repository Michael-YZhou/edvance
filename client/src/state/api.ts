import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";

/*
 * This is a custom base query that is used to handle the error and success messages
 * Instead of fetchBaseQuery, this API slice uses this custom handler,
 * so every endpoint automatically benefits from the standardized response and error logic.
 */
const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  });

  try {
    // this is the default base query, can be replaced with fetchBaseQuery or custom Axios query function if needed
    const result: any = await baseQuery(args, api, extraOptions);

    // if success, unwraps the data from the result
    if (result.data) {
      result.data = result.data.data;
    }
    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    // if error, return the custom error message
    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};

export const api = createApi({
  // baseQuery: fetchBaseQuery({
  //   baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  // }), // if you want to use the default base query
  baseQuery: customBaseQuery, // this is the custom base query used across all endpoints
  reducerPath: "api",
  tagTypes: ["Courses"],
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "courses",
        params: { category },
      }),
      providesTags: ["Courses"],
    }),
    getCourse: builder.query<Course, string>({
      query: (id) => ({
        url: `courses/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseQuery } = api;
