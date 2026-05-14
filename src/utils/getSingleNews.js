import { getNewsById } from "@/lib/firestore";

export const getSingleNews = async (id) => {
  try {
    const news = await getNewsById(id);
    return {
      status: true,
      message: news ? "success" : "not found",
      data: news || null,
    };
  } catch (error) {
    console.error("Error in getSingleNews utility:", error);
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }
};
