const mongoose = require('data/mongoose');
const Schema = mongoose.Schema;

let Counters = new Schema({
    _id: {type: String},
    sequence_value: {type: Number}
});

let Counter = mongoose.model('Counter', Counters);

module.exports = function count(sequenceName) {
    let sequenceDoc = Counter.findAndModify({
        query: {_id: sequenceName},
        update:{$inc:{sequence_value:1}},
        new: true
    });
    return sequenceDoc.sequence_value;
};