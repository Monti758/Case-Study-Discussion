# Execution Guide: CaseStudy Platform 🚀

There are two ways to run the CaseStudy Platform: using **Docker** (recommended) or **Manual Installation**.

---

## Method 1: Using Docker (Recommended)
This method handles all dependencies and networking automatically.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Steps
1. Open your terminal in the root directory (`Case-Study-Discussion`).
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. Wait for the containers to start.
4. Open your browser:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Method 2: Manual Installation (Development)
Use this method if you want to run the services without Docker for active development.

### 1. Start the Backend (FastAPI)
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will be live at `http://localhost:8000`.*

### 2. Start the Frontend (React + Vite)
1. Open a **new terminal** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be live at `http://localhost:5173`.*

---

## 💡 Troubleshooting

### Port Conflicts
If you see an error like `Address already in use`, make sure ports **5173** and **8000** are free on your machine.

### API Connection Issues
The frontend is configured to look for the backend at `http://localhost:8000`. If you run the backend on a different port, update the `frontend/src/api.js` file.

### Database Reset
The project uses a local SQLite file (`backend/sql_app.db`). To reset the database, simply delete this file and restart the backend; it will recreate the schema and seed the data automatically.
