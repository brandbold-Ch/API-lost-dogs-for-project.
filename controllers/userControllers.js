/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating user services.
 */

const { users } = require('../singlenton/uniqueInstances')

exports.getUsers = async (req, res) => {
    try {
        res.status(200).json(await users.getAll());
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.setUser = async (req, res) => {
    try {
        await users.create(req.body);
        res.status(201).json({
            message: 'Added user ✅',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getUser = async (req, res) => {
    try {
        res.status(200).json(await users.getUser(req.id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.delUser = async (req, res) => {
    try {
        await users.delUser(req.id);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateUser = async (req, res) => {
    try {
        await users.updateUser(req.id, req.body);
        res.status(202).json({
            message: 'Update user ✅',
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateSocialMedia = async (req, res) => {
    try {
        await users.updateSocialMedia(req.id, req.query.social, req.body);
        res.status(202).json({
            message: 'Updated social media ✅',
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
