var express = require('express');
var router = express.Router();


const newPost = (req, res) => {
  if (req.session.userId) {
    return res.render('create', {
      createPost: true
    })
  }
  res.redirect('/auth/login')
}

const storePost = async (req, res) => {
  let image = req.files.image
  image.mv(path.resolve(__dirname, '..', 'public/img', image.name),
    async (error) => {
      await BlogPost.create({
        ...req.body,
        image: '/img/' + image.name,
        userid: req.session.userId
      })
      res.redirect('/')
    })

}

const newUser = (req, res) => {

  var username = ""
  var password = ""
  const data = req.flash('data')[0]

  if (typeof data != "undefined") {
    username = data.username
    password = data.password
  }

  res.render('register', {
    //errors: req.session.validationErrors
    errors: req.flash('validationErrors'),
    username: username,
    password: password
  })
}


//Get all Method


//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    res.json(data)
  } catch (error) {
    res.status(404).json({ success: false, message: `No such user. ` + error.message });
  }
})
router.get("/users/:username", function (req, res, next) {
  User.findOne({
    username: req.params.username
  }, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(404);
    }
    res.render("profile", {
      user: user
    });
  });
});

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = {
      new: true
    };

    const result = await Model.findByIdAndUpdate(
      id, updatedData, options
    )

    res.send(result)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id)
    res.send(`Document with ${data.name} has been deleted..`)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

module.exports = router;
router.post('/post', async (req, res) => {
  const data = new Model({
    name: req.body.name,
    age: req.body.age
  })
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

const storeUser = async (req, res) => {
  User.create(req.body, (error, user) => {
    if (error) {
      const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
      req.flash('validationErrors', validationErrors)
      req.flash('data', req.body)
      return res.redirect('/auth/register')
    }
    res.redirect('/')
  })
}

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});
router.get("/", function (req, res, next) {
  User.find()
    .sort({
      createdAt: "descending"
    })
    .exec(function (err, users) {
      if (err) {
        return next(err);
      }
      res.render("index", {
        users: users
      });
    });
});