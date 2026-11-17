const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Put your exact password in place of YOUR_PASSWORD
mongoose.connect('mongodb+srv://shuklapriyanshu188_db_user:admin123@priyanshu.uafuk7d.mongodb.net/lms_software?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 1. Schemas
const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  branch: String,
  gender: String,
  fatherName: String,
  dob: String,
  mobileNo: String,
  address: String,
  city: String,
  pincode: String,
  photoUrl: String,
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const bookSchema = new mongoose.Schema({
  bookName: String,
  author: String,
  publication: String,
  branch: String,
  price: Number,
  quantity: Number,
  availableQty: Number
});

const branchSchema = new mongoose.Schema({ branchName: String });
const publicationSchema = new mongoose.Schema({ publicationName: String });
const librarianSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  email: String,
  password: String
});
const Librarian = mongoose.model('Librarian', librarianSchema);

const issueSchema = new mongoose.Schema({
  studentRollNo: String,
  studentName: String,
  bookId: String,
  bookName: String,
  issueDate: { type: Date, default: Date.now },
  dueDate: Date,
  returnDate: Date,
  status: { type: String, default: 'Issued' },
  penalty: { type: Number, default: 0 }
});

const Student = mongoose.model('Student', studentSchema);
const Book = mongoose.model('Book', bookSchema);
const Branch = mongoose.model('Branch', branchSchema);
const Publication = mongoose.model('Publication', publicationSchema);
const Issue = mongoose.model('Issue', issueSchema);

// 2. Auth Route (Checks Librarian & Student in MongoDB)
app.post('/api/auth/login', async (req, res) => {
  const { username, password, role } = req.body;

  if (role === 'Librarian') {
    try {
      if (username === 'admin' && password === 'admin123') {
        return res.json({ success: true, role: 'Librarian', user: { name: 'Admin', username: 'admin' } });
      }

      const librarian = await Librarian.findOne({ username });
      if (!librarian) {
        return res.status(404).json({ success: false, message: 'Librarian username not found!' });
      }
      if (librarian.password !== password) {
        return res.status(401).json({ success: false, message: 'Incorrect password!' });
      }
      return res.json({ success: true, role: 'Librarian', user: librarian });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  try {
    const student = await Student.findOne({
      $or: [{ rollNo: username }, { email: username }]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student Roll No or Email not found!' });
    }
    if (student.password && student.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password!' });
    }
    return res.json({ success: true, role: 'Student', user: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Register New Librarian Route
app.post('/api/auth/register-librarian', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const exists = await Librarian.findOne({ username });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Username already taken!' });
    }
    const newLibrarian = new Librarian({ name, username, email, password });
    await newLibrarian.save();
    res.status(201).json({ success: true, message: 'Librarian Registered Successfully! You can now log in.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
// 3. Student Routes
app.post('/api/students/register', upload.single('photo'), async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      photoUrl: req.file ? `/uploads/${req.file.filename}` : ''
    };
    const newStudent = new Student(studentData);
    await newStudent.save();
    res.status(201).json({ success: true, message: 'Student Saved Successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/api/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// 4. Branch & Publication Routes
app.post('/api/branches', async (req, res) => {
  const branch = new Branch(req.body);
  await branch.save();
  res.json({ success: true, message: 'Branch Added Successfully!' });
});
app.get('/api/branches', async (req, res) => res.json(await Branch.find()));

app.post('/api/publications', async (req, res) => {
  const pub = new Publication(req.body);
  await pub.save();
  res.json({ success: true, message: 'Publication Added Successfully!' });
});
app.get('/api/publications', async (req, res) => res.json(await Publication.find()));

// 5. Book Routes
app.post('/api/books', async (req, res) => {
  try {
    const qty = Number(req.body.quantity) || 1;
    const book = new Book({ ...req.body, quantity: qty, availableQty: qty });
    await book.save();
    res.json({ success: true, message: 'Book Added Successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
app.get('/api/books', async (req, res) => res.json(await Book.find()));

// 6. Issue & Return Book Routes
app.post('/api/issues', async (req, res) => {
  try {
    const { studentRollNo, bookId, days } = req.body;
    const student = await Student.findOne({ rollNo: studentRollNo });
    if (!student) return res.status(404).json({ success: false, message: 'Student Roll No not found!' });

    const book = await Book.findById(bookId);
    if (!book || book.availableQty < 1) {
      return res.status(400).json({ success: false, message: 'Book out of stock!' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (Number(days) || 7));

    const newIssue = new Issue({
      studentRollNo: student.rollNo,
      studentName: student.name,
      bookId: book._id,
      bookName: book.bookName,
      dueDate
    });

    await newIssue.save();
    book.availableQty -= 1;
    await book.save();

    res.json({ success: true, message: 'Book Issued Successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/api/issues', async (req, res) => res.json(await Issue.find()));

app.post('/api/issues/return/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue || issue.status === 'Returned') {
      return res.status(400).json({ success: false, message: 'Invalid or already returned record' });
    }

    const today = new Date();
    let penalty = 0;
    if (today > new Date(issue.dueDate)) {
      const lateDays = Math.ceil((today - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24));
      penalty = lateDays * 10; // Rs. 10 per day late fine
    }

    issue.returnDate = today;
    issue.status = 'Returned';
    issue.penalty = penalty;
    await issue.save();

    const book = await Book.findById(issue.bookId);
    if (book) {
      book.availableQty += 1;
      await book.save();
    }

    res.json({ success: true, message: `Book Returned! Penalty: Rs. ${penalty}` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));