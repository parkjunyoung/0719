import express from 'express';
import models from '../models';
import request from 'request';
import cheerio from 'cheerio';
import removeEmpty from '../libs/removeEmpty';
const router = express.Router();

router.post('/complete', (req,res)=>{
    models.Checkout.create({
        imp_uid : req.body.imp_uid,
        merchant_uid : req.body.merchant_uid,
        paid_amount : req.body.paid_amount,
        apply_num : req.body.apply_num,
        
        buyer_email : req.body.buyer_email,
        buyer_name : req.body.buyer_name,
        buyer_tel : req.body.buyer_tel,
        buyer_addr : req.body.buyer_addr,
        buyer_postcode : req.body.buyer_postcode,
        
        cart_list : req.body.cart_list,
        status : req.body.status,

    }).then(function() {
        res.json({ message : "success" });
    });
});


router.post('/mobile_complete', (req,res)=>{
    models.Checkout.create({
        imp_uid : req.body.imp_uid,
        merchant_uid : req.body.merchant_uid,
        paid_amount : req.body.paid_amount,
        apply_num : req.body.apply_num,
        
        buyer_email : req.body.buyer_email,
        buyer_name : req.body.buyer_name,
        buyer_tel : req.body.buyer_tel,
        buyer_addr : req.body.buyer_addr,
        buyer_postcode : req.body.buyer_postcode,

        cart_list : req.body.cart_list,
        status : req.body.status,

    }).then(function() {
        res.redirect('/');
    });
});

router.get('/order', (req,res)=>{
    models.Checkout.findAll({

    }).then(function(orderList) {
        res.json({ orderList : orderList });
    });
});

router.get('/order/:id', (req,res)=>{
    models.Checkout.findById(req.params.id).then( (order) => {
        res.json({ order : order });
    });
});

router.put('/order/:id', (req,res)=>{
    models.Checkout.update(
        {
            status : req.body.status,
            song_jang : req.body.song_jang,
        }, 
        { 
            where : { id: req.params.id } 
        }
    ).then(function() {
        res.json({ message : "success" });
    });
});

router.get('/shipping/:invc_no', (req,res)=>{

    var url = "https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=" + req.params.invc_no ;
    var result = [];
    request(url, (error, response, body) => {  
        //한글 변환
        var $ = cheerio.load(body, { decodeEntities: false });

        var tdElements = $(".board_area").find("table.mb15 tbody tr td");
        
        for( var i=0 ; i<tdElements.length ; i++ ){
            
            if(i%4===0){
                var temp = {};
                temp["step"] = removeEmpty(tdElements[i].children[0].data);
            }else if(i%4===1){
                temp["date"] = tdElements[i].children[0].data;
            }else if(i%4===2){
                
                temp["status"] = tdElements[i].children[0].data;
                if(tdElements[i].children.length>1){
                    temp["status"] += tdElements[i].children[2].data;
                }

            }else if(i%4===3){
                temp["location"] = tdElements[i].children[1].children[0].data;
                result.push(temp);
                temp = {};
            }
        }

        //res.json(tableElements[0].children);
        res.json(result);
    });
});

export default router;