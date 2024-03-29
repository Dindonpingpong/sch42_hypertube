const router = require('express').Router();
const { getProfile, editProfile, insertFriend, deleteFriend, getNotif, addNotif, getFavoriteMovies, getProfileComments, getProfileFriends } = require("../models/user");
const bcrypt = require('bcrypt');

router.get('/profile/:you/:me', async (req, res) => {
    try {
        const { you, me } = req.params;

        getProfile(you, me)
            .then(data => {
                if (data.length > 0) {
                    res.status(200).json({
                        result: data[0],
                        message: "Ok",
                        success: true
                    });
                }
                else
                    res.status(200).json({
                        message: "Profile not found",
                        success: false
                    })
            })
            .catch((e) => {
                res.status(200).json({
                    message: e.message,
                    success: false
                })
            })
    } catch (e) {
        res.status(200).json({
            message: e.message,
            success: false
        })
    }
})

router.post('/profile/edit/:username', async (req, res) => {
    const { username } = req.params;
    let keys = [];
    let params = [];
    let i = 1;

    for (const [key, value] of Object.entries(req.body)) {
        if (value !== null && key !== 'newpass') {
            keys.push(`${key} = $${i++}`);
            params.push(value);
        }
        else if (value !== null && key === 'newpass') {
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(value, salt);

            keys.push(`password = $${i++}`);
            params.push(hash);
        }
    }

    if (params.length === 0) {
        res.status(200).json({
            msg: 'wow',
            nickname: username,
            success: true
        })
        return;
    }

    const que = keys.join(', ');
    params.push(username);

    editProfile(que, params, i)
        .then(data => {
            res.status(200).json({
                message: "Ok",
                username: data[0].displayname,
                success: true
            })
        })
        .catch(e => {
            res.status(200).json({
                message: e.message,
                success: false
            })
        })
})

router.get('/movies/:me', function (req, res) {
    try {
        const { me } = req.params;

        getFavoriteMovies(me)
            .then(data => {
                res.status(200).json({
                    success: true,
                    result: data
                });
            })
            .catch(() => {
                res.status(200).json({
                    success: false,
                    message: "Ooops! Not found favorite films"
                })
            })
    } catch (e) {
        res.status(200).json({
            success: false,
            message: "Ooops! Not found favorite films"
        })
    }
});

router.post('/friends', async (req, res) => {
    try {
        const { me, you, status } = req.body;
        const promise = (status === 'add') ? insertFriend(me, you) : deleteFriend(me, you);

        promise
            .then(data => {
                if (data.length > 0)
                    res.status(200).json({
                        message: "Ok",
                        success: true
                    });
                else
                    res.status(200).json({
                        message: "No such friend",
                        success: false
                    })
            })
            .catch(() => {
                res.status(200).json({
                    message: "Ooops! Cannot update friend list. Try again",
                    success: false
                })
            })
    }
    catch (e) {
        res.status(200).json({
            message: "Ooops! Cannot update friend list. Try again",
            success: false
        })
    }
});

router.get('/friends/:me', function (req, res) {
    try {
        const { me } = req.params;

        getProfileFriends(me)
            .then(data => {
                res.status(200).json({
                    success: true,
                    result: data
                });
            })
            .catch(() => {
                res.status(200).json({
                    success: false,
                    message: "Ooops! Not found friends films"
                })
            })
    } catch (e) {
        res.status(200).json({
            success: false,
            message: "Ooops! Not found friends films"
        })
    }
});

router.get('/comments/:me', function (req, res) {
    try {
        const { me } = req.params;

        getProfileComments(me)
            .then(data => {
                res.status(200).json({
                    success: true,
                    result: data
                });
            })
            .catch(() => {
                res.status(200).json({
                    success: false,
                    message: "Ooops! Not found favorite films"
                })
            })
    } catch (e) {
        res.status(200).json({
            success: false,
            message: "Ooops! Not found favorite films"
        })
    }
});

router.get('/notifications/:me/:lang', async (req, res) => {
    const { me, lang } = req.params;

    let title = (lang === 'en') ? 'm.enTitle' : 'm.ruTitle',
        poster = (lang === 'en') ? 'm.enPoster' : 'm.ruPoster';

    getNotif(me, title, poster)
        .then(data => {
            res.status(200).json({
                data: data,
                success: true
            })
        })
        .catch(() => {
            res.status(200).json({
                message: "Can't find notifications",
                success: false
            })
        })
});

router.post('/notification/:me/:imdb/:quality', async (req, res) => {
    const { me, imdb, quality } = req.params;

    addNotif(me, imdb, quality)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch((e) => {
            res.status(200).json({
                message: "Can't add notification" + e.message,
                success: false
            })
        })
});

module.exports = router;