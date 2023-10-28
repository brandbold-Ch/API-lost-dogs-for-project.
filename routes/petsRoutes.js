const { checkUserExists } = require('../middlewares/entityManager');
const { checkPostExists } = require('../middlewares/entityManager');
const { checkQueryParameters } = require('../middlewares/entityManager');
const petsControllers = require('../controllers/petsControllers');
const express = require('express');
const petsRoute = express.Router();
const processFormData = require('../middlewares/formData');
const isAuthenticate = require('../middlewares/authenticate');

petsRoute.post('/new/:id', checkUserExists, isAuthenticate, processFormData, petsControllers.insertLostPet);
petsRoute.put('/:id/pets/:pet_id', checkUserExists, checkPostExists, isAuthenticate, processFormData, petsControllers.updatePost);
petsRoute.get('/all/:id', checkUserExists, isAuthenticate, petsControllers.getPosts);
petsRoute.get('/:id/filter/gender', checkUserExists, isAuthenticate, checkQueryParameters, petsControllers.getFilterPostGender);
petsRoute.get('/:id/filter/breed', checkUserExists, isAuthenticate, checkQueryParameters, petsControllers.getFilterPostBreed);
petsRoute.get('/:id/filter/size', checkUserExists, isAuthenticate, checkQueryParameters, petsControllers.getFilterPostSize);
petsRoute.get('/:id/filter/owner', checkUserExists, isAuthenticate, checkQueryParameters, petsControllers.getFilterPostOwner);
petsRoute.get('/:id/filter/found', checkUserExists, isAuthenticate,checkQueryParameters, petsControllers.getFilterPostFound);
petsRoute.get('/:id/filter/specie', checkUserExists, isAuthenticate,checkQueryParameters, petsControllers.getFilterPostSpecie);
petsRoute.get('/:id/pets/:pet_id', checkUserExists, checkPostExists, isAuthenticate, petsControllers.getPost);
petsRoute.get('/:id/pets/:pet_id', checkUserExists, checkPostExists, isAuthenticate, petsControllers.getPost);
petsRoute.delete('/:id/pets/:pet_id', checkUserExists, checkPostExists, isAuthenticate, petsControllers.delPost);
petsRoute.post('/:id/pets/tags/new/:pet_id', checkUserExists, checkPostExists, isAuthenticate, express.urlencoded({ extended: true }), petsControllers.insertTagsPost);
petsRoute.delete('/:id/pets/tags/:pet_id', checkUserExists, checkPostExists, isAuthenticate, petsControllers.delTagsPost);
petsRoute.post('/:id/pets/gallery/:pet_id', checkUserExists, checkPostExists, isAuthenticate, processFormData, petsControllers.addGallery);
petsRoute.delete('/:id/pets/gallery/:pet_id', checkUserExists, checkPostExists, isAuthenticate, petsControllers.delPartialGallery);

module.exports = petsRoute;
