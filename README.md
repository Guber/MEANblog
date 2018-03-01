
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