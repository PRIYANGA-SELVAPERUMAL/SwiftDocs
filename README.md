
# 📚 SwiftDocs — Automated Academic Document Management & PDF Generation System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]()

---

## 📌 Table of Contents  
1. [Overview](#overview)  
2. [Motivation](#motivation)  
3. [Features](#features)  
4. [Architecture & Workflow](#architecture--workflow)  
5. [Tech Stack](#tech-stack)  
6. [Screenshots / Demo](#screenshots--demo)  
7. [Setup & Installation](#setup--installation)  
8. [Usage](#usage)  
9. [Future Enhancements](#future-enhancements)  

---

<a name="overview"></a>
## 📖 Overview  
SwiftDocs is a full-stack web solution for academic institutions, designed to digitize the document request and issuance process. Students submit requests online, faculty verify them, and administrators approve & issue official documents in PDF format — all through a seamless, secure workflow.

<a name="motivation"></a> 
## 💡 Motivation  
In many colleges and universities, students must physically visit offices and wait days or weeks just to get official documents. This process is prone to delays, mismanagement, and lack of transparency. SwiftDocs aims to modernize this process, reducing delays, increasing transparency, and automating document generation.

<a name="motivation"></a> 
## ✨ Features  
- 🧑‍🎓 Student dashboard: submit requests, upload proof, track status, download PDFs  
- 👩‍🏫 Verifier portal: view & validate student requests, approve or reject with remarks  
- 🏛️ Admin interface: review verified requests, approve for final issuance  
- 🔐 Secure login & role-based access using JWT  
- 📂 File uploads (proof documents) via Multer  
- 📄 Automatic PDF generation using standardized templates via PDFKit  

---

<a name="architecture-workflow"></a>  
## ⚙️ Architecture & Workflow  

**High-Level Flow:**  
1. Student logs in and raises a document request → status “Pending”.  
2. Verifier logs in, reviews, and updates status to “Reviewed” or “Rejected”.  
3. Admin logs in, approves the “Reviewed” requests → triggers PDF generation.  
4. Student can then download the approved certificate. 

### 🔹 System Architecture  
Frontend (React.js + Tailwind) → Backend (Node.js + Express) → Database (MongoDB)  
                ↳ Authentication: JWT  
                ↳ File Uploads: Multer  
                ↳ PDF Generation: PDFKit  


### 🔹 Workflow  
Student → submits request → Verifier → reviews & approves/rejects → Admin → final approval → PDF generated → Student downloads certificate


---

<a name="tech-stack"></a> 
## 🛠️ Tech Stack  
| Layer        | Technology        | Purpose / Role                            |
|---------------|--------------------|--------------------------------------------|
| Frontend      | React.js, Tailwind CSS | UI & client-side logic                   |
| Backend       | Node.js, Express    | REST API, server logic                    |
| Database      | MongoDB, Mongoose   | Persistent data storage                   |
| Authentication| JWT                 | Secure login + role-based access           |
| File Upload   | Multer              | Handle proof document uploads              |
| PDF Generation| PDFKit              | Generate final documents in PDF format     |

---

<a name="screenshots"></a> 
## 📸 Screenshots / Demo

## 🔑 Login Page
<img width="1918" height="945" alt="image" src="https://github.com/user-attachments/assets/f44fe659-3541-496a-b871-8fb9d40df597" />

## 👩‍🎓 Student Views

### 🔹Student Dashboard 
<img width="1919" height="947" alt="image" src="https://github.com/user-attachments/assets/d3899f42-1537-4faa-908c-d5924b88141c" />

### 🔹Request Submission Form 
<img width="1914" height="942" alt="image" src="https://github.com/user-attachments/assets/7560cfb3-1efa-42b8-b6b2-78e5185adccd" />

### 🔹Tracking Requests Page  
<img width="1916" height="945" alt="image" src="https://github.com/user-attachments/assets/343a6661-f8de-446d-b8ff-7ae1c9bfe306" />
<img width="1916" height="942" alt="image" src="https://github.com/user-attachments/assets/3ed00374-7a2f-4bdf-b7b5-7daf14a6f48d" />

## ✅ Verifier Views

### 🔹Verifier Dashboard 
<img width="1919" height="947" alt="image" src="https://github.com/user-attachments/assets/360ee746-322f-4d5c-9d26-199f525ed46a" />

### 🔹Pending Requests
<img width="1919" height="953" alt="image" src="https://github.com/user-attachments/assets/9aed7767-bed4-4da6-a729-5ac9847320e2" />

### 🔹Reviewed Requests

  <img width="1916" height="945" alt="image" src="https://github.com/user-attachments/assets/d43e1f08-4b12-45b3-beb4-2bce80721bf5" />

### 🔹Rejected Requests
<img width="1919" height="941" alt="image" src="https://github.com/user-attachments/assets/7c23f5be-3b67-405c-91c1-fd19b545e6ee" />



## 🛠️ Admin Dashboard
 <img width="1917" height="944" alt="image" src="https://github.com/user-attachments/assets/3e6da069-89e2-4fa4-a010-74811fb8b4e0" />


## 📜 Generated Certificate (PDF) 

<img width="1914" height="938" alt="image" src="https://github.com/user-attachments/assets/1168b1dd-ac27-41cb-93c4-f9663bd133fc" />


---

<a name="installation"></a> 
## 🚀 Setup & Installation  

### 1. Clone the repository  
```bash
git clone https://github.com/PRIYANGA-SELVAPERUMAL/SwiftDocs.git  
cd SwiftDocs
````

---

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install
```

```bash
# Frontend
cd ../frontend
npm install
```

---

### 3. Configure Environment

Create a `.env` file in the `backend/` folder with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

### 4. Run the Application

```bash
# Start backend
cd backend
npm start
```

```bash
# Start frontend
cd ../frontend
npm start
```

App runs at: **[http://localhost:3000](http://localhost:3000)**


---

<a name="usage"></a>  
## 👩‍💻 Usage

| Role     | Capabilities                                              |
| -------- | --------------------------------------------------------- |
| Student  | Raise requests, upload proof, check status, download PDFs |
| Verifier | Review student requests, approve/reject                   |
| Admin    | Final approval, issue documents via PDF generation        |

---

<a name="future-enhancements"></a>  
## 🔮 Future Enhancements

* Email / SMS notifications for status updates
* Mobile app version (Android / iOS)
* Blockchain-based tamper-proof certificate system
* Analytics dashboard for admin (request trends, stats)
* Support for multiple institutions (multi-tenant model)

---

**Author:** Priyanga Selvaperumal 


