const db = require('../../models/user.js');
const session = require('../../models/session.js')
const video = require('../../models/video.js')

function searchVideo(req, res) {
    return new Promise(async () => {
        const title = req.swagger.params['title'].value;
        let movieArray = await video.video.find({ "title": title });
        console.log(movieArray);
        if (movieArray) {
            return res.status(200).send(movieArray);
        } else {
            return res.status(400).send({ Error: "Movie title cant find!" });
        }
    });
};

function downloadVideo(req, res) {
    return new Promise(async () => {
        const id = req.swagger.params['id'].value;
        const xSessionID = req.swagger.params['X-Session-ID'].value;
        let sessionId = Number(xSessionID);
        let currentSession = await session.session.findOne({ "id": sessionId });
        console.log(currentSession)
        let movie = await video.video.findOne({ "id": Number(id) });
        console.log(movie)
        if (movie) {
            let currentUser = await db.user.findOne({ "user.id": Number(currentSession.userId) });
            console.log(currentUser)
            let movieArray = currentUser.user.queue;
            console.log(movieArray)
            if (movieArray.includes(movie.id)) {
                res.status(400).send({ Error: "Movie already in the queue!1" });
                console.log('err')
            } else {
                await movieArray.push(Number(movie.id));
                await db.user.updateOne(
                    { "user.id": Number(currentUser.user.id) },
                    {
                        $set: { "user.queue": movieArray }
                    });
                return res.status(200).json(movie);
            }
        } else {
            return res.status(400).send({ Error: "Movie not exists." });
        }
        return res.status(400).send({ Error: "Unauthorized" });
    });
};

function listDownloaded(req, res) {
    return new Promise(async () => {
        const xSessionID = req.swagger.params['X-Session-ID'].value;
        const sessionId = Number(xSessionID);
        let usersSession = session.session.findOne({ "id": sessionId });
        console.log(usersSession);
        if (usersSession != null) {
            let user = await db.user.findOne({ "user.id": usersSession.userId });
            console.log(user.user.queue);
            if (user.user.queue) {
                return res.status(200).json(user.user.queue);
            } else {
                return res.status(400).send({ Error: "Users queue cant find1!" });
            }
        } else {
            return res.status(400).send({ Error: "Unauthorized" });
        }
    });
};

module.exports = {
    searchVideo,
    downloadVideo,
    listDownloaded
}
