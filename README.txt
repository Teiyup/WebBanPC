# 💻 Simple PCShop - MERN Stack Project

A modern, high-performance E-commerce platform dedicated to PC components and gaming gear. This project demonstrates a full-stack implementation using the MERN ecosystem.

## 🚀 Overview
This is my "practical-learning" project where I built a fully functional PC Store. It focuses on managing complex product data (CPUs, GPUs, RAM, etc.) and providing a smooth shopping experience for hardware enthusiasts.

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS (or CSS/SCSS), Redux/Context API.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).
- **Authentication:** JSON Web Token (JWT).

## ✨ Key Features
- **Product Management:** Browse PC components with detailed specifications (Clock speed, VRAM, Latency, etc.).
- **Smart Filtering:** Filter components by brand, price, and technical specs.
- **Shopping Cart:** Add/Remove items and manage quantities in real-time.
- **User Authentication:** Secure login and registration for customers.
- **Admin Dashboard:** (Optional/Planned) Manage products, orders, and stock levels.

## 📦 Project Structure
```text
.
├── backend/            # Express server & API logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
└── frontend/           # React application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Main views
    │   └── services/   # API calling logic
    └── package.json
⚙️ Installation & Setup
Clone the repository:

Bash
git clone [https://github.com/Teiyup/Simple-PCShop.git](https://github.com/Teiyup/Simple-PCShop.git)
Setup Backend:

Go to backend/, run npm install.

Configure your .env file (MongoDB URI, Port).

Start with npm start or nodemon.

Setup Frontend:

Go to frontend/, run npm install.

Start development server with npm start.
