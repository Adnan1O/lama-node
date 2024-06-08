const express = require('express');
const Chatbot = require('../../models/Chatbot');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
});

router.post('/chatbotconfig', upload.single('image'), async (req, res) => {
    const {
        project,name,welcomeMessage,inputPlaceholder,primaryColor,fontColor,fontSize,chatHeight,showSources,iconSize,iconPosition,distanceFromBottom,horizontalDistance
    } = req.body;
    console.log(project,name,welcomeMessage,inputPlaceholder,primaryColor,fontColor,fontSize,chatHeight,showSources,iconSize,iconPosition,distanceFromBottom,horizontalDistance)
    try {
        if (!project) {
            return res.status(400).json('Please provide the project ID');
        }
        let chatbot = await Chatbot.findOne({ project });
        if (chatbot) {
            if (name !== undefined) chatbot.name = name;
            if (welcomeMessage !== undefined) chatbot.welcomeMessage = welcomeMessage;
            if (inputPlaceholder !== undefined) chatbot.inputPlaceholder = inputPlaceholder;
            if (primaryColor !== undefined) chatbot.primaryColor = primaryColor;
            if (fontColor !== undefined) chatbot.fontColor = fontColor;
            if (fontSize !== undefined) chatbot.fontSize = fontSize;
            if (chatHeight !== undefined) chatbot.chatHeight = chatHeight;
            if (showSources !== undefined) chatbot.showSources = showSources;
            if (iconSize !== undefined) chatbot.iconSize = iconSize;
            if (iconPosition !== undefined) chatbot.iconPosition = iconPosition;
            if (distanceFromBottom !== undefined) chatbot.distanceFromBottom = distanceFromBottom;
            if (horizontalDistance !== undefined) chatbot.horizontalDistance = horizontalDistance;
            if (imageUrl !== undefined) chatbot.image = imageUrl;
        } else {
            chatbot = new Chatbot({
                project,
                name,
                welcomeMessage,
                inputPlaceholder,
                primaryColor,
                fontColor,
                fontSize,
                chatHeight,
                showSources,
                iconSize,
                iconPosition,
                distanceFromBottom,
                horizontalDistance,
            });
        }

        await chatbot.save();
        res.status(200).json(chatbot);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error.message);
    }
});


router.post('/uploadImage', upload.single('image'), async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const s3 = new AWS.S3();
        const params = {
            Bucket: "lama-pics",
            Key: `bot/${Date.now()}_${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };
        const s3Response = await s3.upload(params).promise();
        const imageUrl = s3Response.Location;
        res.status(200).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('Image upload error:', error.message);
    }
});



router.get('/checkvalues/:id', async (req,res)=>{
    try {
            const {id} = req.params
            const findDetails = await Chatbot.findOne({project:id})
            if(!findDetails){
                return  res.status(400).json('no data found')
            }
            console.log(findDetails)
            res.status(200).json(findDetails)  
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error.message);
    }
})


module.exports = router;