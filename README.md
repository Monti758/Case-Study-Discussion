# CaseStudy Platform 🎓

A premium, full-stack interactive platform designed for academic and professional environments. It allows instructors to publish complex business scenarios and students to submit analytical responses, fostering a cycle of deep discussion and expert feedback.

![Platform Preview](https://via.placeholder.com/1200x600/030712/818cf8?text=CaseStudy+Platform+v2.0)

## 🚀 Quick Start (with Docker)

The easiest way to get the platform running is using Docker Compose.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Monti758/Case-Study-Discussion.git
   cd Case-Study-Discussion
   ```

2. **Launch with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Access the App**:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ✨ Key Features

### 👨‍🏫 Instructor Portal
- **Create Scenarios**: Publish rich text business case studies with titles and detailed descriptions.
- **Manage Content**: Archive old case studies to keep the dashboard clean.
- **Provide Feedback**: Review student submissions and provide direct, actionable feedback.
- **Analytics**: View real-time stats on active vs. archived scenarios.

### 🎓 Student Portal
- **Discover Scenarios**: Browse active case studies published by instructors.
- **Submit Analysis**: Draft and submit detailed strategic solutions to business problems.
- **Track Progress**: Monitor the status of submissions and view instructor feedback once received.
- **Interactive UI**: Premium glassmorphism interface with smooth animations and responsive design.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Styling**: Vanilla CSS (Premium Glassmorphism System)
- **Icons**: [Lucide-React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **API Client**: [Axios](https://axios-http.com/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **Database**: [SQLite](https://www.sqlite.org/) (Local file-based)
- **Middleware**: CORS enabled for seamless frontend integration.

### Dev & Deployment
- **Containerization**: [Docker](https://www.docker.com/) & Docker Compose
- **Version Control**: Git

---

## 📂 Project Structure

```text
Case-Study-Discussion/
├── backend/            # FastAPI Python server
│   ├── main.py         # Entry point & API routes
│   ├── models.py       # SQLAlchemy database models
│   ├── schemas.py      # Pydantic data schemas
│   ├── crud.py         # Database operations
│   └── database.py     # SQL engine configuration
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── components/ # Modular UI components
│   │   ├── App.jsx     # Main application logic & routing
│   │   └── index.css   # Global styles & Design System
│   └── Dockerfile      # Frontend container build script
├── docker-compose.yml  # Multi-container orchestration
└── README.md           # You are here!
```

---

## 📖 Learn More
For a detailed breakdown of the application workflow and technical architecture, check out:
- [**RUN_GUIDE.md**](./RUN_GUIDE.md) - **Full instructions on how to run the project.**
- [**WORKFLOW.md**](./WORKFLOW.md) - How the system works step-by-step.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
