

# MEANblog  
**Blog CMS** built using **MongoDB-Express-Angular-Node.js** technologies. 

Separated into three modules: 
 - backend: *REST API*
 - frontend: 
   - admin interface *SPA*
   - public interface *SPA*

  
## Features  

 - *REST API* interface with *JWT(JSON Web Tokens)* authentication, filtration and pagination of the resources.
 - Administration interface developed as a *Single Page Application* with *Angular + Angular Material* combination.
    - Create, read, update and delete posts, categories and administration users.  
 - Public blog developed as a *Single Page Application* with *Angular + Bootstrap* combination.
   - Posts with rich HTML content, tags and image galleries.
   - Post grouped into categories and subcategories.
   - Searchable by post content, author, tags and categories.
   
### Features to be added 

 - Web analytics and statistics.
 - Users with different permissions (beyond public and admin binary system).
 - Post comments and likes (with social login).
 - Notifications in admin panel.
 - Turning *SPAs* to *Progressive Web APPs*.
 
## How to install and run

### Requirements

- MongoDB database
- NodeJS

### Installing
- if needed change hardcoded data in *module.exports.dbServer* and *module.exports.dbName* located in *config/database.js* script
- make sure Mongo database service is running by running *mongod* command
- install backend npm packages by positioning yourself in */backend* folder and running:
 ``` npm install ```
- finish backend installation procedure by running:
``` node backend/cli/install.js ```
- install backend npm packages by positioning yourself in */frontend/admin* folder and running:
 ``` npm install ```
 - install backend npm packages by positioning yourself in */frontend/public* folder and running:
 ``` npm install ```
 
### Running

- make sure Mongo database service is running
- to run backend REST API position yourself in backend folder and run:
 ``` nodemon server.js ```
 
- to run frontend Admin SPA position yourself in frontend/admin and run:
```ng serve --port 4201 --open```

- to run frontend Public spa position yourself in frontend/public and run:
 ```ng serve --port 4202 --open```

