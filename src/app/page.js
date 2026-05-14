import { getAllNews } from "@/utils/getAllNews";
import HomeClient from "./HomeClient";

export const metadata = {
  title: "The Brain | Intelligence Without Fear or Favour",
  description: "The Brain is your trusted source for accurate, fast and unbiased journalism. Stay updated with the latest in Technology, Sports, Culture, and Entertainment.",
};

export default async function HomePage() {
  const response = await getAllNews();
  const allNews = response.status ? response.data : [];
  const error = !response.status ? response.message : null;

  return <HomeClient allNews={allNews} error={error} />;
}
