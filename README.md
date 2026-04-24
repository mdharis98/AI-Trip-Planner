# AI Travel Planner

AI Travel Planner is a full-stack MERN web application that helps users plan trips, explore hotels, and book travel tickets through a modern and responsive interface.

## 🚀 Features

### 🔐 Authentication
- User Registration and Login
- JWT-based Authentication
- Protected Routes

### 🧳 Trip Planning
- Create trips by entering:
  - Destination
  - Number of Days
  - Budget
  - Travelers
- Auto-generated day-wise itinerary based on trip duration

### 🏨 Hotel Booking
- Hotel recommendations based on destination
- Hotel details with ratings and pricing
- Cash on Arrival booking system

### 🎫 Ticket Booking
Navbar includes a Ticket Booking dropdown with:

- 🚆 Train Booking
- 🚌 Bus Booking
- ✈️ Flight Booking

Each module includes:
- Search form
- Dynamic results
- Booking flow

### 🎨 UI / UX
- Modern responsive design
- Clean dashboard interface
- Custom logo branding
- User-friendly navigation

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- bcrypt

---

## 📂 Project Structure

```bash
AI-Travel-Planner/
│── frontend/
│── backend/
│── README.md
```

## Clone the project

git clone [AI-Trip_Planner](https://github.com/mdharis98/AI-Trip-Planner.git)

cd AI-Travel-Planner

cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev


## .env file

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
