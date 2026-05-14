import { db } from "@/lib/firebase";

export const getSingleNews = async (id) => {
  const projectId = db.app.options.projectId;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/news/${id}`;

  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    
    if (!response.ok) {
      throw new Error(`Article not found or connection blocked.`);
    }

    const doc = await response.json();
    const fields = doc.fields;
    
    const formattedNews = {
      id,
      _id: id,
      title: fields.title?.stringValue || "Untitled",
      details: fields.details?.stringValue || "",
      image_url: fields.image_url?.stringValue || "",
      thumbnail_url: fields.thumbnail_url?.stringValue || "",
      category: fields.category?.stringValue || "General",
      total_view: fields.total_view?.integerValue ? parseInt(fields.total_view.integerValue) : 0,
      author: {
        name: fields.author?.mapValue?.fields?.name?.stringValue || "The Brain Reporter",
        published_date: fields.author?.mapValue?.fields?.published_date?.stringValue || new Date().toDateString(),
        img: fields.author?.mapValue?.fields?.img?.stringValue || ""
      }
    };

    return { status: true, message: "success", data: formattedNews };

  } catch (error) {
    // Fallback article for a polished feel
    const fallbackNews = {
      id: "fallback",
      _id: "fallback",
      title: "Platform Overview: Welcome to The Brain Intelligence",
      details: "You are seeing this article as part of our high-availability fallback system. This article provides a preview of the platform's layout and typography. Once your network connection to the primary database is restored, your real-time content will appear here automatically.",
      image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop",
      thumbnail_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop",
      category: "Platform",
      author: { name: "The Brain Editor", published_date: new Date().toDateString(), img: "" }
    };
    
    return { status: true, message: "fallback", data: fallbackNews };
  }
};
