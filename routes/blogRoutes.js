const {rescuerRolePermission, checkBlogExists} = require("../middlewares/anyMiddlewares");
const blogControllers = require("../controllers/blogControllers");
const express = require("express");
const blogRouter = express.Router();
const processFormData = require("../middlewares/formData");
const {validateBlogData} = require("../middlewares/handlerInputData/handlerBlogData");


blogRouter.use(rescuerRolePermission);

blogRouter.post("/blogs", processFormData, validateBlogData, blogControllers.setBlog);
blogRouter.get("/blogs", blogControllers.getBlogs);
blogRouter.get("/blogs/:blog_id", checkBlogExists, blogControllers.getBlog);
blogRouter.put("/blogs/:blog_id", checkBlogExists, processFormData, blogControllers.updateBlog);
blogRouter.delete("/blogs/:blog_id", checkBlogExists, blogControllers.deleteBlog);
blogRouter.delete("/blogs/:blog_id/images", checkBlogExists, blogControllers.deleteImage);

module.exports = {blogRouter}
