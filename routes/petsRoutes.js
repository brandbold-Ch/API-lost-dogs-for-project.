const { checkUserExists } = require('../middlewares/entityManager');
const { checkPostExists } = require('../middlewares/entityManager');
const { checkQueryParameters } = require('../middlewares/entityManager');
const petsControllers = require('../controllers/petsControllers');
const express = require('express');
const petsRoute = express.Router();
const processFormData = require('../middlewares/formData');
const isAuthenticate = require('../middlewares/authenticate');

petsRoute.post('/new', isAuthenticate, checkUserExists, processFormData, petsControllers.insertLostPet);
petsRoute.put('/:pet_id', isAuthenticate, checkUserExists, checkPostExists, processFormData, petsControllers.updatePost);
petsRoute.get('/all', isAuthenticate, checkUserExists, petsControllers.getPosts);
petsRoute.get('/filter/gender', isAuthenticate, checkUserExists, checkQueryParameters, petsControllers.getFilterPostGender);
petsRoute.get('/filter/breed', isAuthenticate, checkUserExists,checkQueryParameters, petsControllers.getFilterPostBreed);
petsRoute.get('/filter/size', isAuthenticate, checkUserExists, checkQueryParameters, petsControllers.getFilterPostSize);
petsRoute.get('/filter/owner', isAuthenticate, checkUserExists, checkQueryParameters, petsControllers.getFilterPostOwner);
petsRoute.get('/filter/found', isAuthenticate, checkUserExists, checkQueryParameters, petsControllers.getFilterPostFound);
petsRoute.get('/filter/specie', isAuthenticate, checkUserExists, checkQueryParameters, petsControllers.getFilterPostSpecie);
petsRoute.get('/:pet_id', isAuthenticate, checkUserExists, checkPostExists, petsControllers.getPost);
petsRoute.delete('/:pet_id', isAuthenticate, checkUserExists, checkPostExists, petsControllers.delPost);
petsRoute.post('/tags/new/:pet_id', isAuthenticate, checkUserExists, checkPostExists, express.urlencoded({ extended: true }), petsControllers.insertTagsPost);
petsRoute.delete('/tags/:pet_id', isAuthenticate, checkUserExists, checkPostExists, petsControllers.delTagsPost);
petsRoute.post('/gallery/:pet_id', isAuthenticate, checkUserExists, checkPostExists, processFormData, petsControllers.addGallery);
petsRoute.delete('/gallery/:pet_id', isAuthenticate, checkUserExists, checkPostExists, petsControllers.delPartialGallery);
petsRoute.post('/comment/new', isAuthenticate, checkUserExists, checkPostExists, express.text() ,petsControllers.insertComment);

module.exports = petsRoute;
