import { getAllNews } from "@/utils/getAllNews";

export default async function sitemap() {
  const baseUrl = "https://the-brain-news.vercel.app";

  // Fetch all news for dynamic pages
  const newsData = await getAllNews();
  const newsEntries = newsData.map((news) => ({
    url: `${baseUrl}/news/${news.id || news._id}`,
    lastModified: new Date(news.author?.published_date || new Date()),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const staticEntries = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/categories/news?category=all-news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [...staticEntries, ...newsEntries];
}
