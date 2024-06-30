const { baseUserModel } = require("./baseUser");
const mongoose = require("mongoose");
const { Schema } = mongoose;


const associationModel = new Schema({
    ...baseUserModel.obj,
    image: {
        type: Object,
        required: false,
        default: null
    },
    description: {
        type: String,
        required: false,
        default: null
    },
    bulletins_id: [{
        type: Schema.Types.ObjectId,
        ref: "Bulletin"
    }],
    blogs_id: [{
        type: Schema.Types.ObjectId,
        ref: "Blog"
    }],
    rescuers_id: [{
        type: Schema.Types.ObjectId,
        ref: "Rescuer"
    }]
}, {
    versionKey: false
});

associationModel.index({ name: 1 }, { unique: true })
const Association = mongoose.model("Association", associationModel);
module.exports = { Association }
