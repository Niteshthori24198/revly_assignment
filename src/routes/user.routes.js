
const express = require('express');
const bcrypt = require('bcrypt');
const { isNameValid, isEmailValid, isPasswordValid, isLanguageValid } = require('../service/validation.service');
const { User } = require('../model/user.model');
const { registerNewUser, getUser } = require('../service/user.service');
const { ResourceExistsError } = require('../error/resource.exists.error');
const { createToken } = require('../service/jwt.service');
const userRouter = express.Router();


const createUser = async (req, res, role) => {

    const { name, email, password, language } = req.body;

    if (!isNameValid(name) || !isEmailValid(email) || !isPasswordValid(password) || !isLanguageValid(language)) {

        return res.status(400).send({
            success: false,
            message: 'Kindly enter valid details : name, email, password, language'
        });
    }

    // create user object for storing in db

    let newuser = new User();
    newuser.email = email;
    newuser.name = name;
    newuser.password = password;
    newuser.language = language;
    newuser.role = role;

    try {
        newuser = await registerNewUser(newuser);
    } catch (error) {

        let statuscode = 500;

        if (error.constructor == ResourceExistsError) {
            statuscode = 409;
        }

        return res.status(statuscode).send({
            success: false,
            message: error.message
        })
    }

    return res.status(200).send({
        success: true,
        user: {
            name: newuser.name,
            email: newuser.email,
            language: newuser.language,
            lastActive: newuser.lastActive
        }
    })

}


userRouter.post('/student/signup', (req, res) => {
    createUser(req, res, 'student')
});

userRouter.post('/tutor/signup', (req, res) => {
    createUser(req, res, 'tutor')
});

userRouter.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!isEmailValid(email) || !isPasswordValid(password)) {
        return res.status(400).send({
            success: false,
            message: 'Kindly enter valid details : email, password'
        });
    }

    const user = await getUser(email);

    if (!user) {
        return res.status(404).send({
            success: false,
            message: 'User not found'
        });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({
            success: false,
            message: 'Incorrect password'
        });
    }

    return res.status(200).send({
        success: true,
        token: createToken(user),
    })

})

module.exports = userRouter;