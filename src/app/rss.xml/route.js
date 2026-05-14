import { NextResponse } from "next/server";
import { getAllNews } from "@/utils/getAllNews";

export async function GET() {
  try {
    const newsData = await getAllNews();
    
    // Sort news by date (newest first)
    const sortedNews = newsData.sort((a, b) => {
      const dateA = new Date(a.author?.published_date || 0);
      const dateB = new Date(b.author?.published_date || 0);
      return dateB - dateA;
    });

    const baseUrl = "https://the-brain-news.vercel.app"; // Update this with your actual live URL

    const rssItemsXml = sortedNews
      .map((news) => {
        const url = `${baseUrl}/news/${news.id || news._id}`;
        return `
        <item>
          <title><![CDATA[${news.title}]]></title>
          <link>${url}</link>
          <guid isPermaLink="false">${news.id || news._id}</guid>
          <pubDate>${new Date(news.author?.published_date).toUTCString()}</pubDate>
          <category><![CDATA[${news.category}]]></category>
          <description><![CDATA[${news.details?.slice(0, 160)}...]]></description>
          <content:encoded><![CDATA[${news.details}]]></content:encoded>
          <author><![CDATA[${news.author?.name || "The Brain Team"}]]></author>
          <media:content url="${news.thumbnail_url}" medium="image" />
        </item>`;
      })
      .join("");

    const rssFeedXml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" 
      xmlns:content="http://purl.org/rss/1.0/modules/content/"
      xmlns:wfw="http://wellformedweb.org/CommentAPI/"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:atom="http://www.w3.org/2005/Atom"
      xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
      xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
      xmlns:media="http://search.yahoo.com/mrss/"
    >
      <channel>
        <title>The Brain | Intelligence Without Fear or Favour</title>
        <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
        <link>${baseUrl}</link>
        <description>The latest breaking news, technology, sports, and culture from The Brain.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${rssItemsXml}
      </channel>
    </rss>`;

    return new NextResponse(rssFeedXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("RSS Feed Error:", error);
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}
