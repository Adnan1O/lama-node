const express = require('express');
const Project = require('../../models/Project');
const router = express.Router();


router.post('/createproject', async (req,res)=>{
    try {
        const {user, title} = req.body
        console.log(user,title)
        if(!user || !title){
            return res.status(500).json("please provide the details")
        }
        const add = new Project({
            user, title
        })
        await add.save()
        res.status(200).json("project created!")
    } catch (error) {
        console.error(error.message);
        return res.status(500).json("something went wrong")
    }
})

router.get('/getProject', async (req,res)=>{
    try {
        const user  = req.query.user;
        console.log(user)
        const projects = await Project.find({user:user})
        console.log(projects)
        res.status(200).json(projects)
    } catch (error) {
        console.error(error.message);
        return res.status(500).json("something went wrong")
    }
})

router.get('/getProjectById/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id)
      const project = await Project.findById(id);
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Something went wrong");
    }
  });
  
  router.post('/UploadData', async (req, res) => {
    const { projectId, tabName, fileName, description } = req.body;
    console.log(projectId, tabName, fileName, description)
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const newFile = {
            tabName,
            fileName,
            description
        };

        project.files.push(newFile);
        await project.save();

        res.status(200).json({ message: 'File added successfully', project });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
});


router.get('/getProjectFiles/:id', async (req,res)=>{
    try {
        const { id } = req.params;
        console.log(id)
        const project = await Project.findById(id)
        if (!project) {
           return res.status(404).json('project not found')
        }
        const files = project.files.map(file => ({
            ...file.toObject(),
            dateAdded: new Date(file.dateAdded).toLocaleString() 
        }));
        if (!project) {
            return res.status(404).json('no file uploaded yet')
         }
         const reversedFiles = files.reverse();
         res.status(200).json(reversedFiles)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
})

router.delete('/deleteFile/:projectId/:id', async (req,res)=>{
    try {
        const projectId = req.params.projectId;
        const id = req.params.id
        const project = await Project.findById(projectId);
      
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const fileIndex = project.files.findIndex(file => file.id === id);
        if (fileIndex === -1) {
          return res.status(404).json({ message: 'File not found in the project' });
        }
    
        project.files.splice(fileIndex, 1); 
        await project.save();
    
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
})


router.get('/GetTranscript/:projectId/:fileId', async (req, res) => {
    try {
        const { projectId, fileId } = req.params;
        console.log('projectId:', projectId, 'fileId:', fileId);
        
        const project = await Project.findById(fileId);
        console.log(project)
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const file = project.files.find(file => file._id.toString() === projectId);
        console.log(file)
        if (!file) {
            console.log("File not found");
            return res.status(404).json({ message: 'File not found' });
        }

        res.status(200).json(file);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/updateScript', async (req, res) => {
    try {
        const { projectId, fileId, script } = req.body;
        console.log( projectId, fileId, script)
        const project = await Project.findById(fileId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const file = project.files.find(file => file._id.toString() === projectId);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        console.log(file)
        file.description = script;
        await project.save();
        res.status(200).json({ message: 'Script updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;