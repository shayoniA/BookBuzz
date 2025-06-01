import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword } from '../firebase';
import './styles.css';

function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://bookbuzz.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.userId);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Invalid username or password!');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during login.');
    }
  };

  const handleGoogleLogIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const email = result.user.email;
    const response = await fetch('https://bookbuzz.onrender.com/api/users/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data.message);
      localStorage.setItem('username', data.username);
      localStorage.setItem('userId', data.userId); // Use backend's userId
      navigate('/dashboard');
    } else {
      alert(data.message || 'Google login failed.');
    }
  } catch (error) {
    console.error('Google login error:', error);
    alert(error.message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 loginwholebody">
      <div className="bg-white p-8 rounded shadow-md w-96 loginbody">
        <h2 className="text-2xl font-bold mb-4 loginhead">Log In</h2>

        <form onSubmit={handleLogIn} className='loginnormalform'>
          <input
            type="text" placeholder="Username" value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 mb-2 border rounded usernameinputlogin"
            required
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded passwordinputlogin"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded sumitbtnlogin">Log In</button>
        </form>

        <button onClick={handleGoogleLogIn} className="w-full bg-red-500 text-white p-2 rounded mt-2 logingooglebtn">Log In with Google</button>
        <p className="mt-4 text-sm noaccpara">
          Don't have an account? <Link to="/" className="text-blue-500 signuplink">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LogIn;