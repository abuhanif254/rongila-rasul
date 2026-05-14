"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { getAllNews } from "@/utils/getAllNews";
import CategoryBadge from "@/components/ui/CategoryBadge/CategoryBadge";

const AllNewsPage = () => {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await getAllNews();
        if (response.status) {
          setAllNews(response.data);
        }
      } catch (error) {
        console.error("Error fetching news list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress color="error" />
      </Box>
    );
  }

  return (
    <Container className="my-10">
      <Typography
        variant="h3"
        fontWeight={800}
        gutterBottom
        align="center"
        className="mb-10 text-gray-800"
        sx={{ fontFamily: "'Playfair Display', serif" }}
      >
        All Recent News
      </Typography>

      <Grid container spacing={4}>
        {allNews.map((news, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={news.id || news._id}>
            <Link
              href={`/news/${news.id || news._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.2s",
                  borderRadius: 3,
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                }}
              >
                <CardActionArea
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <CardMedia sx={{ width: "100%", position: 'relative', height: 200, overflow: 'hidden' }}>
                    <Image
                      src={news.thumbnail_url || "https://picsum.photos/400/300"}
                      fill
                      alt={news.title}
                      priority={index < 4}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                      style={{ objectFit: "cover" }}
                    />
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1, width: "100%", p: 2.5 }}>
                    <CategoryBadge category={news.category} />
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 700, lineHeight: 1.3, mt: 1.5 }}
                    >
                      {news.title.length > 55
                        ? news.title.slice(0, 55) + "..."
                        : news.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mb: 2 }}
                    >
                      By {news.author?.name} &bull; {news.author?.published_date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {news.details}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AllNewsPage;
