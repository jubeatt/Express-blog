const { Post, Category } = require('../models');

const adminController = {
  console: (req, res) => {
    if (!req.session.username) return res.redirect('/');
    res.render('admin');
  },
  posts: async (req, res) => {
    if (!req.session.username) return res.redirect('/');
    const limit = 6;
    let totalPage = null;
    let currentPage = 1;
    // queryString
    const query = Number(req.query.page);
    // 有值且大於 0 
    if (query && query > 0) {
      currentPage = query;
    }
    const offset = (currentPage-1) * limit;
    try {
      // 算總頁數
      const count = await Post.count({
        where: {
          isDeleted: 0
        }
      });
      totalPage =  Math.ceil(count / limit);
    } catch (err) {
      console.log(err);
    }
    try {
      // 撈出 N 個文章
      const posts = await Post.findAll({
        where: {
          isDeleted: 0
        },
        order: [
          ['createdAt', 'DESC']
        ],
        limit,
        offset
      });
      res.render('adminPosts', {
        posts,
        totalPage,
        currentPage
      });
    } catch (err) {
      console.log(err);
    }
  },
  addPost: async (req, res) => {
    if (!req.session.username) return res.redirect('/');
    try {
      const categories = await Category.findAll();
      res.render('addPost', {
        categories
      });
    } catch (err) {
      console.log(err);
    }
  },
  updatePost: async (req, res) => {
    const id = req.query.id;
    if (!req.session.username || !id) return res.redirect('/');
    const categories = await Category.findAll();
    const post = await Post.findOne({
      where: {
        id,
        isDeleted: 0
      }
    })
    if (!post) return res.redirect('/');
    res.render('updatePost', {
      post,
      categories
    });
  },
  deletePost: async (req, res) => {
    const id = req.body.id;
    if (!req.session.username || !id) return res.redirect('/');
    await Post.update({ isDeleted: 1 }, {
      where: {
        id
      }
    })
    res.redirect('/admin/posts');
  },
  handleAddPost: async (req, res, next) => {
    if (!req.session.username) return res.redirect('/');
    const { category, title, preview, content } = req.body
    if (!category || !title || !preview || !content) {
      req.flash('errorMessage', '不可以填空的啦');
      return next();
    }
    try {
      await Post.create({
        CategoryId: category,
        title,
        preview,
        content
      })
      res.redirect('/admin/posts');
    } catch(err) {
      // 執行錯誤
      req.flash('errorMessage', JSON.stringify(err));
      return next();
    }
  },
  handleUpdatePost: async (req, res, next) => {
    if (!req.session.username) return res.redirect('/');
    const { id, category, title, preview, content } = req.body;
    if (!id) return res.redirect('/');
    if (!category || !title || !preview || !content) {
      req.flash('errorMessage', '不可以填空的啦');
      return next();
    }
    try {
      await Post.update({
        CategoryId: category,
        title,
        preview,
        content
      }, {
        where: {
          id
        }
      });
      res.redirect('/admin/posts');
    } catch(err) {
      // 執行錯誤
      req.flash('errorMessage', JSON.stringify(err));
      return next();
    }
  },
  categories: async (req, res) => {
    if (!req.session.username) return res.redirect('/');
    const limit = 6;
    let totalPage = null;
    let currentPage = 1;
    // queryString
    const query = Number(req.query.page);
    // 有值且大於 0 
    if (query && query > 0) {
      currentPage = query;
    }
    const offset = (currentPage-1) * limit;
    try {
      // 算總頁數
      const count = await Category.count();
      totalPage =  Math.ceil(count / limit);
    } catch (err) {
      console.log(err);
    }
    try {
      // 撈出 N 個文章
      const categories = await Category.findAll({
        order: [
          ['createdAt', 'DESC']
        ],
        limit,
        offset
      });
      res.render('adminCategories', {
        categories,
        totalPage,
        currentPage
      });
    } catch (err) {
      console.log(err);
    }
  },
  addCategory: (req, res) => {
    if (!req.session.username) return res.redirect('/');
    res.render('addCategory');
  },
  updateCategory: async (req, res) => {
    const id = req.query.id;
    if (!req.session.username || !id) return res.redirect('/');
    const category = await Category.findOne({
      where: { id }
    });
    if (!category) return res.redirect('/');
    res.render('updateCategory', {
      category
    });
  },
  deleteCategory: async (req, res) => {
    const id = req.body.id;
    if (!req.session.username || !id) return res.redirect('/');
    await Category.destroy({
      where: {
        id
      }
    });
    res.redirect('/admin/categories');
  },
  handleAddCategory: async (req, res, next) => {
    if (!req.session.username) return res.redirect('/');
    const { name } = req.body
    if (!name) {
      req.flash('errorMessage', '不可以填空的啦');
      return next();
    }
    try {
      await Category.create({ name });
      res.redirect('/admin/categories');
    } catch(err) {
      // 執行錯誤
      req.flash('errorMessage', JSON.stringify(err));
      return next();
    }
  },
  handleUpdateCategory: async (req, res, next) => {
    if (!req.session.username) return res.redirect('/');
    const { id, name } = req.body;
    if (!id) return res.redirect('/');
    if (!name) {
      req.flash('errorMessage', '不可以填空的啦');
      return next();
    }
    try {
      await Category.update({ name }, {
        where: { id }
      });
      res.redirect('/admin/categories');
    } catch(err) {
      // 執行錯誤
      req.flash('errorMessage', JSON.stringify(err));
      return next();
    }
  }
}
module.exports = adminController;