import React, { useState } from 'react';
import { Header, Footer } from '../components/Header';

const StdRegistration = () => {
  const [formData, setFormData] = useState({
    name: '', rollNo: '', branch: 'CSE', fatherName: '',
    address: '', mobileNo: '', email: '', dob: '',
    semester: '1st', courseType: 'B.Tech'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/students/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <Header />
      <div
        className="page-wrapper"
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("/background.jpg") center/cover no-repeat fixed',
          paddingBottom: '40px'
        }}
      >
        <div
          className="auto-style3"
          style={{
            background: 'linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url("/register.jpg") center/cover no-repeat',
            borderRadius: '8px'
          }}
        >
          <form onSubmit={handleSubmit}>
            <table className="auto-style1">
              <tbody>
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center', padding: '10px', background: 'rgba(1, 51, 88, 0.75)', borderRadius: '4px' }}>
                    <h3>Student Registration</h3>
                  </td>
                </tr>
                <tr><td className="auto-style4" colSpan="2">&nbsp;</td></tr>
                <tr>
                  <td className="auto-style5">Name</td>
                  <td className="auto-style6"><input type="text" name="name" value={formData.name} onChange={handleChange} required /></td>
                </tr>
                <tr>
                  <td className="auto-style5">Roll No.</td>
                  <td className="auto-style6"><input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} required /></td>
                </tr>
                <tr>
                  <td className="auto-style5">Branch</td>
                  <td className="auto-style6">
                    <select name="branch" value={formData.branch} onChange={handleChange}>
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="ECE">ECE</option>
                      <option value="ME">ME</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="auto-style5">Father Name</td>
                  <td className="auto-style6"><input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required /></td>
                </tr>
                <tr>
                  <td className="auto-style5">Address</td>
                  <td className="auto-style6"><input type="text" name="address" value={formData.address} onChange={handleChange} required /></td>
                </tr>
                <tr>
                  <td className="auto-style5">Mobile No.</td>
                  <td className="auto-style6"><input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required /></td>
                </tr>
                <tr>
                  <td className="auto-style5">Email</td>
                  <td className="auto-style6"><input type="email" name="email" value={formData.email} onChange={handleChange} required /></td>
                </tr>
                <tr>
                  <td className="auto-style5">DOB</td>
                  <td className="auto-style6"><input type="date" name="dob" value={formData.dob} onChange={handleChange} required /></td>
                </tr>
                <tr>
                  <td className="auto-style5">&nbsp;</td>
                  <td className="auto-style6"><button type="submit" className="btn">Submit Registration</button></td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StdRegistration;