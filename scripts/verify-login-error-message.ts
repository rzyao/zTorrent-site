import { extractErrorMessage } from '../src/utils/errorMessage';

const simulatedError = {
  message: '未认证',
  body: {
    code: 9411,
    message: '密码错误',
    data: {
      message: '密码错误',
      error: 'PASSWORD_INCORRECT',
      bizcode: 9411,
    },
    path: '/auth/login',
    timestamp: '2025-12-05T12:43:00.431Z',
  },
  request: { url: '/auth/login' },
};

const msg = extractErrorMessage(simulatedError, '登录失败');
console.log('Expected:"密码错误" Got:"' + msg + '"');
if (msg !== '密码错误') {
  process.exitCode = 1;
}
