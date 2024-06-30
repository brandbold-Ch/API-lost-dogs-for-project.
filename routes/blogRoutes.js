const { specialPermissions, checkBlogExists } = require("../middlewares/middlewaresFunctions");
const blogControllers = require("../controllers/blogControllers");
const express = require("express");
const blogRouter = express.Router();
const processFormData = require("../middlewares/formData");
const { blogDataValidator } = require("../middlewares/joiMiddlewares/blogValidator");


blogRouter.use(specialPermissions);

blogRouter.post("/blogs", processFormData, blogDataValidator, blogControllers.createBlog);
blogRouter.get("/blogs", blogControllers.getBlogs);
blogRouter.get("/blogs/:blog_id", checkBlogExists, blogControllers.getBlog);
blogRouter.put("/blogs/:blog_id", checkBlogExists, processFormData, blogControllers.updateBlog);
blogRouter.delete("/blogs/:blog_id", checkBlogExists, blogControllers.deleteBlog);
blogRouter.delete("/blogs/:blog_id/images", checkBlogExists, blogControllers.deleteImage);

module.exports = { blogRouter }
