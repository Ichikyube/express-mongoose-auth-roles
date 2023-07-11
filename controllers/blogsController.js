const BlogPost = require('../models/BlogPost.js')


module.exports = async (req, res) => {
    const blogposts = await BlogPost.find({}).populate('userid');
    console.log(req.session)
    res.render('index', {
        blogposts
    });
}

module.exports = async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id).populate('userid');
    console.log(blogpost)
    res.render('post', {
        blogpost
    });
}
module.exports = (req,res,next) =>{
    if(req.files == null || req.body.title == null){
        return res.redirect('/posts/new')
    }
    next()
}
module.exports = (req, res) => {
    let image = req.files.image;
    image.mv(path.resolve(__dirname, '..', 'public/img', image.name), async (error) => {
        await BlogPost.create({
            ...req.body,
            image: '/img/' + image.name,
            userid: req.session.userId
        })
        res.redirect('/')
    })
}
