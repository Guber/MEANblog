start cmd.exe /K "mongod"
start cmd.exe /K "cd backend &  nodemon server.js"
start cmd.exe /K "cd frontend\admin &  ng serve --port 4201 --open"
start cmd.exe /K "cd frontend\public &  ng serve --port 4202 --open"