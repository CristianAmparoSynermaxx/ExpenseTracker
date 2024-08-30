const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Get list of users/voters
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, filterBy } = req.query;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM tbl_users WHERE username NOT IN (?)";
  const queryParams = ["admin@gmail.com"];

  if (filterBy) {
    query += " AND name LIKE ?";
    queryParams.push(`%${filterBy}%`);
  }

  query += " LIMIT ? OFFSET ?";
  queryParams.push(parseInt(limit), parseInt(offset));

  const [results] = await db.query(query, queryParams);

  res.json(results);
});

const getMe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM tbl_users WHERE id = ?";
  try {
    const [results] = await db.execute(query, [id]);
    res.json(results);
  } catch (error) {
    console.error("Error fetching user data: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data" });
  }
});

// Register a user - POST
const registerUser = asyncHandler(async (req, res) => {
  const { fname, lname, username, password, password2 } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!image) return res.status(400).json({ error: "Please upload an image" });
  if (!fname)
    return res.status(400).json({ error: "Please provide the first name" });
  if (!lname)
    return res.status(400).json({ error: "Please provide the last name" });
  if (!username)
    return res.status(400).json({ error: "Please provide the username" });
  if (!password)
    return res.status(400).json({ error: "Please provide the password" });
  if (!password2)
    return res.status(400).json({ error: "Please retype your password" });
  if (password !== password2)
    return res.status(400).json({ error: "Passwords do not match" });

  try {
    const query1 = "SELECT * FROM tbl_users WHERE username = ?";
    const [userExist] = await db.execute(query1, [username]);

    if (userExist.length > 0) {
      return res.status(400).json({ error: "User Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const name = `${fname} ${lname}`;
    const query =
      "INSERT INTO tbl_users (image, name, username, password) VALUES (?, ?, ?, ?)";
    await db.execute(query, [image, name, username, hashedPassword]);

    res.json({ message: "Registration Successful" });
  } catch (error) {
    console.error("Error creating a user: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { image, fname, lname, username, password, password2 } = req.body;

  let newImage;

  if (image) {
    newImage = image;
  } else if (req.file && req.file.filename) {
    newImage = req.file.filename;
  }

  if (!newImage)
    return res.status(400).json({ error: "Please upload an image" });
  if (!fname)
    return res.status(400).json({ error: "Please provide the first name" });
  if (!lname)
    return res.status(400).json({ error: "Please provide the last name" });
  if (!username)
    return res.status(400).json({ error: "Please provide the username" });
  if (!password)
    return res.status(400).json({ error: "Please provide the password" });
  if (!password2)
    return res.status(400).json({ error: "Please retype your password" });
  if (password !== password2)
    return res.status(400).json({ error: "Passwords do not match" });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const name = `${fname} ${lname}`;
    const query =
      "UPDATE tbl_users SET image=?, name=?, username=?, password=? WHERE id=?";

    const values = [newImage, name, username, hashedPassword, id];

    await db.execute(query, values);

    res.json({ message: "Updated Successfully" });
  } catch (error) {
    console.error("Error updating user: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both username and password" });
    }

    const query = "SELECT * FROM tbl_users WHERE username = ?";
    const [user] = await db.execute(query, [username]);

    if (user.length > 0 && (await bcrypt.compare(password, user[0].password))) {
      const token = jwt.sign(
        { id: user[0].id, username: user[0].username },
        "samplekey",
        { expiresIn: "24h" }
      );

      res.status(201).json({ user: user[0], token });
    } else {
      res.status(400).json({ error: "Incorrect email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const deleteUserQuery = "DELETE FROM tbl_users WHERE id = ?";
    await connection.execute(deleteUserQuery, [id]);

    const deleteVotesQuery = "DELETE FROM tbl_vote WHERE user_id = ?";
    await connection.execute(deleteVotesQuery, [id]);

    await connection.commit();

    res.json({ message: "User Deleted" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  } finally {
    connection.release();
  }
});

module.exports = {
  getUsers,
  getMe,
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
};
