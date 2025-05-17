import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Stack,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const showToast = (message) => {
    setToastMessage(message);
    setOpenToast(true);
  };

  const handleCloseToast = (event, reason) => {
    // Prevent closing on clickaway if you want or just close always
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
  };

  const fetchMyBlogs = async () => {
    try {
      const res = await API.get("/blogs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const userBlogs = res.data.filter((blog) => blog.author === user.name);
      setBlogs(userBlogs);
    } catch (err) {
      console.error("Failed to fetch user blogs");
      showToast("Failed to fetch your blogs");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await API.delete(`/blogs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      showToast("Blog deleted successfully");
    } catch (err) {
      showToast("Delete failed");
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Blogs
      </Typography>
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
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <CardActionArea sx={{ flexGrow: 1 }}>
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
                  <Typography gutterBottom variant="h6" component="div">
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {blog.category}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {blog.content}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Stack direction="row" spacing={1} p={2} justifyContent="center">
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/edit/${blog._id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(blog._id)}
                >
                  Delete
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        message={toastMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseToast}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
};

export default MyBlogs;
