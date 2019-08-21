const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        id: 'Number',
        userName: 'String',
        password: 'String',
        email: 'String',
        queue: 'Array'
    }
});

let user = mongoose.model('user', userSchema);

module.exports = {
    user
}
