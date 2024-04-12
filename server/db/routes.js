const express = require('express');
const router = express.Router();
const pool = require('./db');
const jwt = require('jsonwebtoken');
const cloudinary = require('../cloudinary/cloudinary');
const multer = require('multer');
const upload = multer({
  limits: {
    fieldSize: 10 * 1024 * 1024 
  }
});

router.use(upload.any());

const {
  clubTableQuery,
  clubTypeTableQuery,
  forumTableQuery
} = require('./tableQueries');

async function generateCloudinaryImage(image) {
  try {
    const uploadedImage = await cloudinary.uploader.upload(image, { folder: 'club_for_cubs' });

    return uploadedImage?.public_id;
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
}

async function deleteCloudinaryImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}

router.get('/club-types', async (req, res) => {
  try {
    const query = 'SELECT * FROM club_type_table';
    const { rows } = await pool.query(query);
    
    res.status(200).json({result: rows, message: 'Fetched successfully'});
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/clubs', async (req, res) => {
  const { type, id, isActive } = req.query;
  let query = `
    SELECT club_table.*, club_type_table.name AS type_name
    FROM club_table 
    LEFT JOIN club_type_table ON club_table.type = club_type_table.id`;

  const values = [];

  if (id) {
    query += ` WHERE club_table.id = $1`;
    values.push(id);
  } else if (type) {
    query += ` WHERE club_type_table.id = $1`;
    values.push(type);
  }

  if (isActive === 'true') {
    query += ' AND club_table.is_active = 1';
  } else if (isActive === 'false') {
    query += ' AND club_table.is_active = 0';
  }

  if (!query.includes('WHERE')) {
    query += ' WHERE';
  } else {
    query += ' AND';
  }

  query += ' club_table.isActive = 1 ORDER BY LOWER(club_table.name) ASC';

  try {
    const { rows } = await pool.query(query, values);
    res.status(200).json({result: rows, message: 'Fetched successfully'});
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/clubs', async (req, res) => {
  const { name, description, type, mission, vision, image } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and club type ID are required' });
  }

  let filename = '';
  if (image) {
    filename = await generateCloudinaryImage(image);
  }

  const query = 'INSERT INTO club_table (name, description, type, image, mission, vision) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [name, description, type, filename, mission, vision];

  try {
    const { rows } = await pool.query(query, values);
    const fetchQuery = 'SELECT * FROM club_table ORDER BY name ASC';
    const clubs = await pool.query(fetchQuery);
    res.status(201).json({ id: rows[0].id, message: 'Club added successfully', result: clubs.rows });
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/clubs/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, type, image, mission, vision } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and club type ID are required' });
  }

  let filename = '';
  if (image) {
    filename = await generateCloudinaryImage(image);
  }

  let query;
  let values;
  if (filename) {
    query = `
      UPDATE club_table 
      SET name = $1, description = $2, type = $3, image = $4, mission = $5, vision = $6 
      WHERE id = $7 RETURNING *`;
    values = [name, description, type, filename, mission, vision, id];
  } else {
    query = `
      UPDATE club_table 
      SET name = $1, description = $2, type = $3, mission = $4, vision = $5 
      WHERE id = $6 RETURNING *`;
    values = [name, description, type, mission, vision, id];
  }

  try {
    const { rows } = await pool.query(query, values);
    res.status(200).json({ message: 'Club updated successfully', result: rows });
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/clubs/delete/:id', async (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE club_table 
    SET isActive = $1
    WHERE id = $2`;

  const values = [0, id];

  try {
    await pool.query(query, values);
    res.status(200).json({ message: 'Club deleted successfully' });
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Forums
router.get('/forums', async (req, res) => {
  const { club_id, id, club_id_2, search_string } = req.query;
  let query = `
    SELECT forum_table.*, club_table.*, forum_table.created_at AS forum_created , club_table.name AS club_name
    FROM forum_table 
    LEFT JOIN club_table ON forum_table.club_id = club_table.id`;
 
    const parameters = [];

    if (id) {
      query += ` WHERE forum_table.forum_id = $1`;
      parameters.push(id);
    } else if (club_id || club_id_2) {
      query += ` WHERE forum_table.club_id IN ($1, $2)`;
      parameters.push(club_id || club_id_2, club_id_2 || club_id);
    }
    
    if (search_string) {
      if (club_id || club_id_2) {
        query += ` AND forum_table.forum_name ILIKE '%' || $${parameters.length + 1} || '%'`;
      } else {
        query += ` WHERE forum_table.forum_name ILIKE '%' || $${parameters.length + 1} || '%'`;
      }
      parameters.push(search_string);
    }
    
    query += ' ORDER BY forum_table.created_at DESC';
  
    try {
    const { rows } = await pool.query(query, parameters);
    res.json(rows);
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/forums', async (req, res) => {
  const { club_id, forum_name, forum_description, image } = req.body;

  const parsedClubId = parseInt(club_id);

  if (!forum_name || !parsedClubId || isNaN(parsedClubId)) {
    return res.status(400).json({ message: 'Valid name and club ID are required' });
  }

  let filename = '';
  if (image) {
    filename = await generateCloudinaryImage(image);
  }

  const query = 'INSERT INTO forum_table (club_id, forum_name, forum_description, forum_image) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [parsedClubId, forum_name, forum_description, filename];

  try {
    const { rows } = await pool.query(query, values);

    res.status(201).json({ message: 'Forum added successfully', result: rows });
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/forums/:id', async (req, res) => {
  const { id } = req.params;
  const { club_id, forum_name, forum_description, image } = req.body;

  if (!forum_name || !club_id) {
    return res.status(400).json({ message: 'Name and club ID are required' });
  }

  let filename = '';
  if (image) {
    filename = await generateCloudinaryImage(image);
  }

  let query;
  let values;
  if (filename) {
    query = `
    UPDATE forum_table 
    SET forum_name = $1, forum_description = $2, club_id = $3, forum_image = $4
    WHERE forum_id = $5`;
    values = [forum_name, forum_description, club_id, filename, id];
  } else {
    query = `
    UPDATE forum_table 
    SET forum_name = $1, forum_description = $2, club_id = $3
    WHERE forum_id = $4`;
    values = [forum_name, forum_description, club_id, id];
  }

  try {
    const { rows } = await pool.query(query, values);
    res.status(200).json({ message: 'Forum updated successfully', result: rows });
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/forums/:id', async (req, res) => {
  const forumId = req.params.id;

  if (!forumId) {
    return res.status(400).json({ message: 'Forum ID is required' });
  }
  // select the forum to get image
  const selectQuery = 'SELECT forum_image FROM forum_table WHERE forum_id = $1';
  const { rows } = await pool.query(selectQuery, [forumId]);
  const { forum_image } = rows[0];
  if (forum_image) {
    await deleteCloudinaryImage(forum_image);
  }

  const deleteQuery = 'DELETE FROM forum_table WHERE forum_id = $1';

  try {
    const deleteResult = await pool.query(deleteQuery, [forumId]);
    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: 'Forum not found' });
    }
    res.status(200).json({ message: 'Forum deleted successfully' });
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  let { email, password, club_id } = req.body;

  if (!club_id) {
    club_id = '0'
  }

  try {
    const userQuery = `
    SELECT u.user_id, u.first_name, u.last_name, u.middle_name, u.year, u.section, u.email, c.*
    FROM user_table u
    LEFT JOIN clublist c ON u.user_id = c.user_id
    WHERE u.email = $1 AND u.password = $2 AND 
        (u.access = 'admin' OR 
         (u.access <> 'admin' AND c.club_id = $3))`;

      
    const userResult = await pool.query(userQuery, [email, password, club_id]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Please verify the information provided and try again.' });
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: user.user_id }, 'tMhMoXMgaZPkYICDMyqLobeRBYV5yuBM');

    res.cookie('user_token', token, { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true }); // Expires in 7 days
    
    // Return user details with club information
    res.status(200).json({ user, message: 'Login successful!' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/addUser', async (req, res) => {
  const { first_name, last_name, middle_name, email, password, year, section, club_id } = req.body;

  try {
    const insertQuery = ` INSERT INTO user_table
    (first_name, last_name, middle_name, email, password, year, section, access)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'toVerifyAccount') RETURNING *`;
    const values = [first_name, last_name, middle_name, email, password, year, section];
    const { rows } = await pool.query(insertQuery, values);

    const insertQuery2 = `INSERT INTO clublist (user_id, club_id) VALUES ($1, $2) RETURNING *`;
    const values2 = [rows[0].user_id, club_id];
    await pool.query(insertQuery2, values2);
    res.status(200).json({ message: 'User added successfully. Please wait for the admin to approve your account.', result: rows });
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/user', async (req, res) => {
  const { user_id } = req.query;
  
  let query = `
    SELECT 
      u.user_id, 
      u.first_name, 
      u.last_name, 
      u.middle_name, 
      u.email, 
      u.year, 
      u.section,
      c.club_id
    FROM 
      user_table u
    LEFT JOIN 
      clublist c ON u.user_id = c.user_id`;

  const values = [];

  if (user_id) {
    query += ` WHERE u.user_id = $1`;
    values.push(user_id);
  }
  
  query += ' ORDER BY u.last_name ASC';
  
  try {
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error('Error executing PostgreSQL query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/upload', async (req, res) => {
  const {image} = req.body;
    
  try {
    const uploadedImage = await cloudinary.uploader.upload(image, { folder: 'club_for_cubs' });
  
    res.status(200).json({ uploadedImage });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});


module.exports = router;
