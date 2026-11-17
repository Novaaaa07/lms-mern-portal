import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/Header';

const API = 'http://localhost:5000/api';

const StudentDashboard = () => {
  const [tab, setTab] = useState('MY PROFILE');
  const [myIssues, setMyIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem('lmsUser') || '{}');

  useEffect(() => {
    if (!student.rollNo) {
      navigate('/login');
      return;
    }
    fetch(`${API}/issues`)
      .then(r => r.json())
      .then(data => setMyIssues(data.filter(i => i.studentRollNo === student.rollNo)));

    fetch(`${API}/books`)
      .then(r => r.json())
      .then(data => setBooks(data));
  }, [tab]);

  const handleLogout = () => {
    localStorage.removeItem('lmsUser');
    navigate('/login');
  };

  const filteredBooks = books.filter(b =>
    b.bookName.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="admin-layout">
        <aside className="sidebar">
          <div className="sidebar-welcome">welcome<br />{student.name || 'Student'}</div>
          <button className={tab === 'MY PROFILE' ? 'active' : ''} onClick={() => setTab('MY PROFILE')}>MY PROFILE</button>
          <button className={tab === 'MY BOOKS' ? 'active' : ''} onClick={() => setTab('MY BOOKS')}>MY ISSUED BOOKS</button>
          <button className={tab === 'SEARCH CATALOG' ? 'active' : ''} onClick={() => setTab('SEARCH CATALOG')}>SEARCH BOOKS</button>
          <button onClick={handleLogout}>LogOut</button>
        </aside>

        <main className="dashboard-main">
          <div className="section-header">{tab}</div>

          {tab === 'MY PROFILE' && (
            <table style={{ width: '100%', maxWidth: '450px', margin: '10px auto', borderCollapse: 'collapse' }} border="1">
              <tbody>
                <tr><td className="lbl">Full Name:</td><td style={{ padding: '8px' }}>{student.name}</td></tr>
                <tr><td className="lbl">Roll No:</td><td style={{ padding: '8px' }}>{student.rollNo}</td></tr>
                <tr><td className="lbl">Branch:</td><td style={{ padding: '8px' }}>{student.branch}</td></tr>
                <tr><td className="lbl">Father Name:</td><td style={{ padding: '8px' }}>{student.fatherName}</td></tr>
                <tr><td className="lbl">Mobile No:</td><td style={{ padding: '8px' }}>{student.mobileNo}</td></tr>
                <tr><td className="lbl">Email:</td><td style={{ padding: '8px' }}>{student.email}</td></tr>
                <tr><td className="lbl">Address:</td><td style={{ padding: '8px' }}>{student.address}</td></tr>
              </tbody>
            </table>
          )}

          {tab === 'MY BOOKS' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
              <thead>
                <tr style={{ background: '#013358', color: '#fff' }}>
                  <th>Book Name</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Penalty</th>
                </tr>
              </thead>
              <tbody>
                {myIssues.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '15px' }}>No books issued yet.</td></tr>
                ) : (
                  myIssues.map(i => (
                    <tr key={i._id} style={{ textAlign: 'center' }}>
                      <td>{i.bookName}</td>
                      <td>{new Date(i.issueDate).toLocaleDateString()}</td>
                      <td>{new Date(i.dueDate).toLocaleDateString()}</td>
                      <td>{i.status}</td>
                      <td>₹{i.penalty || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {tab === 'SEARCH CATALOG' && (
            <div>
              <input
                type="text"
                placeholder="Search by book title or author..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
              />
              <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
                <thead>
                  <tr style={{ background: '#013358', color: '#fff' }}>
                    <th>Book Name</th><th>Author</th><th>Publication</th><th>Branch</th><th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map(b => (
                    <tr key={b._id} style={{ textAlign: 'center' }}>
                      <td>{b.bookName}</td><td>{b.author}</td><td>{b.publication}</td><td>{b.branch}</td>
                      <td>{b.availableQty > 0 ? `${b.availableQty} Available` : 'Out of Stock'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StudentDashboard;