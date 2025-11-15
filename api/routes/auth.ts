/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'

const router = Router()

/**
 * User Register
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password, verificationCode } = req.body
    
    if (!email || !username || !password || !verificationCode) {
      res.status(400).json({
        success: false,
        message: '请填写所有必填字段'
      })
      return
    }

    // In a real application, you would:
    // 1. Verify the verification code from database
    // 2. Check if user already exists
    // 3. Hash the password
    // 4. Create user in database
    // 5. Generate JWT token
    
    // For now, we'll return a mock success response
    const mockToken = 'mock-jwt-token-' + Date.now()
    const mockUser = {
      id: Math.floor(Math.random() * 1000),
      email,
      username
    }
    
    res.status(200).json({
      success: true,
      message: '注册成功',
      token: mockToken,
      user: mockUser
    })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({
      success: false,
      message: '注册失败，请重试'
    })
  }
})

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, autoLogout } = req.body
    
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      })
      return
    }

    // In a real application, you would:
    // 1. Find user by username/email
    // 2. Verify password hash
    // 3. Generate JWT token
    // 4. Update last login time
    
    // For now, we'll return a mock success response
    const mockToken = 'mock-jwt-token-' + Date.now()
    const mockUser = {
      id: Math.floor(Math.random() * 1000),
      email: username.includes('@') ? username : `${username}@example.com`,
      username: username.includes('@') ? username.split('@')[0] : username
    }
    
    res.status(200).json({
      success: true,
      message: '登录成功',
      token: mockToken,
      user: mockUser,
      autoLogout: autoLogout || false
    })
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({
      success: false,
      message: '登录失败，请重试'
    })
  }
})

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    // In a real application, you would:
    // 1. Invalidate the JWT token
    // 2. Clear any server-side sessions
    // 3. Log the logout event
    
    res.status(200).json({
      success: true,
      message: '登出成功'
    })
  } catch (error) {
    console.error('登出失败:', error)
    res.status(500).json({
      success: false,
      message: '登出失败，请重试'
    })
  }
})

/**
 * Send Verification Code
 * POST /api/auth/request-email-code
 */
router.post('/request-email-code', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body
    
    if (!email) {
      res.status(400).json({
        success: false,
        message: '邮箱地址不能为空'
      })
      return
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: '请输入有效的邮箱地址'
      })
      return
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // In a real application, you would:
    // 1. Store the code in database with expiration time
    // 2. Send the code via email service
    // For now, we'll just return success with a mock expiry time
    
    console.log(`Verification code for ${email}: ${verificationCode}`)
    
    res.status(200).json({
      success: true,
      message: '验证码已发送到您的邮箱',
      expiry: 300 // 5 minutes in seconds
    })
  } catch (error) {
    console.error('发送验证码失败:', error)
    res.status(500).json({
      success: false,
      message: '发送验证码失败，请重试'
    })
  }
})

export default router
