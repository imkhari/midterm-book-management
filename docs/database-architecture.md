# Database Architecture

Database:
DB_23IT119

Collection:
books

The application uses two separate MongoDB connections:

- READ_23IT119 for reading book data.
- WRITE_23IT119 for inserting new book data.

The READ connection is used by GET /books.
The WRITE connection is used by POST /books.

This separation follows the Least Privilege principle.
