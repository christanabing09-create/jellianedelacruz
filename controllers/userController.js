const { db } = require('../config/db');

// ─── GET /api/users ───────────────────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const result = await db.execute('SELECT * FROM users ORDER BY user_id ASC');
    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully.',
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE user_id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/users ──────────────────────────────────────────────────────────
const createUser = async (req, res, next) => {
  try {
    const {
      user_login,
      user_pass,
      fname,
      lname,
      gender,
      user_level,
      branch_cd,
      email,
      user_activation_key,
      isActive,
    } = req.body;

    // Validate required fields
    const requiredFields = { user_login, user_pass, fname, lname, gender };
    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value || String(value).trim() === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}.`,
      });
    }

    const result = await db.execute({
      sql: `INSERT INTO users
              (user_login, user_pass, fname, lname, gender, user_level, branch_cd, email, user_activation_key, isActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        user_login,
        user_pass,
        fname,
        lname,
        gender,
        user_level ?? 0,
        branch_cd ?? '',
        email ?? '',
        user_activation_key ?? '',
        isActive ?? 1,
      ],
    });

    const newUser = await db.execute({
      sql: 'SELECT * FROM users WHERE user_id = ?',
      args: [result.lastInsertRowid],
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: newUser.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check the user exists first
    const existing = await db.execute({
      sql: 'SELECT * FROM users WHERE user_id = ?',
      args: [id],
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found.`,
      });
    }

    const {
      user_login,
      user_pass,
      fname,
      lname,
      gender,
      user_level,
      branch_cd,
      email,
      user_activation_key,
      isActive,
    } = req.body;

    // Validate required fields
    const requiredFields = { user_login, user_pass, fname, lname, gender };
    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value || String(value).trim() === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}.`,
      });
    }

    await db.execute({
      sql: `UPDATE users SET
              user_login = ?,
              user_pass = ?,
              fname = ?,
              lname = ?,
              gender = ?,
              user_level = ?,
              branch_cd = ?,
              email = ?,
              user_activation_key = ?,
              isActive = ?
            WHERE user_id = ?`,
      args: [
        user_login,
        user_pass,
        fname,
        lname,
        gender,
        user_level ?? 0,
        branch_cd ?? '',
        email ?? '',
        user_activation_key ?? '',
        isActive ?? 1,
        id,
      ],
    });

    const updated = await db.execute({
      sql: 'SELECT * FROM users WHERE user_id = ?',
      args: [id],
    });

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: updated.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await db.execute({
      sql: 'SELECT * FROM users WHERE user_id = ?',
      args: [id],
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found.`,
      });
    }

    await db.execute({
      sql: 'DELETE FROM users WHERE user_id = ?',
      args: [id],
    });

    return res.status(200).json({
      success: true,
      message: `User with ID ${id} deleted successfully.`,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
