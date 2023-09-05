
# 🌞 Start-Line Scheduler

Start-Line Scheduler is all-in-one app that combines key features like calculating the optimal commute time, providing weather updates, and managing a to-do list to help users strategically plan their morning.

This is my first project using Vite, TypeScript, MUI and Prisma.

**Client Repo:**  [https://github.com/koo-mi/start-line-scheduler-client](https://github.com/koo-mi/start-line-scheduler-client)

**Server Repo:** [https://github.com/koo-mi/start-line-scheduler-server](https://github.com/koo-mi/start-line-scheduler-server)
## 🛠️ Tech Stack

**Client:** React, MUI, SCSS, TypeScript

**Server:** Node, Express, MySQL, Prisma, Typescript

## 🌟 Features

- Optimal Commute Planning 🚗🚌
- Weather Updates ☀️🌧️
- To-Do List Management 📝✅



## 🏃 Run Locally

**Clone the project**

Client
```bash
    - git clone https://github.com/koo-mi/start-line-scheduler-client.git
```
Server
```bash 
    - git clone https://github.com/koo-mi/start-line-scheduler-server.git
```

**Go to the project directory**

Client
```bash
  cd start-line-scheduler-client/
```
Server
```bash
  cd start-line-scheduler-server/
```
**Install dependencies**
```bash
  npm install
```

**Setup Environment Variables**
```bash
  refer to .env.sample
```

**Setup Database (Server Only)**

Create MySQL DB 
```bash
  CREATE DATABASE start_line_scheduler
```

Prisma Migrate
```bash
  npx prisma migrate dev --name init 
```
```bash
  npx prisma generate
```

**Start the server**
```bash
  npm run dev
```


## 🗺️ Site Map
- Home Page (Dashboard)
- Direction Page
    - Location Page
        - Add / Edit / Delete Modal
- Weather Page
- Checklist Page
    - Add / Edit / Delete Modal
- Login Page
- Signup Page
