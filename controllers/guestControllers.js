/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating application services.
 */

const { guests } = require('../singlenton/instances');

exports.getLostPets = async (req, res) => {
    try {
        res.status(200).json(await guests.getAllLostPets());

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getUserAndPet = async (req, res) => {
    try {
        res.status(200).json(await guests.getUserAndPet(req.query.pet));
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostGender = async (req, res) => {
    try {
        res.status(200).json(await guests.getFilterPostGender(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostBreed = async (req, res) => {
    try {
        res.status(200).json(await guests.getFilterPostBreed(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostSize = async (req, res) => {
    try {
        res.status(200).json(await guests.getFilterPostSize(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostOwner = async (req, res) => {
    try {
        res.status(200).json(await guests.getFilterPostOwner(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostFound = async (req, res) => {
    try {
        res.status(200).json(await guests.getFilterPostFound(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostSpecie = async (req, res) => {
    try {
        res.status(200).json(await guests.getFilterPostSpecie(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostById = async (req, res) => {
    try {
        res.status(200).json(await guests.getFilterPostById(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostLostDate = async (req, res) => {
    try {
        res.status(200).json(await guests.getFilterPostLostDate(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostYear = async (req, res) => {
    try {
        res.status(200).json(await guests.getFilterPostYear(req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getBulletins = async (req, res) => {
    try {
        res.status(200).json(await guests.getBulletins());

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getBulletin = async (req, res) => {
    try {
        res.status(200).json(await guests.getBulletin(req.query.ad));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

