var express = require('express');
var router = express.Router();
var adminController = require("../controllers/admin.js");


router.use((req,res,next)=>{
    console.log(req.session.username,req.session.isAdmin)
    if(req.session.username && req.session.isAdmin){
        next();
    }else{
        res.send({
            msg:"没有管理权限",
            status:-1
        })
    }
})
/* GET users listing. */
router.get('/', adminController.index);

router.get('/usersList', adminController.usersList);

router.post('/updateFreeze', adminController.updateFreeze);

router.post('/deleteUser', adminController.deleteUser);


module.exports = router;
