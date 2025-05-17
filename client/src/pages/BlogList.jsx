import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Box,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import API from "../api/axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filters, setFilters] = useState({ category: "", author: "" });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    authors: [],
  });
  const [error, setError] = useState("");

  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blogs", { params: filters });
      setBlogs(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch blogs");
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const res = await API.get("/blogs/filters");
      setFilterOptions(res.data);
    } catch (err) {
      console.error("Failed to load filter options");
    }
  };

  useEffect(() => {
    fetchFilterOptions();
    fetchBlogs();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  return (
    <>
      {/* FILTER SECTION OUTSIDE MAIN CONTAINER */}
      <Box sx={{ padding: "24px", backgroundColor: "#f9f9f9" }}>
        <Typography variant="h5" gutterBottom>
          Filter Blogs
        </Typography>
        <Grid container spacing={3} marginTop={5}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="medium">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                label="Category"
                startAdornment={
                  <CategoryIcon sx={{ mr: 1, color: "action.active" }} />
                }
                sx={{ pl: 4 }} 
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="medium">
              <InputLabel id="author-label">Author</InputLabel>
              <Select
                labelId="author-label"
                value={filters.author}
                onChange={(e) =>
                  setFilters({ ...filters, author: e.target.value })
                }
                label="Author"
                startAdornment={
                  <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                }
                sx={{ pl: 5 }} 
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.authors.map((auth) => (
                  <MenuItem key={auth} value={auth}>
                    {auth}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* BLOGS DISPLAY */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          All Blogs
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <Card
                sx={{
                  maxWidth: 300,
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardActionArea>
                  {blog.image && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={blog.image}
                      alt={blog.title}
                    />
                  )}
                  <CardContent
                    sx={{
                      height: 150, 
                      overflowY: "auto", 
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography gutterBottom variant="h6">
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {blog.author} | {blog.category}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      {blog.content}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default BlogList;
