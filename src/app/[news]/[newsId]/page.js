"use client";
import { useState, useEffect } from "react";
import { getSingleNews } from "@/utils/getSingleNews";
import { getAllNews } from "@/utils/getAllNews";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReadingProgressBar from "@/components/ui/ReadingProgressBar/ReadingProgressBar";
import ShareButtons from "@/components/ui/ShareButtons/ShareButtons";
import { useParams } from "next/navigation";

const readingTime = (text = "") =>
  Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));

const NewsDetailPage = () => {
  const params = useParams();
  const newsId = params?.newsId;
  
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!newsId) return;
      
      try {
        setLoading(true);
        // Fetch single news
        const newsResponse = await getSingleNews(newsId);
        if (newsResponse.status) {
          setNews(newsResponse.data);
          
          // Fetch related news (same category)
          const allResponse = await getAllNews();
          if (allResponse.status) {
            const filtered = allResponse.data
              .filter((n) => n.category === newsResponse.data.category && (n.id || n._id) !== newsId)
              .slice(0, 3);
            setRelated(filtered);
          }
        }
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [newsId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress color="error" />
      </Box>
    );
  }

  if (!news) {
    return (
      <Box className="my-10 text-center">
        <Typography variant="h5" color="error">
          News article not found.
        </Typography>
        <Link href="/">
          <Typography className="mt-4 underline" sx={{ cursor: 'pointer' }}>← Back to Home</Typography>
        </Link>
      </Box>
    );
  }

  return (
    <Box className="fade-in-up" sx={{ my: 4 }}>
      <ReadingProgressBar />

      {/* ── Back link ── */}
      <Link href="/">
        <Stack
          direction="row"
          alignItems="center"
          gap={0.6}
          sx={{
            mb: 3,
            display: "inline-flex",
            color: "text.secondary",
            transition: "color 0.2s",
            "&:hover": { color: "#c0392b" },
          }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography variant="body2" fontWeight={600}>Back to Home</Typography>
        </Stack>
      </Link>

      {/* ── Hero ── */}
      <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
        <Box sx={{ position: "relative", width: "100%", height: { xs: 240, sm: 360, md: 480 } }}>
          <Image
            src={news.thumbnail_url || news.image_url || "https://picsum.photos/1200/800"}
            fill
            alt={news.title}
            style={{ objectFit: "cover" }}
            priority
            sizes="(max-width:768px) 100vw, 80vw"
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
            }}
          />
          <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: { xs: 2.5, md: 4 } }}>
            <Chip
              label={news.category}
              size="small"
              sx={{
                mb: 1.5,
                backgroundColor: "#c0392b",
                color: "white",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
                borderRadius: 1,
              }}
            />
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                color: "white",
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1.25,
                textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              {news.title}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ px: { xs: 2.5, md: 5 }, py: 3.5 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
            sx={{ mb: 2.5 }}
          >
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Avatar
                src={news.author?.img}
                alt={news.author?.name}
                sx={{ width: 44, height: 44, border: "2px solid", borderColor: "divider" }}
              />
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  {news.author?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {news.author?.published_date}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" gap={2.5} flexWrap="wrap">
              <Stack direction="row" alignItems="center" gap={0.5}>
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {readingTime(news.details || "")} min read
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <VisibilityIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {(news.total_view || 0).toLocaleString()} views
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <StarIcon fontSize="small" sx={{ color: "#f5a623" }} />
                <Typography variant="body2">
                  {news.rating?.number || 5.0} — {news.rating?.badge || "Excellent"}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 3.5 }} />

          <Box sx={{ maxWidth: 780 }}>
            {(news.details || "").split("\n\n").map((paragraph, i) => (
              <Typography
                key={i}
                variant="body1"
                sx={{
                  mb: 2.5,
                  lineHeight: 1.9,
                  color: "text.primary",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.05rem",
                }}
              >
                {paragraph.trim()}
              </Typography>
            ))}
          </Box>

          <Divider sx={{ my: 3.5 }} />

          <Box sx={{ mb: 1 }}>
            <ShareButtons title={news.title} />
          </Box>
        </CardContent>
      </Card>

      {related.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <div className="section-header">Related Articles</div>
            <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #c0392b20, transparent)" }} />
          </Box>
          <Grid container spacing={2.5}>
            {related.map((rel) => (
              <Grid key={rel.id || rel._id} item xs={12} sm={4}>
                <Link href={`/news/${rel.id || rel._id}`}>
                  <Card
                    className="news-card"
                    sx={{
                      borderRadius: 2.5,
                      overflow: "hidden",
                      cursor: "pointer",
                      "&:hover .rel-img": { transform: "scale(1.05)" },
                    }}
                  >
                    <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
                      <Image
                        className="rel-img"
                        src={rel.thumbnail_url}
                        fill
                        alt={rel.title}
                        sizes="30vw"
                        style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                      />
                      <Chip
                        label={rel.category}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          backgroundColor: "#c0392b",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          borderRadius: 1,
                          height: 22,
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          fontFamily: "'Playfair Display', serif",
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {rel.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                        {rel.author?.published_date}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default NewsDetailPage;
