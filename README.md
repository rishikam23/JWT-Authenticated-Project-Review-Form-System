# JWT-Authenticated-Project-Review-Form-System

A secure, full-stack web application built as part of my internship at **Filix Consulting Pvt. Ltd.**. This project demonstrates **JWT-based authentication**, protected routes, and a dynamic project review form system designed for managing revenue-related data.

---

## Features

### Authentication
- Login system using **JWT (JSON Web Tokens)**.
- Tokens expire after 5 minutes of inactivity.
- Protected frontend routes based on token validity.
- Tokens stored securely in `localStorage`.

### Project Review Form
- Post-login access to a **project review form**.
- Dynamic fields to enter project name, date, revenue, and progress.
- Buttons to **Save** and **View History** of project entries.
- Clean, modular UI with form validation and scrollable tables.

### Frontend
- Built with **React.js**, **HTML5**, **CSS**, and **Bootstrap**.
- Navigation handled by `react-router-dom`.
- Icon support using `react-icons`.
- Responsive and mobile-friendly design.

### 🛠Backend
- Developed with **Node.js** and **Express.js**.
- Token generation and verification using `jsonwebtoken`.
- Middleware-based route protection.
- CORS enabled for secure frontend-backend communication.

---

## Getting Started

### Prerequisites
- Node.js and npm installed
- Basic knowledge of React and Express

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rishikam23/JWT-Authenticated-Project-Review-Form-System.git
   cd JWT-Authenticated-Project-Review-Form-System
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   node index.js
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

---

## Future Improvements

- Replace hardcoded credentials with a database like MongoDB or PostgreSQL.
- Add role-based access control (admin, editor).
- Improve token refresh logic for longer sessions.

---

## License

This project was built during an internship and is for educational/demo purposes only.

---
