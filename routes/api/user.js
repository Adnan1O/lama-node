const express = require('express');
const User = require('../../models/User');
const router = express.Router();

router.post('/login', async (req,res)=>{
    //here i could have used jason web token(jwt) to authenticate the user but that was not the part of the task so i kept it simple
    try {
        const {email} = req.body;
        if(!email){
            return res.status(500).json('please provide the email')
        }
        const userExsist = await User.find({email})
        if (userExsist) {
            return res.status(200).json(email)
        } else {
            const add = new User({
                email
            })
            await add.save()
            return res.status(200).json(email)
        }
    } catch (error) {
        res.status(500).json(error.message)
        console.error(error.message)
    }
})


router.post('/updateUserName', async (req, res) => {
    const {  userName, email } = req.body;
  
    try {
        const updateUser = await User.findOneAndUpdate(
            { email: email },
            { userName: userName },
            { new: true, upsert: true }
        );
      res.status(200).json(userName);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  });

  router.get('/getUserName/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email: email });
        if(!user){
          return  res.status(404).send('User not found');
        }
            if (user.userName) {
                console.log(user.userName)
                const userName = user.userName
                return res.status(200).json({userName});
            } else{
                return res.status(200).json({});
            }
     
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;