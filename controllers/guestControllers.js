/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating application services.
 */

const { guest } = require('../utils/instances');

exports.getLostPets = async (req, res) => {
    try {
        res.status(200).json(await guest.getAllLostPets());

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getUserAndPet = async (req, res) => {
    try {
        res.status(200).json(await guest.getUserAndPet(req.query.pet));
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostGender = async (req, res) => {
    try {
        res.status(200).json(await guest.getFilterPostGender(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostBreed = async (req, res) => {
    try {
        res.status(200).json(await guest.getFilterPostBreed(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostSize = async (req, res) => {
    try {
        res.status(200).json(await guest.getFilterPostSize(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostOwner = async (req, res) => {
    try {
        res.status(200).json(await guest.getFilterPostOwner(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostFound = async (req, res) => {
    try {
        res.status(200).json(await guest.getFilterPostFound(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostSpecie = async (req, res) => {
    try {
        res.status(200).json(await guest.getFilterPostSpecie(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostById = async (req, res) => {
    try {
        res.status(200).json(await guest.getFilterPostById(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostLostDate = async (req, res) => {
    try {
        res.status(200).json(await guest.getFilterPostLostDate(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostYear = async (req, res) => {
    try {
        res.status(200).json(await guest.getFilterPostYear(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getBulletins = async (req, res) => {
    try {
        res.status(200).json(await guest.getBulletins());

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getBulletin = async (req, res) => {
    try {
        res.status(200).json(await guest.getBulletin(req.query.ad));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

