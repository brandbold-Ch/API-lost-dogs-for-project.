const Collab = require('../models/collaborator');
const Auth = require('../models/auth');
const Request = require('../models/requests');

class CollabServices {

    constructor() {}

    async create(data) {

        const { name, email, password, address, identifier } = data;

        const collab = new Collab({
            name,
            address,
            identifier
        });

        const auth = new Auth({ email, password, user: collab['_id'], role: 'COLLABORATOR' });
        const request = new Request({ role: 'COLLABORATOR', user: collab['_id']});

        await auth.save();
        await collab.save();
        await request.save();
    }

    async getCollab(id) {
        return Collab.findById(id, { __v: 0 });
    }
}

module.exports = CollabServices;
