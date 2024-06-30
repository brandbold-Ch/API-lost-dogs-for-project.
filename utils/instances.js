const { UserServices } = require("../services/userServices");
const { PostServices } = require("../services/postServices");
const { AuthServices } = require("../services/authServices");
const { GuestServices } = require("../services/guestServices");
const { AdminServices } = require("../services/adminServices");
const { RescuerServices } = require("../services/rescuerServices");
const { BulletinServices } = require("../services/bulletinServices");
const { BlogServices } = require("../services/blogServices");
const { AssociationServices } = require("../services/associationServices");


const user = new UserServices();
const post = new PostServices();
const auth = new AuthServices();
const guest = new GuestServices();
const admin = new AdminServices();
const bulletin = new BulletinServices();
const rescuer = new RescuerServices();
const blog = new BlogServices();
const association = new AssociationServices();

module.exports = {
    user,
    guest,
    admin,
    post,
    bulletin,
    auth,
    rescuer,
    blog,
    association
}
