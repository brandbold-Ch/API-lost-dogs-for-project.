/**
 * @author Brandon Jared Molina Vazquez
 * @date 04/10/2023
 * @file This module is for creating auth services.
 */

const { auths } = require('../singlenton/instances');
const Request = require("../models/request");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.getCredentials =  async (req, res) => {
    try {
        res.status(200).json(await auths.getCredentials(req.id));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateCredentials = async (req, res) => {
    try {
        await auths.updateAuth(req.id, req.body);
        res.status(202).json({
            message: 'Updated credentials ✅',
            data: req.body.email
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const typeUser = (data) => {
    return new Promise(async (resolve, reject) => {
        if (data[1]["role"] === "COLLABORATOR") {
            const request = await Request.findOne({ user: data[1]["user"]});

            if (request['status'] === 'pending') {
                reject([403, {message: 'You are in a waiting process, ' +
                        'the administrator must activate your account ⏳'}]);
            }
            else if (request['status'] === 'rejected') {
                reject([401, {message: 'Your request was rejected by the administrator 🚫'}]);
            }
            else if (request['status'] === 'disabled'){
                reject([403, {message: 'Your account is deactivated 📴'}]);
            }
        }
        resolve(data)
    })
}

const validateRequest = (body) => {
    return new Promise((resolve, reject) => {
        if (body.email && body.password) {
            resolve(body);
        } else {
            reject([400, {message: 'You did not send the credentials 🙄'}]);
        }
    });
}

const validateEmail = (body) => {
    return new Promise((resolve, reject) => {

        const parseEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(body.email);

        if (parseEmail) {
            resolve(body);
        } else {
            reject([400, {message: 'Invalid email field 💢'}]);
        }
    })
}

const validateUser = (body) => {
    return new Promise(async (resolve, reject) => {
        const user = await auths.getEmail(body.email);

        if (user) {
            resolve([body, user]);
        } else {
            reject([404, {message: 'Not found user 🚫'}]);
        }
    });
}

const validatePassword = (data) => {
    return new Promise(async (resolve, reject) => {

        const match = bcrypt.compareSync(data[0].password, data[1].password);

        if (match) {

            const token = await auths.generateToken({
                user: data[1].user,
                role: data[1].role
            });
            const decompile = jwt.verify(token, process.env.SECRET_KEY);

            resolve({
                token: token,
                details: {
                    start: decompile.iat,
                    end: decompile.exp
                }
            });

        } else {
            reject([401, {message: 'Incorrect password 🤬'}]);
        }
    })
}

exports.login = async (req, res) => {
    validateRequest(req.body)
        .then(body => validateEmail(body))
        .then(email => validateUser(email))
        .then(burden => typeUser(burden))
        .then(async data => {
            res.status(200).json(await validatePassword(data));
        })
        .catch(err => {
            res.status(err[0]).json(err[1]);
        })
}

exports.statusToken = async (req, res) => {
    try {
        res.status(200).json(await auths.detailToken(req.body.token));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
