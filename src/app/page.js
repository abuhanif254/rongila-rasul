"use client";
import { useState, useEffect } from "react";
import LatestNews from "@/components/ui/LatestNews/LatestNews";
import SideBar from "@/components/ui/SideBar/SideBar";
import NewsTicker from "@/components/ui/NewsTicker/NewsTicker";
import SearchBox from "@/components/ui/SearchBox/SearchBox";
import TrendingTopics from "@/components/ui/TrendingTopics/TrendingTopics";
import { Grid, Box, CircularProgress } from "@mui/material";
import { getAllNews } from "@/utils/getAllNews";

const HomePage = () => {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getAllNews();
        if (response.status) {
          setAllNews(response.data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
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
    <Box className="fade-in-up">
      <NewsTicker allNews={allNews} />
      <SearchBox allNews={allNews} />
      <TrendingTopics allNews={allNews} />
      <Grid container spacing={3} sx={{ mt: 0 }}>
        <Grid item xs={12} md={8}>
          <LatestNews allNews={allNews} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SideBar allNews={allNews} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
