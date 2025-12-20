/**
 * 认证控制器
 * 处理用户认证相关功能
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 模拟用户数据库
const users = [
  {
    id: 1,
    username: 'analyst',
    email: 'analyst@example.com',
    password: '$2a$10$8K1p/aW.0n0U0X0Y0Z0W8O4L1N2P3Q5R6S7T9U0V1W2X3Y4Z5', // "password123" 的哈希
    role: 'analyst',
    name: '产业分析师'
  },
  {
    id: 2,
    username: 'operator',
    email: 'operator@example.com',
    password: '$2a$10$8K1p/aW.0n0U0X0Y0Z0W8O4L1N2P3Q5R6S7T9U0V1W2X3Y4Z5', // "password123" 的哈希
    role: 'operator',
    name: '运营人员'
  },
  {
    id: 3,
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$8K1p/aW.0n0U0X0Y0Z0W8O4L1N2P3Q5R6S7T9U0V1W2X3Y4Z5', // "password123" 的哈希
    role: 'admin',
    name: '系统管理员'
  }
];

class AuthController {
  // 登录
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: '用户名和密码是必需的'
        });
      }

      // 查找用户
      const user = users.find(u => u.username === username || u.email === username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        });
      }

      // 验证密码
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        });
      }

      // 生成JWT令牌
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          role: user.role,
          name: user.name
        },
        process.env.JWT_SECRET || 'enterprise_ai_workstation_secret_key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: '登录成功',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            name: user.name
          },
          token
        }
      });
    } catch (error) {
      console.error('登录失败:', error);
      res.status(500).json({
        success: false,
        message: '登录失败',
        error: error.message
      });
    }
  }

  // 注册
  static async register(req, res) {
    try {
      const { username, email, password, name } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: '用户名、邮箱和密码是必需的'
        });
      }

      // 检查用户是否已存在
      const existingUser = users.find(u => u.username === username || u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用户名或邮箱已存在'
        });
      }

      // 哈希密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建新用户
      const newUser = {
        id: users.length + 1,
        username,
        email,
        password: hashedPassword,
        role: 'analyst', // 默认角色
        name: name || username
      };

      users.push(newUser);

      res.status(201).json({
        success: true,
        message: '用户注册成功',
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            name: newUser.name
          }
        }
      });
    } catch (error) {
      console.error('注册失败:', error);
      res.status(500).json({
        success: false,
        message: '注册失败',
        error: error.message
      });
    }
  }

  // 获取用户资料
  static getProfile(req, res) {
    try {
      // 这里我们假设req.user是通过中间件设置的
      // 在实际应用中，需要实现JWT验证中间件
      res.json({
        success: true,
        data: req.user
      });
    } catch (error) {
      console.error('获取用户资料失败:', error);
      res.status(500).json({
        success: false,
        message: '获取用户资料失败',
        error: error.message
      });
    }
  }

  // 检查当前登录用户的权限
  static checkPermission(userRole, requiredRole) {
    const roleHierarchy = {
      'analyst': 1,
      'operator': 2,
      'admin': 3
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }
}

module.exports = AuthController;