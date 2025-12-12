# 📔 GitDiary - Personal Digital Diary System

A web-based diary application that demonstrates comprehensive database management system (DBMS) integration using MySQL and PHP, featuring a modern and intuitive user interface.

---

## 1. PROJECT PROPOSAL

### 📌 Project Title and Description

**GitDiary** is a personal digital diary system designed to help users document their daily thoughts, experiences, and memories. The application provides a clean, user-friendly interface where users can create, read, update, and delete diary entries with optional media attachments. Built as a full-stack web application, GitDiary showcases the integration of front-end technologies with a robust backend database system.

### 🎯 Objectives

The GitDiary project aims to:

1. **Demonstrate Database Proficiency**: Apply core DBMS concepts including database design, normalization, and relational database management
2. **Implement CRUD Operations**: Create a fully functional system with Create, Read, Update, and Delete operations on diary entries
3. **Develop User-Friendly Interface**: Build an intuitive web-based GUI that seamlessly interacts with the database
4. **Practice SQL Skills**: Utilize SQL queries, prepared statements, and database transactions for secure data management
5. **Apply Real-World Problem Solving**: Address the need for personal journaling and reflection in a digital format
6. **Ensure Data Integrity**: Implement proper constraints, data validation, and secure database connections

### 🛠️ Tools and Technologies

**Frontend Technologies:**
- HTML5 - Structure and semantic markup
- CSS3 - Styling and responsive design
- Bootstrap 5.3.2 - UI framework for responsive components
- JavaScript (ES6+) - Client-side functionality and DOM manipulation
- Fetch API - Asynchronous communication with backend

**Backend Technologies:**
- PHP 8.x - Server-side scripting language
- MySQL 8.x - Relational database management system
- XAMPP - Local development environment (Apache + MySQL + PHP)

**Development Tools:**
- Visual Studio Code - Code editor
- Git - Version control system
- phpMyAdmin - Database administration interface

### 📊 Proposed Database Structure

```
Database Name: gitDiary

Table: entries
├── entryNumber (INT, PRIMARY KEY, AUTO_INCREMENT)
├── entryTitle (VARCHAR(255), NOT NULL)
├── entryContent (TEXT, NOT NULL)
├── entryMedia (VARCHAR(255), NULL)
└── createdAt (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

**Relationships:**
- Single-table design optimized for diary entries
- Each entry is uniquely identified by `entryNumber`
- Media files stored in filesystem with path references in database

---

## 2. DATABASE DESIGN

### 🗺️ Entity-Relationship Diagram (ERD)

```
┌─────────────────────────────────────┐
│           ENTRIES                    │
├─────────────────────────────────────┤
│ PK  entryNumber (INT)               │
│     entryTitle (VARCHAR(255))       │
│     entryContent (TEXT)             │
│     entryMedia (VARCHAR(255))       │
│     createdAt (TIMESTAMP)           │
└─────────────────────────────────────┘

Notation:
PK = Primary Key
```

### 📋 Tables with Fields, Data Types, and Relationships

#### Table: `entries`

| Field Name    | Data Type      | Constraints                    | Description                              |
|---------------|----------------|--------------------------------|------------------------------------------|
| entryNumber   | INT            | PRIMARY KEY, AUTO_INCREMENT    | Unique identifier for each diary entry   |
| entryTitle    | VARCHAR(255)   | NOT NULL                       | Title/headline of the diary entry        |
| entryContent  | TEXT           | NOT NULL                       | Main content/body of the diary entry     |
| entryMedia    | VARCHAR(255)   | NULL                           | File path for uploaded media (optional)  |
| createdAt     | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP      | Timestamp when entry was created         |

**Key Characteristics:**
- **Primary Key**: `entryNumber` ensures each entry is uniquely identifiable
- **Auto-increment**: Automatically generates sequential entry numbers
- **Default Timestamp**: Automatically records creation time in Philippine timezone
- **Variable Length Text**: `TEXT` data type accommodates entries of any length
- **Optional Media**: Supports multimedia entries without enforcing requirement

### 🔄 Normalization Applied

**First Normal Form (1NF):**
- ✅ All attributes contain atomic values (no multi-valued attributes)
- ✅ Each column contains values of a single type
- ✅ Each column has a unique name
- ✅ Order of rows/columns doesn't matter

**Second Normal Form (2NF):**
- ✅ Meets all 1NF requirements
- ✅ No partial dependencies (all non-key attributes depend on the entire primary key)
- ✅ Single-column primary key eliminates possibility of partial dependencies

**Third Normal Form (3NF):**
- ✅ Meets all 2NF requirements
- ✅ No transitive dependencies (non-key attributes don't depend on other non-key attributes)
- ✅ All attributes directly depend on the primary key

**Justification for Single-Table Design:**
- Diary entries are independent entities without complex relationships
- No redundant data or update anomalies present
- Simple structure optimizes query performance
- Scalable for future expansion (e.g., adding user authentication, categories, tags)

---

## 3. DATABASE INTEGRATION

### 📝 SQL Scripts for Table Creation

**File:** `sql/schema.sql`

```sql
CREATE DATABASE IF NOT EXISTS gitDiary;
USE gitDiary;

CREATE TABLE entries (
    entryNumber INT PRIMARY KEY AUTO_INCREMENT,
    entryTitle VARCHAR(255) NOT NULL,
    entryContent TEXT NOT NULL,
    entryMedia VARCHAR(255) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Setup Instructions:**
1. Start XAMPP (Apache and MySQL services)
2. Access phpMyAdmin at `http://localhost/phpmyadmin`
3. Import `schema.sql` or execute the SQL script
4. Verify table creation in the `gitDiary` database

### 🔌 Code for Connecting GUI to Database

**File:** `backend/database.php`

```php
<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gitdiary";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
```

**Connection Details:**
- **Server**: localhost (XAMPP local server)
- **Username**: root (default MySQL user)
- **Password**: empty (default XAMPP configuration)
- **Database**: gitdiary
- **Connection Method**: MySQLi (MySQL Improved Extension)

**Security Features:**
- Connection error handling
- Prepared statements in all CRUD operations (prevents SQL injection)
- Input validation and sanitization
- CORS headers for secure API communication

### ⚙️ Functional CRUD Operations

#### **CREATE - Add New Entry**

**File:** `backend/submitEntry.php`

**Functionality:**
- Accepts POST requests with title, content, date, and optional media file
- Validates required fields (title and content)
- Handles file uploads to `uploads/` directory
- Uses prepared statements for secure insertion
- Returns JSON response with success status

**SQL Query:**
```sql
INSERT INTO entries (entryTitle, entryContent, entryMedia, createdAt) 
VALUES (?, ?, ?, ?)
```

**Key Features:**
- Philippine timezone support (`Asia/Manila`)
- File upload validation (size, type, errors)
- Unique filename generation to prevent overwrites
- Comprehensive error handling

---

#### **READ - Retrieve Entries**

**File:** `backend/getEntryandShow.php`

**Functionality:**
- **Single Entry**: GET request with `id` parameter returns specific entry
- **All Entries**: GET request without parameters returns all entries
- Uses prepared statements with parameter binding
- Returns JSON-formatted data for frontend consumption

**SQL Queries:**
```sql
-- Get single entry
SELECT * FROM entries WHERE entryNumber = ?

-- Get all entries (ordered by newest first)
SELECT * FROM entries ORDER BY createdAt DESC
```

**Response Format:**
```json
{
  "entryNumber": 1,
  "entryTitle": "My First Entry",
  "entryContent": "Today was amazing...",
  "entryMedia": "uploads/image_123456.jpg",
  "createdAt": "2025-12-13 14:30:00"
}
```

---

#### **UPDATE - Modify Existing Entry**

**File:** `backend/updateAndDelete.php`

**Functionality:**
- Accepts JSON payload with action "update"
- Validates entry existence before updating
- Updates title and/or content fields
- Preserves original timestamp

**SQL Query:**
```sql
UPDATE entries 
SET entryTitle = ?, entryContent = ? 
WHERE entryNumber = ?
```

**Validation:**
- Checks for required fields (id, title, content)
- Verifies entry exists before attempting update
- Returns detailed success/error messages

---

#### **DELETE - Remove Entry**

**File:** `backend/updateAndDelete.php`

**Functionality:**
- Accepts JSON payload with action "delete"
- Removes entry from database
- Validates entry ID before deletion
- Returns confirmation message

**SQL Query:**
```sql
DELETE FROM entries WHERE entryNumber = ?
```

**Safety Features:**
- Prepared statement prevents SQL injection
- ID validation ensures only valid entries are deleted
- Confirmation feedback sent to frontend

---

#### **Additional Operations**

**File:** `backend/truncateRows.php`

**Functionality:**
- Clears all entries from database
- Resets auto-increment counter
- Useful for testing and data cleanup

**SQL Queries:**
```sql
TRUNCATE TABLE entries
```

---

## 4. DOCUMENTATION

### 📖 User Manual / Guide

#### **Getting Started**

1. **Installation Requirements:**
   - XAMPP (Apache + MySQL + PHP)
   - Modern web browser (Chrome, Firefox, Edge)
   - Text editor (optional, for code modifications)

2. **Setup Process:**
   ```
   Step 1: Install XAMPP from https://www.apachefriends.org
   Step 2: Clone/download gitDiary to C:\xampp\htdocs\gitdiary
   Step 3: Start Apache and MySQL from XAMPP Control Panel
   Step 4: Import database using sql/schema.sql
   Step 5: Access application at http://localhost/gitdiary/frontend/
   ```

#### **Using GitDiary**

**1. Home Page (index.html)**
- Landing page with welcome message
- Navigation to create or view entries
- Quick access button: "Write a New Entry"

**2. Creating a New Entry (new-entry.html)**
- Click "New Entry" from navigation menu
- Fill in the form:
  - **Title**: Enter a descriptive title (required)
  - **Date**: Select entry date (defaults to today)
  - **Content**: Write your diary entry (required)
  - **Media**: Upload an image (optional, JPG/PNG/GIF)
- Click "Submit Entry" to save
- Receive confirmation message

**3. Viewing Entries (view-entry.html)**
- Click "View Entries" from navigation menu
- Browse all diary entries displayed as cards
- Entries sorted by newest first
- Click on any entry to view full details

**4. Viewing Entry Details (view-entryDetail.html)**
- Full content display with media (if attached)
- **Edit Button**: Modify title or content
- **Delete Button**: Remove entry (with confirmation)
- Navigation back to entries list

**5. Editing an Entry**
- Click "Edit" button on entry detail page
- Modify title and/or content in form
- Click "Update Entry" to save changes
- Confirmation message displayed

**6. Deleting an Entry**
- Click "Delete" button on entry detail page
- Confirm deletion in popup dialog
- Entry permanently removed from database
- Redirected to entries list

---

### 💭 Reflection on Design and Implementation

#### **Design Process**

The development of GitDiary was guided by database management principles learned throughout the semester. Our primary focus was creating a normalized, efficient database schema that eliminates redundancy while maintaining data integrity. We chose a single-table design for the MVP (Minimum Viable Product) as it perfectly fits the use case of a personal diary without unnecessary complexity.

**Key Design Decisions:**

1. **Simplicity First**: We prioritized a clean, straightforward database structure that students can easily understand and modify
2. **Auto-increment Primary Key**: Ensures unique identification without manual input
3. **Timestamp Automation**: Leverages MySQL's `CURRENT_TIMESTAMP` for accurate record-keeping
4. **Optional Media Field**: Provides flexibility without enforcing requirements
5. **Normalized Structure**: Achieved 3NF to prevent data anomalies

#### **Implementation Challenges and Solutions**

| Challenge | Solution |
|-----------|----------|
| **SQL Injection Vulnerability** | Implemented prepared statements with parameter binding in all queries |
| **File Upload Security** | Added validation for file types, sizes, and proper error handling |
| **Date/Time Consistency** | Configured PHP timezone to Philippine Time (`Asia/Manila`) |
| **CORS Issues** | Set proper headers in PHP files for cross-origin requests |
| **Data Validation** | Combined client-side (JavaScript) and server-side (PHP) validation |

#### **Database Management Concepts Applied**

1. **DDL (Data Definition Language)**: Created database and table structures
2. **DML (Data Manipulation Language)**: Implemented INSERT, SELECT, UPDATE, DELETE operations
3. **Constraints**: Applied PRIMARY KEY, AUTO_INCREMENT, NOT NULL, DEFAULT
4. **Normalization**: Designed schema following 1NF, 2NF, and 3NF principles
5. **ACID Properties**: MySQL transactions ensure Atomicity, Consistency, Isolation, Durability
6. **Prepared Statements**: Enhanced security and performance through parameterized queries

#### **What We Learned**

- **Database Design**: How proper normalization prevents data anomalies and improves query performance
- **Security Best Practices**: The importance of prepared statements and input validation
- **Backend Integration**: Connecting frontend interfaces with database operations seamlessly
- **Error Handling**: Graceful failure management and user-friendly error messages
- **API Design**: Creating RESTful endpoints that follow industry standards

#### **Future Improvements**

1. **User Authentication**: Add multi-user support with login system
2. **Categories/Tags**: Implement tagging system for better organization
3. **Search Functionality**: Full-text search across entry titles and content
4. **Export Feature**: Allow users to export entries as PDF or text files
5. **Responsive Design**: Enhance mobile device compatibility
6. **Database Backup**: Automated backup system for data protection
7. **Media Gallery**: Dedicated section for browsing uploaded images
8. **Mood Tracking**: Add emotional state tracking with visual analytics

---

## 📁 Project Structure

```
gitdiary/
│
├── frontend/
│   ├── index.html              # Home page
│   ├── new-entry.html          # Create new entry form
│   ├── view-entry.html         # List all entries
│   ├── view-entryDetail.html   # Single entry detail view
│   ├── css/
│   │   └── style.css           # Custom styles
│   ├── js/
│   │   ├── app.js              # Main application logic
│   │   ├── entries.js          # Entries list functionality
│   │   ├── submitEntry.js      # New entry submission
│   │   └── view-entryDetail.js # Entry detail operations
│   └── images/                 # UI assets
│
├── backend/
│   ├── database.php            # Database connection
│   ├── submitEntry.php         # CREATE operation
│   ├── getEntryandShow.php     # READ operation
│   ├── updateAndDelete.php     # UPDATE & DELETE operations
│   ├── truncateRows.php        # Clear all entries
│   └── uploads/                # Media file storage
│
├── sql/
│   └── schema.sql              # Database creation script
│
└── README.md                   # Project documentation (this file)
```

---

## 🚀 Installation and Setup

1. **Install XAMPP**
   - Download from [https://www.apachefriends.org](https://www.apachefriends.org)
   - Install to default directory (C:\xampp)

2. **Deploy Application**
   ```
   Copy gitdiary folder to: C:\xampp\htdocs\
   ```

3. **Start Services**
   - Open XAMPP Control Panel
   - Start Apache and MySQL

4. **Create Database**
   - Access phpMyAdmin: http://localhost/phpmyadmin
   - Import `sql/schema.sql` OR run the SQL commands manually

5. **Access Application**
   - Open browser and navigate to: `http://localhost/gitdiary/frontend/index.html`

---

## 🧪 Testing CRUD Operations

**Test Create:**
1. Go to "New Entry" page
2. Fill in title, content, and optional media
3. Submit and verify entry appears in database

**Test Read:**
1. Go to "View Entries" page
2. Verify all entries are displayed
3. Click on entry to view details

**Test Update:**
1. Open an entry's detail page
2. Click "Edit" button
3. Modify content and save
4. Verify changes persist in database

**Test Delete:**
1. Open an entry's detail page
2. Click "Delete" button
3. Confirm deletion
4. Verify entry removed from database

---

## 👨‍💻 Developer Information

**Project**: GitDiary - Digital Diary System  
**Course**: Database Management Systems (DBMS)  
**Technologies**: HTML, CSS, JavaScript, PHP, MySQL  
**Development Period**: November - December 2025  
**Repository**: https://github.com/kuroi17/gitdiary

---

## 📝 Conclusion

GitDiary successfully demonstrates the integration of database management concepts with web development technologies. The project showcases our understanding of database design, normalization, SQL operations, and secure backend implementation. Through this hands-on experience, we've gained practical skills in building full-stack applications that effectively manage and persist data using relational databases.

The system is fully functional with all CRUD operations working seamlessly, providing users with an intuitive interface for personal journaling. The database design follows normalization principles, ensuring data integrity and eliminating redundancy. Security measures such as prepared statements protect against SQL injection attacks, while proper error handling provides a robust user experience.

