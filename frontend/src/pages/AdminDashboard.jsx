import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/Header';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('WELCOME');
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [pubs, setPubs] = useState([]);
  const [issues, setIssues] = useState([]);

  const [nameInput, setNameInput] = useState('');
  const [book, setBook] = useState({ bookName: '', author: '', publication: '', branch: '', price: '', quantity: '' });
  const [issue, setIssue] = useState({ studentRollNo: '', bookId: '', days: 7 });
  const [student, setStudent] = useState({ name: '', rollNo: '', branch: '', fatherName: '', mobileNo: '', email: '', address: '', dob: '' });
  
  const menu = [
    'ADD PUBLICATION', 'ADD BOOK', 'BOOK REPORT', 'ADD BRANCH',
    'ADD STUDENT', 'STUDENT REPORT', 'ISSUE BOOK', 'ISSUE REPORT',
    'RETURN BOOK', 'PENALTY'
  ];

  const loadAll = async () => {
    try {
      const [s, b, br, p, i] = await Promise.all([
        fetch(`${API}/students`).then(r => r.json()),
        fetch(`${API}/books`).then(r => r.json()),
        fetch(`${API}/branches`).then(r => r.json()),
        fetch(`${API}/publications`).then(r => r.json()),
        fetch(`${API}/issues`).then(r => r.json())
      ]);
      setStudents(s); setBooks(b); setBranches(br); setPubs(p); setIssues(i);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadAll(); }, [tab]);

  const postData = async (url, body, resetFn) => {
    const res = await fetch(`${API}${url}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    const data = await res.json();
    alert(data.message);
    if (resetFn) resetFn();
    loadAll();
  };
  const deleteItem = async (url) => {
  if (!window.confirm('Are you sure you want to delete this record?')) return;
  const res = await fetch(`${API}${url}`, { method: 'DELETE' });
  const data = await res.json();
  alert(data.message);
  loadAll();
};

  return (
    <div>
      <Header />
      <div className="admin-layout">
        <aside className="sidebar">
          <div className="sidebar-welcome">welcome<br />admin</div>
          {menu.map(m => (
            <button key={m} className={tab === m ? 'active' : ''} onClick={() => { setTab(m); setNameInput(''); }}>
              {m}
            </button>
          ))}
          <button onClick={() => navigate('/login')}>LogOut</button>
        </aside>

        <main className="dashboard-main">
          <div className="section-header">{tab === 'WELCOME' ? 'Welcome to Digital Library System' : tab}</div>

          {tab === 'WELCOME' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
              <h3>Library Management System Overview</h3>
              <p style={{ margin: '10px 0 20px 0' }}>
               Students: <strong>{students.length}</strong> | Books: <strong>{books.length}</strong> | Issued: <strong>{issues.filter(i => i.status === 'Issued').length}</strong>
          </p>
         <img src="/dashboard-lib.jpg"
         alt="Digital Library"
         style={{ width: '100%', maxWidth: '650px', height: '280px', objectFit: 'cover', borderRadius: '8px' }}
/>
  </div>
)}

          {(tab === 'ADD PUBLICATION' || tab === 'ADD BRANCH') && (
            <form onSubmit={e => {
              e.preventDefault();
              const isPub = tab === 'ADD PUBLICATION';
              postData(isPub ? '/publications' : '/branches', isPub ? { publicationName: nameInput } : { branchName: nameInput }, () => setNameInput(''));
            }} style={{ maxWidth: '400px', margin: '20px auto' }}>
              <label>{tab === 'ADD PUBLICATION' ? 'Publication Name:' : 'Branch Name:'}</label>
              <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} required style={{ padding: '6px', width: '100%', margin: '10px 0' }} />
              <button type="submit" className="btn">{tab}</button>
            </form>
          )}
          {tab === 'ADD BOOK' && (
            <form onSubmit={e => { e.preventDefault(); postData('/books', book, () => setBook({ bookName: '', author: '', publication: '', branch: '', price: '', quantity: '' })); }} style={{ maxWidth: '420px', margin: '0 auto' }}>
              <table style={{ width: '100%' }}><tbody>
                <tr><td className="lbl">Book Name:</td><td><input required value={book.bookName} onChange={e => setBook({ ...book, bookName: e.target.value })} /></td></tr>
                <tr><td className="lbl">Author:</td><td><input required value={book.author} onChange={e => setBook({ ...book, author: e.target.value })} /></td></tr>
                <tr><td className="lbl">Publication:</td><td>
                  <select required value={book.publication} onChange={e => setBook({ ...book, publication: e.target.value })}>
                    <option value="">Select</option>
                    {pubs.map(p => <option key={p._id} value={p.publicationName}>{p.publicationName}</option>)}
                  </select>
                </td></tr>
                <tr><td className="lbl">Branch:</td><td>
                  <select required value={book.branch} onChange={e => setBook({ ...book, branch: e.target.value })}>
                    <option value="">Select</option><option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option>
                    {branches.map(b => <option key={b._id} value={b.branchName}>{b.branchName}</option>)}
                  </select>
                </td></tr>
                <tr><td className="lbl">Price:</td><td><input type="number" required value={book.price} onChange={e => setBook({ ...book, price: e.target.value })} /></td></tr>
                <tr><td className="lbl">Quantity:</td><td><input type="number" required value={book.quantity} onChange={e => setBook({ ...book, quantity: e.target.value })} /></td></tr>
                <tr><td></td><td><button type="submit" className="btn" style={{ marginTop: '10px' }}>Add Book</button></td></tr>
              </tbody></table>
            </form>
          )}

          {tab === 'BOOK REPORT' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
              <thead>
                <tr style={{ background: '#013358', color: '#fff' }}>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Publication</th>
                  <th>Branch</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b._id} style={{ textAlign: 'center' }}>
                    <td>{b.bookName}</td>
                    <td>{b.author}</td>
                    <td>{b.publication}</td>
                    <td>{b.branch}</td>
                    <td>₹{b.price}</td>
                    <td>{b.availableQty}/{b.quantity}</td>
                    <td>
                      <button
                        className="btn"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => deleteItem(`/books/${b._id}`)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'ADD STUDENT' && (
            <form onSubmit={e => { e.preventDefault(); postData('/students/register', student, () => setStudent({ name: '', rollNo: '', branch: '', fatherName: '', mobileNo: '', email: '', address: '', dob: '' })); }} style={{ maxWidth: '420px', margin: '0 auto' }}>
              <table style={{ width: '100%' }}><tbody>
                <tr><td className="lbl">Name:</td><td><input required value={student.name} onChange={e => setStudent({ ...student, name: e.target.value })} /></td></tr>
                <tr><td className="lbl">Roll No:</td><td><input required value={student.rollNo} onChange={e => setStudent({ ...student, rollNo: e.target.value })} /></td></tr>
                <tr><td className="lbl">Branch:</td><td><input required value={student.branch} onChange={e => setStudent({ ...student, branch: e.target.value })} /></td></tr>
                <tr><td className="lbl">Father Name:</td><td><input required value={student.fatherName} onChange={e => setStudent({ ...student, fatherName: e.target.value })} /></td></tr>
                <tr><td className="lbl">Mobile:</td><td><input type="tel" required value={student.mobileNo} onChange={e => setStudent({ ...student, mobileNo: e.target.value })} /></td></tr>
                <tr><td className="lbl">Email:</td><td><input type="email" required value={student.email} onChange={e => setStudent({ ...student, email: e.target.value })} /></td></tr>
                <tr><td className="lbl">Address:</td><td><input required value={student.address} onChange={e => setStudent({ ...student, address: e.target.value })} /></td></tr>
                <tr><td className="lbl">DOB:</td><td><input type="date" required value={student.dob} onChange={e => setStudent({ ...student, dob: e.target.value })} /></td></tr>
                <tr><td className="lbl">Password:</td><td><input type="password" required value={student.password} onChange={e => setStudent({ ...student, password: e.target.value })} /></td></tr>
                <tr><td></td><td><button type="submit" className="btn" style={{ marginTop: '10px' }}>Add Student</button></td></tr>
              </tbody></table>
            </form>
          )}

          {tab === 'STUDENT REPORT' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
              <thead>
                <tr style={{ background: '#013358', color: '#fff' }}>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Branch</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id} style={{ textAlign: 'center' }}>
                    <td>{s.name}</td>
                    <td>{s.rollNo}</td>
                    <td>{s.branch}</td>
                    <td>{s.mobileNo}</td>
                    <td>{s.email}</td>
                    <td>
                      <button
                        className="btn"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => deleteItem(`/students/${s._id}`)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'ISSUE BOOK' && (
            <form onSubmit={e => { e.preventDefault(); postData('/issues', issue); }} style={{ maxWidth: '420px', margin: '0 auto' }}>
              <table style={{ width: '100%' }}><tbody>
                <tr><td className="lbl">Roll No:</td><td><input required value={issue.studentRollNo} onChange={e => setIssue({ ...issue, studentRollNo: e.target.value })} /></td></tr>
                <tr><td className="lbl">Book:</td><td>
                  <select required value={issue.bookId} onChange={e => setIssue({ ...issue, bookId: e.target.value })}>
                    <option value="">Choose Book</option>
                    {books.filter(b => b.availableQty > 0).map(b => <option key={b._id} value={b._id}>{b.bookName} ({b.availableQty} left)</option>)}
                  </select>
                </td></tr>
                <tr><td className="lbl">Days:</td><td><input type="number" required value={issue.days} onChange={e => setIssue({ ...issue, days: e.target.value })} /></td></tr>
                <tr><td></td><td><button type="submit" className="btn" style={{ marginTop: '10px' }}>Issue Book</button></td></tr>
              </tbody></table>
            </form>
          )}

          {tab === 'ISSUE REPORT' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
              <thead><tr style={{ background: '#013358', color: '#fff' }}><th>Roll No</th><th>Student</th><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr></thead>
              <tbody>{issues.map(i => <tr key={i._id} style={{ textAlign: 'center' }}><td>{i.studentRollNo}</td><td>{i.studentName}</td><td>{i.bookName}</td><td>{new Date(i.issueDate).toLocaleDateString()}</td><td>{new Date(i.dueDate).toLocaleDateString()}</td><td>{i.status}</td></tr>)}</tbody>
            </table>
          )}

          {tab === 'RETURN BOOK' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
              <thead><tr style={{ background: '#013358', color: '#fff' }}><th>Roll No</th><th>Student</th><th>Book</th><th>Due Date</th><th>Action</th></tr></thead>
              <tbody>{issues.filter(i => i.status === 'Issued').map(i => <tr key={i._id} style={{ textAlign: 'center' }}><td>{i.studentRollNo}</td><td>{i.studentName}</td><td>{i.bookName}</td><td>{new Date(i.dueDate).toLocaleDateString()}</td><td><button className="btn" onClick={() => postData(`/issues/return/${i._id}`, {})}>Return</button></td></tr>)}</tbody>
            </table>
          )}

          {tab === 'PENALTY' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
              <thead><tr style={{ background: '#013358', color: '#fff' }}><th>Roll No</th><th>Student</th><th>Book</th><th>Return Date</th><th>Penalty</th></tr></thead>
              <tbody>{issues.filter(i => i.penalty > 0).map(i => <tr key={i._id} style={{ textAlign: 'center' }}><td>{i.studentRollNo}</td><td>{i.studentName}</td><td>{i.bookName}</td><td>{new Date(i.returnDate).toLocaleDateString()}</td><td>₹{i.penalty}</td></tr>)}</tbody>
            </table>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;