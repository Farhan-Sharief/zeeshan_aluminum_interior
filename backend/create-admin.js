const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  const [,, username, email, password, name] = process.argv;
  if (!username || !email || !password) {
    console.log('Usage: node create-admin.js <username> <email> <password> [name]');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const existing = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      console.log('❌ Error: Admin with this username or email already exists.');
      process.exit(1);
    }

    const admin = await Admin.create({
      username,
      email,
      password,
      name: name || 'Admin'
    });
    console.log(`✅ Success: Admin account created for "${admin.username}"!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
