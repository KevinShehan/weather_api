import Express from "express";
import mongoose from "mongoose";

const app = Express();
const PORT = 3000;

// Define MongoDB connection URL
const MONGODB_URL = 'mongodb://localhost:27017/';


// Connect to MongoDB
mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the Express server after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Define mongoose schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  age: Number,
  city: String,
});

// Define mongoose model based on schema
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON bodies
app.use(Express.json());

// Route to store user details
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, age, city } = req.body;

    // Create a new user document
    const newUser = new User({
      username,
      email,
      age,
      city,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json(newUser); // Respond with the saved user object
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to update user details by ID
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, age, city } = req.body;

  try {
    // Find user by ID and update
    const updatedUser = await User.findByIdAndUpdate(id, {
      username,
      email,
      age,
      city,
    }, { new: true }); // { new: true } ensures we get the updated user document

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser); // Respond with the updated user object
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});
