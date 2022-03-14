const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const authConfig = require('../../config/auth');
const { rsaGenerate, rsaEncripty, rsaDecripty } = require('../../modules/rsa-key');
const User = require('../models/user');
const router = express.Router();

function generateToken(params = {}){
    return jwt.sign( params, authConfig.jwt_secret, {
        expiresIn: 86400
    });
}

router.post('/register', async (req, res) => {
    const { email } = req.body;
    
    // return res.send({rsaGenerate: rsaGenerate()});
    try{
        if(await User.findOne({ email })){
            return res.status(400).send({error: 'User already exists'})
        }

        const rsaKey = rsaGenerate();
        const secret = rsaEncripty( rsaKey.public_key, uuidv4() );

        req.body.rsaPrivateKey = rsaKey.private_key;
        req.body.secret = secret;

        const user = await User.create(req.body);

        user.rsaPrivateKey = undefined;
        user.password = undefined;
        user.secret = undefined;

        return res.send({
            user,
            secret: rsaDecripty(rsaKey.private_key ,secret),
            token: generateToken({ id: user.id }),
            rsaKeyPublic: rsaKey.public_key
        });

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Registration failed' });
    }

});


router.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return res.status(400).send({error: 'User not found!'});
    }

    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({error: 'Invalid password!'});
    }

    user.password = undefined;

    res.send({ 
        user, 
        token: generateToken({ id: user.id }) 
    });
});

router.post('/forgot_password', async (req, res) => {
});


router.post('/reset_password', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email })
        
        if(!user){
            return res.status(400).send({error: 'User not found!'});
        }

        user.password = password;

        await user.save();

        res.send();
    } catch (err) {
        res.status(400).send({ erro: 'Cannot reset password, try again' });
    }
})

module.exports = app => app.use('/auth', router);