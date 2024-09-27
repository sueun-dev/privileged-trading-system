// controllers/userController.js

const pool = require('../db');

exports.deactivateAllUsers = async () => {
  try {
    await pool.query('UPDATE Users SET is_active = 0');
    console.log('All users have been deactivated');
  } catch (error) {
    console.error('Error deactivating users:', error);
  }
};
