/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating application services.
 */

const {guest} = require('../utils/instances');
const {HandlerHttpVerbs} = require("../errors/handlerHttpVerbs");


exports.getLostPets = async (req, res) => {
    try {
        res.status(200).json(await guest.getAllLostPets());

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
};

exports.getUserAndPet = async (req, res) => {
    try {
        res.status(200).json(await guest.getUserAndPet(req.query.pet));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
};

exports.filterAllPosts = async (req, res) => {
    try {
        if (req.query?.gender) {
            res.status(200).json(await guest.getFilterPostGender(req.query.gender));
        }

        else if (req.query?.breed) {
            res.status(200).json(await guest.getFilterPostBreed(req.query.breed));
        }

        else if (req.query?.size) {
            res.status(200).json(await guest.getFilterPostSize(req.query.size));
        }

        else if (req.query?.owner) {
            res.status(200).json(await guest.getFilterPostOwner(req.query.owner));
        }

        else if (req.query?.found) {
            res.status(200).json(await guest.getFilterPostFound(req.query.found));
        }

        else if (req.query?.specie) {
            res.status(200).json(await guest.getFilterPostSpecie(req.query.specie));
        }

        else if (req.query?.date) {
            res.status(200).json(await guest.getFilterPostLostDate(req.query.date));
        }

        else if (req.query?.year) {
            res.status(200).json(await guest.getFilterPostYear(req.query.year));
        }

        else if (req.query?.lost_date) {
            res.status(200).json(await guest.getFilterPostLostDate(req.query.lost_date));
        }

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
};

exports.getBulletins = async (req, res) => {
    try {
        res.status(200).json(await guest.getBulletins());

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getBulletin = async (req, res) => {
    try {
        res.status(200).json(await guest.getBulletin(req.query.ad));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getBlogs = async (req, res) => {
    try {
        res.status(200).json(await guest.getBlogs());

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}

exports.getBlog = async (req, res) => {
    try {
        res.status(200).json(await guest.getBlog(req.query.ad));

    } catch (err) {
        res.status(500).json(
            HandlerHttpVerbs.internalServerError(
                err.message, {url: req.baseUrl, verb: req.method}
            )
        );
    }
}
