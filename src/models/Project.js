var mongoose = require('mongoose');
Schema = mongoose.Schema;
var ProjectSchema = new Schema({
    title:String,
    info:String,
    positionsRequired: {
        programmer: {
            type:Number,
            min:0,
            max:100
        },
        designer: {
            type:Number,
            min:0,
            max:100
        },
        marketingManager: {
            type:Number,
            min:0,
            max:100
        },
        qualityAssurance: {
            type:Number,
            min:0,
            max:100
        },
        teamLeader: {
            type:Number,
            min:0,
            max:100
        },
        businessAnalyst: {
            type:Number,
            min:0,
            max:100
        },
        other: {
            type:Number,
            min:0,
            max:100
        }
    },
    skills: String,
    createdOn: {
        type:Date,
        default:Date.now
    },
    poster: {
        id: String,
        firstName: String,
        lastName: String,
        imageURL: String
    },
    members:[{
        id: String,
        firstName: String,
        lastName: String,
        imageURL: String
    }],
    applicants: [{
        id: String,
        firstName: String,
        lastName: String,
        imageURL: String
    }],
    todo: [{
        body: String,
        id: Schema.Types.ObjectId,
        postedBy: String
    }],
    doing: [{
        body: String,
        id: Schema.Types.ObjectId,
        postedBy: String,
        takenBy: String,
        takenById: String,
        progress: {
            type: Number,
            default: 0
        }
    }],
    done: [{
        body: String,
        id: Schema.Types.ObjectId,
        postedBy: String,
        takenBy: String
    }]
});

ProjectSchema.index({title:'text', info:'text', skills:'text'});

module.exports = mongoose.model('Project', ProjectSchema);
