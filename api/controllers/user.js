const db = require('../../models/user.js');
const session = require('../../models/session.js')

function signupUser(req, res) {
    return new Promise(async () => {
        let user = req.swagger.params['user'].value;
        let newUser = await db.user.findOne({ "user.email": user.email });
                if (newUser) {
                    return res.status(400).json({ Error: "User already exists!" });
                } else {
                    user.id = await db.user.count() + 1;
                    user.queue = [];
                    await db.user.insertMany({ user });
                }
        if (user.queue) {
            user.password = '*****';
            return res.status(201).json(user);
        } else {
            return res.status(400).json({ Error: "User already exists!" });
        }
    });
};

function loginUser(req, res) {
    return new Promise(async () => {
        const credentials = req.swagger.params['credentials'].value;
        const user = await db.user.findOne({ "user.userName": credentials.userName });
        if (user != null) {
            if (user.user.password === credentials.password) {
                let sessionId = await Math.floor(100000 + Math.random() * 900000);
                await session.session.insertMany({ "id": sessionId, "userId": user.user.id });
                if (sessionId) {
                    return res.status(200).json(sessionId);
                } else {
                    return res.status(400).send({ Error: "Something went wrong!" });
                }
            } else {
                return res.status(400).send({ Error: "Invalid username or password!2" });
            }
        } else {
            return res.status(400).send({ Error: "Invalid username or password!3" });
        }
    });
};

function logout(req, res) {
    return new Promise(async () => {
        let xSessionID = req.swagger.params['X-Session-ID'].value;
        let sessionId = Number(xSessionID);
        console.log('dfs')
        await session.session.deleteOne({ "id": sessionId }).then((result) => { //vagy deleteMany
            console.log(result)
            if (result) {
                console.log(result)
                return res.status(200);
            } else {
                return res.status(400).send({ Error: "Already logged out." });
            }
        });
    });
};

module.exports = {
    signupUser: signupUser,
    loginUser: loginUser,
    logout: logout
}
