
const crypto = require('crypto')


// @Inject
exports.hash = (key)=>{
    const algorithm = "sha256"
    const digest = crypto.createHash(algorithm).update(key).digest("hex") 
    // console.log(digest)
    return(digest)
}

