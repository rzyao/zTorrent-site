import { useState } from 'react';
import { useAuth } from '../hooks/useApi';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function ApiTest() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<string>('');
  
  const { login, register, sendVerificationCode, isLoading, error } = useAuth();

  const testLogin = async () => {
    try {
      setResult('Testing login...');
      const response = await login(username, password);
      setResult(`Login successful: ${JSON.stringify(response)}`);
    } catch (err: any) {
      setResult(`Login failed: ${err.message}`);
    }
  };

  const testSendCode = async () => {
    try {
      setResult('Sending verification code...');
      const response = await sendVerificationCode(email);
      setResult(`Code sent successfully: ${JSON.stringify(response)}`);
    } catch (err: any) {
      setResult(`Send code failed: ${err.message}`);
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">API Test Component</h2>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-2">Username:</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-800 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-2">Password:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-2">Email (for code test):</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={testLogin} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Test Login
          </Button>
          
          <Button 
            onClick={testSendCode} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            Test Send Code
          </Button>
        </div>
        
        {error && (
          <div className="text-red-400 bg-red-900/20 p-3 rounded">
            Error: {error}
          </div>
        )}
        
        {result && (
          <div className="text-green-400 bg-green-900/20 p-3 rounded text-sm">
            Result: {result}
          </div>
        )}
      </div>
    </div>
  );
}