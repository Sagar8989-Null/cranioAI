# CranioAI

CranioAI is an AI-powered facial analysis platform that helps users explore facial symmetry, visualize 3D facial structure, and receive personalized recommendations. The project combines a React/Vite frontend with a Django REST API to deliver a modern, full-stack experience for analyzing and tracking facial symmetry over time.

## Overview

CranioAI includes:

- AI-powered facial symmetry analysis
- 3D face visualization with interactive viewing
- Personalized exercise and treatment recommendations
- Progress tracking and history for previous analyses
- Secure user authentication and profile management

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Three.js / React Three Fiber
- Recharts
- Axios

### Backend
- Django
- Django REST Framework
- JWT authentication
- SQLite (development)
- OpenCV, MediaPipe, NumPy, SciPy, and related computer vision libraries

## Project Structure

- [Backend/](Backend/) - Django backend and API
- [Frontend/](Frontend/) - React/Vite frontend
- [requirements.txt](requirements.txt) - Root Python dependencies

## Prerequisites

Before running the project locally, make sure you have:

- Python 3.10+ or newer
- Node.js 18+ and npm
- A virtual environment tool such as `venv`

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
5. Create a superuser (optional, for Django admin access):
   ```bash
   python manage.py createsuperuser
   ```
6. Start the backend server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at:
- http://127.0.0.1:8000

## Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at:
- http://127.0.0.1:5173

## Development Notes

- The frontend expects the backend to be running on `http://localhost:8000` for API requests.
- The Django settings are configured to allow requests from `http://localhost:5173` during development.
- Media files are served from the backend under the `/media/` route.

## Common Commands

### Backend
```bash
cd Backend
python manage.py migrate
python manage.py runserver
python manage.py createsuperuser
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
npm run build
```

## License

This project does not currently include a license file. If you plan to distribute or reuse it publicly, add an appropriate open-source license.
