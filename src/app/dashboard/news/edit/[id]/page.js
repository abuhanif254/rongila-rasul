"use client";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper, Grid, MenuItem, Alert, CircularProgress } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { getNewsById, updateNews, getCategories } from "@/lib/firestore";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function EditNews() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    thumbnail_url: "",
    details: "",
    authorName: "",
    imageUrl: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchArticleAndCats = async () => {
      try {
        setFetching(true);
        // Fetch categories
        const cats = await getCategories();
        setCategories(cats);

        // Fetch article
        const article = await getNewsById(id);
        
        if (article) {
          setFormData({
            title: article.title || "",
            category: article.category || "",
            thumbnail_url: article.thumbnail_url || "",
            details: article.details || "",
            authorName: article.author?.name || "",
            imageUrl: article.image_url || article.thumbnail_url || "",
          });
        } else {
          setStatus({ type: "error", message: "Article not found in Firestore" });
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setStatus({ type: "error", message: "Failed to load data from Firestore" });
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchArticleAndCats();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const updatedArticle = {
      title: formData.title,
      category: formData.category,
      details: formData.details,
      thumbnail_url: formData.thumbnail_url,
      image_url: formData.imageUrl || formData.thumbnail_url,
      author: {
        name: formData.authorName,
      },
    };

    try {
      await updateNews(id, updatedArticle);
      setStatus({ type: "success", message: "Article updated successfully!" });
      setTimeout(() => router.push("/dashboard/news"), 1500);
    } catch (err) {
      console.error("Error updating article:", err);
      setStatus({ type: "error", message: "Error updating article in Firestore." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="error" />
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" mx="auto">
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 3, fontWeight: "bold" }}>
        Back to Articles
      </Button>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="900" mb={3} color="#0f172a">
          Edit Article
        </Typography>

        {status.message && (
          <Alert severity={status.type} sx={{ mb: 3 }}>
            {status.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                fullWidth required 
                label="Article Title" 
                variant="outlined"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                select fullWidth required 
                label="Category" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(cat => (
                  <MenuItem key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth required 
                label="Author Name" 
                value={formData.authorName} 
                onChange={e => setFormData({...formData, authorName: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Thumbnail Image URL" 
                value={formData.thumbnail_url} 
                onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Full Banner Image URL" 
                value={formData.imageUrl} 
                onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth required multiline rows={10} 
                label="Article Content" 
                value={formData.details} 
                onChange={e => setFormData({...formData, details: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="error" 
                size="large" 
                fullWidth 
                disabled={loading} 
                sx={{ py: 2, fontWeight: "900", letterSpacing: 0.5, borderRadius: 2 }}
              >
                {loading ? "Updating Article..." : "UPDATE ARTICLE"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
