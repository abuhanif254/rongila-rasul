import { getAllNews as fetchAllNews } from "@/lib/firestore";

export const getAllNews = async () => {
  try {
    const newsData = await fetchAllNews();
    return {
      status: true,
      message: "success",
      data: newsData,
    };
  } catch (error) {
    console.error("Error in getAllNews utility:", error);
    return {
      status: false,
      message: error.message,
      data: [],
    };
  }
};
