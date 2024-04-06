const clubTypeTableQuery = `
  CREATE TABLE IF NOT EXISTS club_type_table (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );

  INSERT INTO club_type_table (id, name) VALUES
  ('all', 'All Clubs (Alphabetically)'),
  ('curricular', 'Co-Curricular'),
  ('interest', 'Interest');
`;

const clubTableQuery = `
  CREATE TABLE IF NOT EXISTS club_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    mission VARCHAR(255),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(45) REFERENCES club_type_table(id),
    vision VARCHAR(255),
    isActive INT DEFAULT 1
  );
`;

const forumTableQuery = `
  CREATE TABLE IF NOT EXISTS forum_table (
    forum_id SERIAL PRIMARY KEY,
    forum_name VARCHAR(255) NOT NULL,
    forum_description TEXT,
    forum_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    club_id INT REFERENCES club_table(id)
  );
`;

module.exports = {
  clubTableQuery,
  clubTypeTableQuery,
  forumTableQuery
};
