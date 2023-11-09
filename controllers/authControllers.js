/**
 * @author Brandon Jared Molina Vazquez
 * @date 04/10/2023
 * @file This module is for creating auth services.
 */

const { auths } = require('../singlenton/uniqueInstances');
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
        await auths.updateCredentials(req.id, req.body);
        res.status(202).json({
            message: 'Updated credentials ✅',
            data: req.body
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email && password) {
            const verifyEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

            if (verifyEmail){
                const user = await auths.getEmail(email);

                if (user) {
                    const match = bcrypt.compareSync(password, user['password']);

                    if (match) {

                        const token = await auths.generateTokenUser({
                            user: user['user'],
                            role: user['role']
                        });
                        const decompile = jwt.verify(token, process.env.SECRET_KEY);

                        res.status(202).json({
                            token: token,
                            details: {
                                start: decompile.iat,
                                end: decompile.exp
                            }
                        });

                    } else {
                        res.status(401).json({message: 'Incorrect password 🤬'});
                    }

                } else {
                    res.status(404).json({message: 'Not found user 🚫'});
                }

            } else {
                res.status(400).json({message: 'Invalid email field 💢'});
            }

        } else {
            res.status(400).json({message: 'You did not send the credentials 🙄'});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.statusToken = async (req, res) => {
    try {
        res.status(200).json(await auths.detailToken(req.body.token));

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
