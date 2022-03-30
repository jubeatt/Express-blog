const { User } = require('../models');
const bcrypt = require('bcrypt');

const userController = {
  login: (req, res) => {
    res.render('login');
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  },
  handleLogin: async (req, res, next) => {
    const { username, password } = req.body;
    // 沒填完整
    if (!username || !password) {
      req.flash('errorMessage', '請填滿所有欄位哦！');
      return next();
    }
    // 撈資料
    try {
      const user = await User.findOne({
        where: {
          username
        }
      });
      // 找不到 user
      if (!user) {
        req.flash('errorMessage', '帳號或密碼錯誤');
        return next();
      }
      const result = await bcrypt.compare(password, user.password)
      // 登入失敗
      if (!result) {
        req.flash('errorMessage', '帳號或密碼錯誤');
        return next();
      }
      // 登入成功
      req.session.username = username;
      res.redirect('/');
    } catch (err) {
      // 執行錯誤
      req.flash('errorMessage', JSON.stringify(err));
      return next();
    }
    
  }
}
module.exports = userController;
