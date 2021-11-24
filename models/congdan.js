const mongoose = require('mongoose');
const congdanSchema = new mongoose.Schema({
    HoTen:      { type : String , required : true },
    NgaySinh:   { type : String , required : true },
    GioiTinh:   String,
    DiaChi:     String,
    SDT:        String,
    AddressNV:  String,
    CCCD:       { type : String , unique : true, required : true },
    Vaccine1:   {name : String,nguoitiem: String},
    Vaccine2:   {name : String,nguoitiem: String}
});
module.exports = mongoose.model('congdan',congdanSchema);
