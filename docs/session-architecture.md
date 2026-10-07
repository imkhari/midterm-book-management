# Stateless Session Architecture

The application uses express-session with connect-mongo.

Session data is stored in MongoDB Atlas instead of the Node.js server RAM.

Database:
DB_23IT119

Session collection:
sessions

This architecture allows the application to maintain session data
when deployed on a scalable cloud environment.
