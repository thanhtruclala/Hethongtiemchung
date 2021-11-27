var congdan = require('../models/congdan');
module.exports = function(app)
{
    app.get('/', function(req,res){
        res.render('layout.ejs');
    });
    app.post('/dangky', function(req,res)
    {
        if (!req.body.HoTen || !req.body.NgaySinh || !req.body.GioiTinh || !req.body.DiaChi || !req.body.SDT || !req.body.CCCD){
            res.json({status: 'error', message:"Thiếu tham số hoặc sai định dạng!"})}
        else {
            var congdanmoi = new congdan({
                HoTen:req.body.HoTen,
                NgaySinh:req.body.NgaySinh,
                GioiTinh:req.body.GioiTinh,
                DiaChi:req.body.DiaChi,
                SDT:req.body.SDT,
                CCCD:req.body.CCCD,
                Vaccine1: {name: "Chưa chích", nguoitiem: ""},
                Vaccine2: {name: "Chưa chích", nguoitiem: ""},
                AddressNV: ""
            });
            congdanmoi.save(function(err){
                if (err){
                    res.json({status: 'error-insert', message:"Lưu thất bại!"});
                } else {
                    res.json({status: 'success', message:"Lưu thành công!"});                    
                }
            })
        }
    });
    app.post('/search',function(req,res)
    {
        if (!req.body.CCCD){
            res.json({status: 'error', message: "Chưa nhập CCCD!"})}
        else {
            const mongoose = require('mongoose');
            mongoose.connect('mongodb+srv://nienluan1:dNXSPapLVUa8iVsv@clusterstudy.a5alv.mongodb.net/nienluan?retryWrites=true&w=majority', { useNewUrlParser: true })
            const findUser = async() => {
                try {
                    const obj = await congdan.findOne({CCCD: req.body.CCCD});
                    res.json({obj});
                }
                catch(err)
                {
                    console.log(err);
                }
            }
            findUser();
        }
    });
    app.post('/searchNV',function(req,res)
    {
        if (!req.body.AddressNV){
            res.json({status: 'error', message: "Chưa nhập địa chỉ người tiêm!"})}
        else {
            const mongoose = require('mongoose');
            mongoose.connect('mongodb+srv://nienluan1:dNXSPapLVUa8iVsv@clusterstudy.a5alv.mongodb.net/nienluan?retryWrites=true&w=majority', { useNewUrlParser: true })
            const findUser = async() => {
                try {
                    const obj = await congdan.findOne({AddressNV: req.body.AddressNV});
                    console.log(obj);
                    const ngtiem = obj?.HoTen
                    res.send(ngtiem);
                }
                catch(err)
                {
                    console.log(err);
                }
            }
            findUser();
        }
    });
    app.post('/tiemvaccine',function(req,res)
    {
        if (!req.body.CCCD){
            res.json({status: 'error', message: "Chưa nhập CCCD!"})}
        else {
            const mongoose = require('mongoose');
            mongoose.connect('mongodb+srv://nienluan1:dNXSPapLVUa8iVsv@clusterstudy.a5alv.mongodb.net/nienluan?retryWrites=true&w=majority', { useNewUrlParser: true })
            const findUser = async() => {
                try {
                    const obj = await congdan.findOne({CCCD: req.body.CCCD});
                    if (obj) {
                        res.json({status: 'success-to-sent',obj,Vaccine: req.body.Vaccine});
                    }
                    else {
                        res.json({status: 'error-find'})
                    }
                }
                catch(err)
                {
                    console.log(err);
                }
            }
            findUser();
        }
    });
    app.post('/update',function(req, res)
    {
        const mongoose = require('mongoose');
            mongoose.connect('mongodb+srv://nienluan1:dNXSPapLVUa8iVsv@clusterstudy.a5alv.mongodb.net/nienluan?retryWrites=true&w=majority', { useNewUrlParser: true })
            const findUser = async() => {
                try {
                    const obj = await congdan.findOne({CCCD: req.body.CCCD});
                    if (obj.Vaccine1.name == "Chưa chích"){
                        await congdan.findOneAndUpdate({CCCD: obj.CCCD},{Vaccine1: {name:req.body.Vaccine, nguoitiem:req.body.User}})
                    }
                    else{
                        await congdan.findOneAndUpdate({CCCD: obj.CCCD},{Vaccine2: {name:req.body.Vaccine, nguoitiem:req.body.User}})
                    }
                    res.json({status: 'success',obj,Vaccine: {name:req.body.Vaccine, nguoitiem:req.body.User}});
                }
                catch(err)
                {
                    console.log(err);
                }
            }
            findUser();
    });

}