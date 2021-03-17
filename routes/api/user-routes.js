const router = require("express").Router();
const { User } = require("../../models");

// GET /api/users
router.get("/", (req, res) => {
  User.findAll({
    attributes: {exclude: ['password']}
  })
    .then((dbUserInfo) => res.json(dbUserInfo))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// GET /api/users/1
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: {exclude: ['password']},
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserInfo) => {
      if (!dbUserInfo) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserInfo);
    })
    .catch((err) => res.status(500).json(err));
});

// POST /api/users
router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
    .then((dbUserInfo) => res.json(dbUserInfo))
    .catch((err) => {
      res.status(500).json(err);
    });
});

//Login
router.post("/login", (req,res) => {
  User.findOne({
    where:{
      username: req.body.username
    }
  })
  .then(dbUserData => {
    if(!dbUserData){
      res.status(400).json({message: 'No account present with that user name'});
      return;
    }
    
    const validPassword = dbUserData.checkPassword(req.body.password);

    if(!validPassword){
      res.status(400).json({message: 'Incorrect password!'});
      return;
    }

    res.json({user: dbUserData, message: 'You are now logged in!'});
  });
});

// PUT /api/users/1
router.put("/:id", (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserInfo) => {
      if (!dbUserInfo[0]) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserInfo);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserInfo) => {
      if (!dbUserInfo) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserInfo);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;