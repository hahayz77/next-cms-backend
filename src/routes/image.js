const express = require("express");
const router = express.Router();
const upload = require('../multer');
const client = require('../s3');
const Image = require('../models/Image');
const { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


router.get('/all/', async (req, res) => {
    let imageDB = await Image.find({});
    
    for(i in imageDB){
        let url = await getSignedUrl(client, new GetObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: imageDB[i].key }), { expiresIn: 60 });
        imageDB[i].url = url;
    }
    // console.log(imagesDB);
    res.send(imageDB);
});


router.post('/', upload.single('file'), async (req,res) => {
    // console.log(req.file);
    const key = `${Date.now()}-${req.file.originalname}`;
    const params = {
        Bucket: process.env.BUCKET_NAME,
        ContentType: req.file.mimetype,
        Body: req.file.buffer,
        Key: key
    };    
    const imageToDB = await new Image({ 
        name: req.file.originalname, 
        key: key, 
        mimetype: req.file.mimetype,
        size: req.file.size
    }).save();
    // console.log(imageToDB);

    const command = new PutObjectCommand(params);
    await client.send(command);

    res.send(key);
});

router.delete('/:id', async(req, res)=>{
    const imgFromDB = await Image.findOne({ _id: req.params.id });
    if(imgFromDB){
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: imgFromDB.key
        }; 
        const command = new DeleteObjectCommand(params);
        await client.send(command);
        const imageFromDB = await Image.deleteOne({ _id: req.params.id });
        
        res.send(imageFromDB);
    }else {
        res.status(500).send("Image not found!");
    }

});

module.exports = router;