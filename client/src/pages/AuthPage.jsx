import { useState } from 'react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center mb-8 absolute top-8">
        <h1 className="text-4xl font-bold text-white mb-2">Real-Time Chat</h1>
        <p className="text-gray-400">Chat em tempo real com WebSockets</p>
      </div>

      {isLogin ? (
        <Login switchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register switchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;
