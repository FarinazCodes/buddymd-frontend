# BrainStation Capstone Project - BuddyMD - Medication Adherence Tracker (Frontend)

This project is a **React-based frontend** application built with **Vite** as part of a **Capstone Project for BrainStation**. It helps users track their medication adherence by integrating **data visualization, calendar features, and backend communication** to provide an efficient and user-friendly experience.

## 📌 Motivation

Medication non-adherence costs the healthcare system between **$100 to $290 billion annually**. More than **40% of the U.S. population** and **over 45% of Canadians** suffer from chronic diseases lasting at least six months or more.

By tracking medication adherence, users can ensure full recovery or determine if further treatment is needed. This project aims to simplify that process using an intuitive, responsive, and feature-rich frontend.

---

## 🚀 Tech Stack

### **Core Framework**
- [React](https://reactjs.org/)

### **Styling**
- [Sass](https://sass-lang.com/)

### **Data Visualization**
- [Chart.js](https://www.chartjs.org/)
- [React ChartJS 2](https://react-chartjs-2.js.org/)
- [Recharts](https://recharts.org/)

### **Features**
- [React Calendar](https://www.npmjs.com/package/react-calendar)

### **Backend Communication**
- [Axios](https://axios-http.com/)
- [Firebase](https://firebase.google.com/)

---

## ⚙️ Setup Instructions

### **1. Clone the Repository**
```bash
git clone https://github.com/FarinazCodes/buddymd-frontend.git
cd buddymd-frontend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start the Development Server**
```bash
npm run dev
```

### **4. Build for Production**
```bash
npm run build
```

### **5. Preview Production Build**
```bash
npm run preview
```
---

## 🔑 Environment Variables
To run this project, you need a **Twilio account** and **Firebase authentication**. Create a `.env` file and add:

```plaintext
VITE_TWILIO_ACCOUNT_SID=your-twilio-sid
VITE_TWILIO_AUTH_TOKEN=your-twilio-auth-token
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
HEALTH_API_BASE_URL=https://health.gov/myhealthfinder/api/v3/
VITE_API_URL=
PORT=
```

---

## 🔗 Backend Repository
This project works alongside a backend service. You can find the backend code here:
**[BuddyMD Backend](https://github.com/FarinazCodes/buddymd-backend)**

---
## 👨‍💻 Author
- **Farinaz** - [GitHub Profile](https://github.com/FarinazCodes)

This project was developed as part of the **Capstone Project for BrainStation**. Feel free to report issues, or suggest improvements!

