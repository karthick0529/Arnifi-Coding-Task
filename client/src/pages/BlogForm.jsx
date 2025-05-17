import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

const BlogForm = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    image: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      API.get("/blogs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          const blog = res.data.find((b) => b._id === id);
          if (blog) setForm(blog);
        })
        .catch(() => setError("Failed to load blog."));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (message) => {
    setToastMessage(message);
    setOpenToast(true);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenToast(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/blogs/${id}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        showToast("Blog updated successfully!");
      } else {
        await API.post("/blogs", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        showToast("Blog created successfully!");
      }
      
      // Redirect after a short delay to show toast
      setTimeout(() => navigate("/blogs"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error saving blog");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Edit Blog" : "Create Blog"}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Image URL"
          name="image"
          value={form.image}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Content"
          name="content"
          value={form.content}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={5}
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          {isEdit ? "Update" : "Create"}
        </Button>
      </form>

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

export default BlogForm;
