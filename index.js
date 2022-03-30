const express = require('express');
const port = process.env.PORT || 3000;
const flash = require('connect-flash');
const session = require('express-session');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const pageController = require('./controllers/pageController');

const app = express();


app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
app.use(flash());
app.use((req, res, next) => {
  res.locals.username = req.session.username;
  res.locals.errorMessage = req.flash('errorMessage');
  next();
})

const toPreviousPage = (req, res) => {
  return res.redirect('back');
}



app.get('/', pageController.index);
app.get('/posts/:id', pageController.post);
app.get('/about', pageController.about);
app.get('/categories', pageController.categories);
app.get('/categories/:name', pageController.category);

app.get('/login', userController.login);
app.get('/logout', userController.logout);
app.post('/login', userController.handleLogin, toPreviousPage);

app.get('/admin', adminController.console);

app.get('/admin/posts', adminController.posts);
app.get('/admin/update_post', adminController.updatePost);
app.post('/admin/update_post', adminController.handleUpdatePost, toPreviousPage);
app.get('/admin/add_post', adminController.addPost);
app.post('/admin/add_post', adminController.handleAddPost, toPreviousPage);
app.post('/admin/delete_post', adminController.deletePost);

app.get('/admin/categories', adminController.categories);
app.get('/admin/add_category', adminController.addCategory);
app.post('/admin/add_category', adminController.handleAddCategory, toPreviousPage);
app.get('/admin/update_category', adminController.updateCategory);
app.post('/admin/update_category', adminController.handleUpdateCategory, toPreviousPage);
app.post('/admin/delete_category', adminController.deleteCategory);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
