require('dotenv').config({
    path: 'variable.env'
})
const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE).catch(err => {
    console.log(err)
})

// Ccreate  Schema
let postSchema = new mongoose.Schema({
    title: String,
    post: String,
})

// Create Model
let Post = mongoose.model('Post', postSchema)

// CRUD
// Create
/* Post.create({
    title: 'gettting started with mongoose using express',
    post: 'A small blog post on  our nairaland clone' 
}).catch((err) => {
    console.log(err)
}).then((newPost) => {
    console.log({newPost})
}) */

// Read
// Post.find({}, function(err, posts) {
//     if (err) {console.log(err);
//     } else {console.log({posts});
//     }
// })

// Update
/* Post.update({title: 'gettting started with mongoose using express'}, {post: 'a new post 2'}, function(err, posts) {
    if (err) return new Error('update Error')
    console.log({posts})
}) */

// Delete
/* Post.deleteOne({post: 'a new post 2'}, function (err) {
    if (err) return new Error('delete not successful')
    console.log('i was deleted')
})
 */
const port = 9000;

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    Post.find({}, function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            console.log({
                posts
            });
            res.render('home', {
                posts
            })
        }
    })
})


// Route to create Post
app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    // let title = req.body.postTitle
    // let post = req.body.postBody
    // let newData = {
    //     title: title,
    //     post: post
    // }
    let {
        title,
        post
    } = req.body
    console.log(title, post);
    Post.create({
        title,
        post
    }, (err, newPost) => {
        if (err) {
            console.error(err)
        } else {
            console.log(newPost);

            res.redirect('/')
        }
    })
})

// Route to find Post
app.get('/find', (req, res) => {
    res.render('find')
})

app.post('/find', (req, res) => {
    let title = req.body.title
    Post.findOne({
        title: title
    }, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            console.log({
                post
            });
            res.render('show.ejs', {
                post: post
            })
        }
    })
})

// Route for Update posts
app.get('/update', (req, res) => {
    res.render('update')
})

app.post('/update', (req, res) => {
    let {
        title,
        post
    } = req.body
    Post.update({
        title
    }, {
        post
    }, function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            console.log({
                posts
            });
            res.render('home.ejs', {
                user: posts
            });
        }
    })
})

// Route for Post Delete
app.get('/delete', (req, res) => {
    res.render('delete')
})

app.post('/delete', (req, res) => {
    let {
        title
    } = req.body
    Post.deleteOne({
        title
    }, function (err) {
        if (err) return new Error('delete not successful')
        console.log('i was deleted')
        res.redirect('/')
    })
})

app.listen(port, () => {
    console.log('listening on port 9000');
})