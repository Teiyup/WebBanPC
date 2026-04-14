# WebBanPC - Setup Guide

## Setup Guide

Follow these steps to set up the PC e-commerce platform locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Teiyup/WebBanPC.git
   cd WebBanPC
   ```

2. **Install Dependencies**:
   - Frontend:
     ```bash
     cd client
     npm install
     ```
   - Backend:
     ```bash
     cd server
     npm install
     ```

3. **Environment Variables**:
   - Create a `.env` file in the `server` directory and define your MongoDB connection string and other necessary variables.

4. **Start the Servers**:
   - Start the backend server on port 5000:
     ```bash
     cd server
     npm start
     ```
   - Start the frontend server on port 3000:
     ```bash
     cd client
     npm start
     ```

## Features
- User Authentication
- Product Listings
- Shopping Cart Functionality
- Payment Integration
- User Reviews and Ratings

## Project Structure
```
WebBanPC/
├── client/         # Frontend React application
├── server/         # Backend Node.js and Express application
├── .env            # Environment variables for server
└── README.md       # Project README
```

## Usage Instructions
1. Open your browser and navigate to `http://localhost:3000` to access the frontend.
2. Explore the product listings, add items to your cart, and proceed with checkout.

For any further inquiries, feel free to open an issue on this repository.

---

*Last updated: 2026-04-14 15:42:57 UTC*