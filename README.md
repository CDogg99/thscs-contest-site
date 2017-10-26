# THS Computer Science Contest Website
## Setup Instructions
1. Download and install [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/)
2. Clone this repository 
```
git clone https://github.com/CDogg99/thscs-contest-site.git
cd thscs-contest-site
```
3. Install dependencies
```
npm install
```
4. Update the fields in `config.js` and the username and password variables in `addUserAdmin.js`
5. Start MongoDB without authentication enabled
```
mongod
```
6. Restore the thscontest database from a backup or generate
```
mongorestore -d thscontest <backup_path>
```
or
```
node util/teamGenerator
```
7. Add the database owner and a user admin
```
node util/addOwner
node util/addUserAdmin
```
8. Change the `ip` variables in `index.js`, `admin.js`, and `team.js` in `public/js/` to the host computer's network IP address
9. Stop the `mongod` process and restart it with the authentication flag
```
mongod --auth
```
10. Run nodemon
```
nodemon
```
11. Upload necessary documents to `public/downloads/` as needed
12. Modify the `href` attributes for the anchor elements in `public/downloads.html` to match the uploaded files
