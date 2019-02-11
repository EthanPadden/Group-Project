var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util');

var childSchema = new Schema({
    child_fname: {type: String},
    child_lname: {type: String},
    dob: {type: String,default: "jan ,01, 2000"},
    fb_id: {type: String, default: null },
    parName:{type: String, default: null},
    par_id:{type: String, default: null}
});

module.exports = mongoose.model('Child', childSchema);