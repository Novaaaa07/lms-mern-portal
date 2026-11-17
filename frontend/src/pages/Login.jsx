import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/Header';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('Librarian');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [libForm, setLibForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('!!! Username and Password are required');
      return;
    }

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('lmsUser', JSON.stringify(data.user));
      navigate(data.role === 'Student' ? '/student-dashboard' : '/home');
    } else {
      setError(data.message);
    }
  };

  const handleRegisterLibrarian = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:5000/api/auth/register-librarian', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(libForm)
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message);
      setIsRegistering(false);
      setLibForm({ name: '', username: '', email: '', password: '' });
    } else {
      setError(data.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="page-wrapper login-layout">
        <div id="img">
          <img src="/login-lib.jpg"
           alt="Library Bookshelves"
           style={{ width: '460px', maxWidth: '90vw', height: '310px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
        /> 
        </div>
        <div id="login">
          {!isRegistering ? (
            <form onSubmit={handleLogin}>
              <table className="tbl" style={{ border: '1px solid #ccc', padding: '20px', background: '#fff' }}>
                <thead>
                  <tr><th className="tblhead" colSpan="2">Login Area</th></tr>
                </thead>
                <tbody>
                  {error && <tr><td colSpan="2" style={{ color: 'red', fontSize: '12px', padding: '5px' }}>{error}</td></tr>}
                  <tr>
                    <td className="lbl">{role === 'Student' ? 'Roll No / Email :' : 'UserName :'}</td>
                    <td><input type="text" style={{ width: '175px', padding: '4px' }} value={username} onChange={(e) => setUsername(e.target.value)} /></td>
                  </tr>
                  <tr>
                    <td className="lbl">Password :</td>
                    <td><input type="password" style={{ width: '175px', padding: '4px' }} value={password} onChange={(e) => setPassword(e.target.value)} /></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ padding: '6px 0' }}>
                      <label><input type="radio" name="role" value="Librarian" checked={role === 'Librarian'} onChange={(e) => setRole(e.target.value)} /> Librarian</label>
                      &nbsp;&nbsp;
                      <label><input type="radio" name="role" value="Student" checked={role === 'Student'} onChange={(e) => setRole(e.target.value)} /> Student</label>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td><button type="submit" className="btn">Login</button></td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', paddingTop: '12px', fontSize: '13px', color: '#111' }}>
                      New Librarian?{' '}
                      <span onClick={() => { setIsRegistering(true); setError(''); }} style={{ color: 'crimson', cursor: 'pointer', fontWeight: 'bold' }}>
                        Register Here
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          ) : (
            <form onSubmit={handleRegisterLibrarian}>
              <table className="tbl" style={{ border: '1px solid #ccc', padding: '20px', background: '#fff' }}>
                <thead>
                  <tr><th className="tblhead" colSpan="2">Register Librarian</th></tr>
                </thead>
                <tbody>
                  {error && <tr><td colSpan="2" style={{ color: 'red', fontSize: '12px', padding: '5px' }}>{error}</td></tr>}
                  <tr>
                    <td className="lbl">Full Name :</td>
                    <td><input type="text" required style={{ width: '175px', padding: '4px' }} value={libForm.name} onChange={(e) => setLibForm({ ...libForm, name: e.target.value })} /></td>
                  </tr>
                  <tr>
                    <td className="lbl">UserName :</td>
                    <td><input type="text" required style={{ width: '175px', padding: '4px' }} value={libForm.username} onChange={(e) => setLibForm({ ...libForm, username: e.target.value })} /></td>
                  </tr>
                  <tr>
                    <td className="lbl">Email :</td>
                    <td><input type="email" required style={{ width: '175px', padding: '4px' }} value={libForm.email} onChange={(e) => setLibForm({ ...libForm, email: e.target.value })} /></td>
                  </tr>
                  <tr>
                    <td className="lbl">Password :</td>
                    <td><input type="password" required style={{ width: '175px', padding: '4px' }} value={libForm.password} onChange={(e) => setLibForm({ ...libForm, password: e.target.value })} /></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td><button type="submit" className="btn">Create Account</button></td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', paddingTop: '12px', fontSize: '13px', color: '#111' }}>
                      Already have an account?{' '}
                      <span onClick={() => { setIsRegistering(false); setError(''); }} style={{ color: 'crimson', cursor: 'pointer', fontWeight: 'bold' }}>
                        Back to Login
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;