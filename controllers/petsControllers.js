/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file This module is for creating pets services.
 */

const { pets } = require('../singlenton/uniqueInstances');

exports.insertLostPet = async (req, res) => {
    try {
        await pets.insertLostPet(req.id, [JSON.parse(JSON.stringify(req.body)), req.files[0]]);
        res.status(201).json(
            {
                message: 'Added post ✅',
                data: req.body
            }
        );

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getPosts = async (req, res) => {
    try {
        res.status(200).json(await pets.getPosts(req.id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostGender = async (req, res) => {
    try {
        res.status(200).json(await pets.getFilterPostGender(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostBreed = async (req, res) => {
    try {
        res.status(200).json(await pets.getFilterPostBreed(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostSize = async (req, res) => {
    try {
        res.status(200).json(await pets.getFilterPostSize(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostOwner = async (req, res) => {
    try {
        res.status(200).json(await pets.getFilterPostOwner(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostFound = async (req, res) => {
    try {
        res.status(200).json(await pets.getFilterPostFound(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getFilterPostSpecie = async (req, res) => {
    try {
        res.status(200).json(await pets.getFilterPostSpecie(req.id, req.query.value));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getPost = async (req, res) => {
    try {
        res.status(200).json(await pets.getPost(req.id, req.params.pet_id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updatePost = async (req, res) => {
    try {
        await pets.updatePost(req.id, req.params.pet_id, [JSON.parse(JSON.stringify(req.body)), req.files[0]]);
        res.status(200).json(
            {
                message: 'Updated post ✅',
                data: JSON.parse(JSON.stringify(req.body))
            }
        );

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.delPost = async (req, res) => {
    try {
        await pets.delPost(req.id, req.params.pet_id);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.addGallery = async (req, res) => {
    try {
        console.log(req.files)
        await pets.addGallery(req.id, req.params.pet_id, req.files);
        res.status(201).json(
            {
                message: 'Added images ✅',
                data: `${req.files.length} buffered images`
            }
        );
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.delPartialGallery = async (req, res) => {
    try {
        console.log(req.query.image);
        await pets.delPartialGallery(req.id, req.params.pet_id, req.query.image);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.insertTagsPost = async (req, res) => {
    try {
        await pets.insertTagsPost(req.id, req.params.pet_id , JSON.parse(JSON.stringify(req.body)));
        res.status(201).json(
            {
                message: 'Added tag ✅',
                data: JSON.parse(JSON.stringify(req.body))
            }
        );

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.delTagsPost = async (req, res) => {
    try {
        await pets.delTagsPost(req.id, req.params.pet_id, req.query.key, req.query.value);
        res.status(204).end();

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.insertComment = async (req, res) => {
    try {
        await pets.insertComment(req.id, req.query.user, req.query.pet, req.body);
        res.status(201).json(
            {
                message: 'Added comment ✅',
                data: req.body
            }
        );

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
