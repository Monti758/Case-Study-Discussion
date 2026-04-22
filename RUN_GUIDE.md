# Execution Guide: CaseStudy Platform 🚀

This guide explains how to set up and run the CaseStudy Platform on your local machine.

> [!IMPORTANT]
> **Special Note for Windows Users (PowerShell)**
> If you see an error like *"running scripts is disabled on this system"* when trying to run `npm` or activate your virtual environment, run this command **once** in your terminal to unlock it:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
> ```

---

## 🛠 Manual Installation (Development)

Follow these steps to run the services separately for development.

### 1. Start the Backend (FastAPI)
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and Activate a virtual environment:
   ```powershell
   python -m venv venv
   # On Windows (PowerShell):
   # If you get an 'Execution Policy' error, run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   .\venv\Scripts\Activate.ps1
   
   # On Windows (Command Prompt):
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   python -m uvicorn main:app --reload
   ```
   *The backend will be live at `http://localhost:8000`.*

### 2. Start the Frontend (React + Vite)
1. Open a **new terminal** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm.cmd install
   ```
3. Start the development server:
   ```bash
   npm.cmd run dev
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
