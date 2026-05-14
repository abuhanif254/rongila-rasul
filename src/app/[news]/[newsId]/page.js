import { getSingleNews } from "@/utils/getSingleNews";
import { getAllNews } from "@/utils/getAllNews";
import NewsDetailClient from "./NewsDetailClient";
import Link from "next/link";
import Script from "next/script";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { newsId } = resolvedParams;
  const newsResponse = await getSingleNews(newsId);
  
  if (!newsResponse.status || !newsResponse.data) {
    return {
      title: "Article Not Found | The Brain",
    };
  }

  const news = newsResponse.data;
  return {
    title: `${news.title} | The Brain`,
    description: news.details?.slice(0, 160),
    openGraph: {
      title: news.title,
      description: news.details?.slice(0, 160),
      images: [news.image_url || news.thumbnail_url],
      type: "article",
      publishedTime: news.author?.published_date,
      authors: [news.author?.name],
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description: news.details?.slice(0, 160),
      images: [news.image_url || news.thumbnail_url],
    },
  };
}

export default async function NewsDetailPage({ params }) {
  const resolvedParams = await params;
  const { newsId } = resolvedParams;
  
  const newsResponse = await getSingleNews(newsId);
  
  if (!newsResponse.status) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: "#c0392b", fontWeight: 800 }}>Database Connection Error</h2>
        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '24px' }}>
          The Brain was unable to retrieve this article from the database. This is usually caused by a network block or firewall on your local machine.
        </p>
        <code style={{ display: 'block', padding: '12px', background: '#f5f5f5', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '24px' }}>
          Error: {newsResponse.message}
        </code>
        <Link href="/" style={{ textDecoration: "none", background: '#c0392b', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 700 }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (!newsResponse.data) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2 style={{ color: "#c0392b" }}>News article not found.</h2>
        <Link href="/" style={{ marginTop: "20px", display: "inline-block", textDecoration: "underline" }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  const news = newsResponse.data;

  // Fetch related news (same category)
  const allResponse = await getAllNews();
  let related = [];
  if (allResponse.status) {
    related = allResponse.data
      .filter((n) => n.category === news.category && (n.id || n._id) !== newsId)
      .slice(0, 3);
  }

  // JSON-LD Structured Data for NewsArticle
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "image": [news.image_url || news.thumbnail_url],
    "datePublished": news.author?.published_date,
    "dateModified": news.author?.published_date,
    "author": [{
      "@type": "Person",
      "name": news.author?.name,
      "url": "https://the-brain-news.vercel.app" 
    }],
    "publisher": {
      "@type": "Organization",
      "name": "The Brain",
      "logo": {
        "@type": "ImageObject",
        "url": "https://the-brain-news.vercel.app/the-brain-logo.png"
      }
    },
    "description": news.details?.slice(0, 160)
  };

  return (
    <>
      <Script
        id="news-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsDetailClient news={news} related={related} />
    </>
  );
}
