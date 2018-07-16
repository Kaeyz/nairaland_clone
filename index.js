// to read variables from file 'variable.ev'
require("dotenv").config({
  path: "variable.env"
});
// to require express
const express = require("express");
const app = express();
// allows put and delete to work on the route
const methodOverride = require("method-override");
// saves form input in 'req.body'
const bodyParser = require("body-parser");
// my database buddy
const mongoose = require("mongoose");
// to connect to the database
mongoose.connect(process.env.DATABASE).catch(err => {
  console.log(err);
});
// Create CommentSchema
let commentSchema = new mongoose.Schema({
  comment: String
})
 
// Create CommentModel
let Comment = mongoose.model("Comment", commentSchema);

// Create  PostSchema
let postSchema = new mongoose.Schema({
  title: String,
  post: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// Create PostModel
let Post = mongoose.model("Post", postSchema);

// link to our port saved in the env file
const port = process.env.PORT;

// makes all files in public folder visible globally
app.use(express.static("public"));

// initiates overide of POST to PUT or DELETE
app.use(methodOverride("_method"));

// this will set our templating engine
app.set("view engine", "ejs");

// initiate use of body parser
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// home route
app.get("/", (req, res) => {
  Post.find({}, function (err, posts) {
    if (err) {
      err;
    } else {
      posts;
      res.render("home", {
        posts
      });
    }
  });
});

// Route to create Post
app.get("/posts", (req, res) => {
  Post.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      console.log({
        posts
      });
      res.render("home", {
        posts
      });
    }
  });
});

app.get("/posts/new", (req, res) => {
  res.render("new");
});

app.post("/posts", (req, res) => {
  let {
    title,
    post
  } = req.body;
  console.log(title, post);
  Post.create({
      title,
      post
    },
    (err, newPost) => {
      if (err) {
        console.error(err);
      } else {
        console.log(newPost);

        res.redirect("/");
      }
    }
  );
});

// Route to find Post
app.get("/find", (req, res) => {
  res.render("find");
});

app.get("/posts/:id", (req, res) => {
 Post.findById(req.params.id).populate("comments").exec((err, post)=> {
   if(err){
     console.log(err);
   }else {
     res.render('show', {post:post})
   }
 })
});

// Route for Update posts
app.get("/post/:id/update", (req, res) => {
  Post.findById({
      _id: req.params.id
    },
    function (err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        console.log({
          foundPost
        });
        res.render("update", {
          post: foundPost
        });
      }
    }
  );
});

//route for update button
app.put("/update/:id", (req, res) => {
  let id = req.params.id
  let post = req.body.post;
  Post.findByIdAndUpdate(id, post, function (err, updatedPost) {
    if (err) {
      console.log(err)
    } else {
      console.log(updatedPost);
      res.redirect(`/posts/${id}`);

    }
  })
})

// Route for Post Delete
app.get("/delete", (req, res) => {
  res.render("delete");
});

app.post("/delete", (req, res) => {
  let {
    title
  } = req.body;
  Post.deleteOne({
      title
    },
    function (err) {
      if (err) return new Error("delete not successful");
      console.log("i was deleted");
      res.redirect("/");
    }
  );
});

app.delete("/post/:id", (req, res) => {
  let id = req.params.id;
  Post.findByIdAndRemove({
    _id: id
  }, function (err) {
    if (err) {
      console.log("delete not successful");
    } else {
      console.log("delete successful");
      res.redirect("/");
    }
  });
});
// comment route
app.post("/post/:id/comment/new", (req, res) =>{
  let id =  req.params.id;
  let comment = req.body.comment
   Comment.create({comment}, function(err, comment){
     if (err){ console.log(err);
     }else {
     Post.findOne({_id: id}, function(err, foundPost){
      if (err){
        console.log(err);
      } else {
        foundPost.comments.push(comment);
        foundPost.save(function (err, data){
          if (err){
            console.log(err);            
          } else {
            Post.findOne({_id: id}).populate("comment").exec(function(err, post){
              if (err){
                console.log(err);                
              }else {
                console.log(post);
                res.redirect(`/posts/${id}`);
              }
            })
          }
        })
      }
    })
  }
  })
})

app.listen(port, () => {
  console.log("listening on port 9000");
});