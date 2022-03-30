const { Post, Category } = require('../models');
const limit = 6;


const pageController = {
  index: async (req, res) => {
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
      res.render('index', {
        posts,
        totalPage,
        currentPage
      });
    } catch (err) {
      console.log(err);
    }
  },
  about: (req, res) => {
    res.render('about');
  },
  categories: async (req, res) => {
    try {
      // 撈出 N 個分類
      const categories = await Category.findAll({
        order: [
          ['createdAt', 'DESC']
        ],
        // 關聯的 Post 要再做一次 where 查詢
        include: [{
          model: Post,
          where: {
            isDeleted: 0
          }
        }]
      });
      console.log('result', JSON.stringify(categories, null, 4));
      res.render('categories', {
        categories,
      });
    } catch (err) {
      console.log(err);
    }
  },
  category: async (req, res) => {  
    let totalPage = null;
    let currentPage = 1;
    // queryString
    const query = Number(req.query.page);
    // 有值且大於 0 
    if (query && query > 0) {
      currentPage = query;
    }
    const offset = (currentPage-1) * limit;
    const name = req.params.name;
    if (!name) return res.redirect('/');

    try {
      // 算總頁數
      const count = await Category.count({
        where: { name },
        include: [{
          model: Post,
          where: { isDeleted: 0 },
        }]
      });
      if (count === 0) return res.redirect('/');
      const category = await Category.findOne({
        where: { name },
        include: [{
          model: Post,
          where: { isDeleted: 0 },
          separate : true,
          order: [['createdAt', 'DESC']],
          limit,
          offset
        }],
      });
      totalPage =  Math.ceil(count / limit);
      res.render('category', {
        category,
        totalPage,
        currentPage
      });
    } catch (err) {
      console.log(err);
    }
  },
  post: async (req, res) => {
    const id = req.params.id;
    try {
      const post = await Post.findOne({
        where: {
          id,
          isDeleted: 0
        },
        include: [Category]
      });
      if (!post) return res.redirect('/');
      res.render('post', {
        post
      })
    } catch (err) {
      // 執行錯誤
      req.flash('errorMessage', JSON.stringify(err));
      return next();
    }
  }

}

module.exports = pageController;