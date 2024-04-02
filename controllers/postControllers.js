/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating pets services.
 */

const { posts } = require("../singlenton/instances");


exports.insertLostPet = async (req, res) => {
    try {
        await posts.insertLostPet(req.id, [JSON.parse(JSON.stringify(req.body)), req.files], req.role);
        res.status(201).json({
            message: "Added post ✅",
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getPosts = async (req, res) => {
    try {
        res.status(200).json(await posts.getPosts(req.id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostGender = async (req, res) => {
    try {
        res.status(200).json(await posts.getFilterPostGender(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostBreed = async (req, res) => {
    try {
        res.status(200).json(await posts.getFilterPostBreed(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostSize = async (req, res) => {
    try {
        res.status(200).json(await posts.getFilterPostSize(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostOwner = async (req, res) => {
    try {
        res.status(200).json(await posts.getFilterPostOwner(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostFound = async (req, res) => {
    try {
        res.status(200).json(await posts.getFilterPostFound(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostSpecie = async (req, res) => {
    try {
        res.status(200).json(await posts.getFilterPostSpecie(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostLostDate = async (req, res) => {
    try {
        res.status(200).json(await posts.getFilterPostLostDate(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostYear = async (req, res) => {
    try {
        res.status(200).json(await posts.getFilterPostYear(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getPost = async (req, res) => {
    try {
        res.status(200).json(await posts.getPost(req.id, req.params.pet_id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updatePost = async (req, res) => {
    try {
        await posts.updatePost(req.id, req.params.pet_id, [JSON.parse(JSON.stringify(req.body)), req.files[0]]);
        res.status(202).json({
            message: 'Updated post ✅',
            data: JSON.parse(JSON.stringify(req.body))
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deletePost = async (req, res) => {
    try {
        await posts.deletePost(req.id, req.params.pet_id);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.addGallery = async (req, res) => {
    try {
        await posts.addGallery(req.id, req.params.pet_id, req.files);
        res.status(201).json({
            message: 'Added images ✅',
            data: `${req.files.length} buffered images`
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.delPartialGallery = async (req, res) => {
    try {

        if (req.query.image) {
            await posts.deletePartialGallery(req.id, req.params.pet_id, req.query.image);
            res.status(204).end();
        }
        else {
            res.status(404).json({message: "Id image required. ⚠️"});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.insertComment = async (req, res) => {
    try {
        const comment = await posts.insertComment(req.id, req.query.pet, req.body);
        res.status(201).json({
            message: 'Added comment ✅',
            data: comment
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
