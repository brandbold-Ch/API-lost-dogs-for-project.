const UsersService = require('../services/userServices');
const PostsService = require('../services/postServices');
const AuthService = require('../services/authServices');
const GuestsServices = require('../services/guestServices');
const AdminsServices = require('../services/adminServices');
const CollabServices = require('../services/collabServices');
const BulletinServices = require('../services/bulletinServices');
const express = require('express');
const users = new UsersService();
const posts = new PostsService();
const auths = new AuthService();
const guests = new GuestsServices();
const admins = new AdminsServices();
const bulletins = new BulletinServices();
const collabs = new CollabServices();
const app = express();

module.exports = {
    users,
    express,
    guests,
    admins,
    posts,
    bulletins,
    auths,
    collabs,
    app
}
