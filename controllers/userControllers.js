/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating user services.
 */

const {user} = require("../utils/instances");


exports.setUser = async (req, res) => {
    try {
        const response_body = await user.setUser(req.body);

        res.status(201).json({
            message: "Added user ✅",
            status_code: 201,
            data: response_body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getUsers = async (req, res) => {
    try {
        res.status(200).json(await user.getUsers());

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getUser = async (req, res) => {
    try {
        res.status(200).json(await user.getUser(req.id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await user.deleteUser(req.id);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateUser = async (req, res) => {
    try {
        const response_body = await user.updateUser(req.id, req.body);

        res.status(202).json({
            message: 'Updated user ✅',
            status_code: 202,
            data: response_body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.addSocialMedia = async (req, res) => {
    try {
        await user.addSocialMedia(req.id, req.body);

        res.status(202).json({
            message: "Updated social media ✅",
            status_code: 202,
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteSocialMedia = async (req, res) => {
    try {
        await user.deleteSocialMedia(req.id, req.query.key, req.query.value);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.updateSocialMedia = async (req, res) => {
    try {
        await user.updateSocialMedia(req.id, req.body);

        res.status(202).json({
            message: "Updated social media ✅",
            status_code: 202,
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.makeRescuer = async (req, res) => {
    try {
        const response_body = await user.makeRescuer(req.id);

        res.status(202).json({
            message: "Request sent successfully ✅",
            status_code: 202,
            data: response_body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
