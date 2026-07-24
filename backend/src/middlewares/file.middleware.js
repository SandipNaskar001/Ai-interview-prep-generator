const multer=require("multer")

const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:3*1024*1024 //means 3mb
    }
})


module.exports=upload