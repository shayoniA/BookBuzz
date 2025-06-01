import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword } from '../firebase';
import './styles.css';
import logo from '../Screenshot 2025-05-30 120746.png';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleCustomSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      const response = await fetch('https://bookbuzz.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, confirmPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('User registered successfully!');
        navigate('/login');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during sign up.');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // OPTIONAL: Send user info to your backend
      await fetch('https://bookbuzz.onrender.com/api/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uid: user.uid, email: user.email })
      });
      console.log("Google sign-in successful!");
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 onboardingbody">
      <img src={logo} alt='Logo' className='logo'/>
      <div className='onboardingdecor'>
        <p className='tagobhead'>Discover.<br/>Share.<br/>Inspire.</p>
        <p className='obdecorpara'>Discover a world of books, and join a vibrant community of readers sharing their thoughts. See and share popular opinions. Get started with BookBuzz!</p>
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96 signupbody">
        <h2 className="text-2xl font-bold mb-4 signuphead">Sign Up</h2>

        <form onSubmit={handleCustomSignUp} className='signupnormalform'>
          <input 
            type="text" placeholder="Username" value={username} 
            onChange={e => setUsername(e.target.value)} 
            className="w-full p-2 mb-2 border rounded usernameinputsignup" 
            required
          />
          <input 
            type="password" placeholder="Password" value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full p-2 mb-2 border rounded passwordinputsignup" 
            required
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            className="w-full p-2 mb-4 border rounded confirmpwdinputsignup" 
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded sumitbtnsignup">Sign Up</button>
        </form>

        <button onClick={handleGoogleSignUp} className="w-full bg-red-500 text-white p-2 rounded mt-2 signupgooglebtn">Sign Up with Google</button>
        <p className="mt-4 text-sm haveaccpara">
          Already have an account? <Link to="/login" className="text-blue-500 loginlink">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;