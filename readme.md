<div align="center">

# 🧠 CranioAI

### AI-Powered Facial Symmetry Analysis & 3D Visualization

*Understand your facial structure like never before — powered by computer vision, delivered through a modern full-stack experience.*

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Fast_Build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Django](https://img.shields.io/badge/Django-REST_API-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Rendering-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![OpenCV](https://img.shields.io/badge/OpenCV-Computer_Vision-5C3EE8?logo=opencv&logoColor=white)](https://opencv.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Landmark_Detection-00A98F?logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![License](https://img.shields.io/badge/License-Not_Yet_Added-lightgrey)](#-license)

</div>

---

## ✨ What is CranioAI?

CranioAI turns a face into data. It combines **facial landmark detection**, **3D reconstruction**, and **symmetry scoring** to give users a clear, visual picture of their facial structure — then tracks how it changes over time and suggests personalized exercises to support their goals.

Under the hood, a **React + Vite** frontend delivers a fast, interactive experience, while a **Django REST API** handles authentication, data persistence, and the heavy lifting of computer vision analysis via **OpenCV**, **MediaPipe**, **NumPy**, and **SciPy**.

> Built for anyone curious about facial symmetry — from casual users to researchers exploring craniofacial analysis.

---

## 🚀 Features

| | |
|---|---|
| 🎯 **AI Symmetry Analysis** | Automated facial landmark detection and region-wise symmetry scoring |
| 🌀 **3D Face Visualization** | Interactive, rotatable 3D face rendering powered by Three.js / React Three Fiber |
| 💡 **Personalized Recommendations** | Tailored exercise and treatment suggestions based on individual analysis |
| 📈 **Progress Tracking** | Full history of past analyses with visual trends via Recharts |
| 🔐 **Secure Authentication** | JWT-based auth with full profile management |

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- ⚛️ React 18
- ⚡ Vite
- 🧭 React Router
- 🎨 Three.js / React Three Fiber
- 📊 Recharts
- 🌐 Axios

</td>
<td valign="top" width="50%">

**Backend**
- 🐍 Django
- 🔌 Django REST Framework
- 🔑 JWT Authentication
- 🗄️ SQLite (development)
- 👁️ OpenCV, MediaPipe, NumPy, SciPy

</td>
</tr>
</table>

---

## 📂 Project Structure

```
CranioAI/
├── Backend/            # Django backend and API
├── Frontend/           # React/Vite frontend
└── requirements.txt    # Root Python dependencies
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- 🐍 Python 3.10+
- 🟢 Node.js 18+ and npm
- 📦 A virtual environment tool such as `venv`

### 1️⃣ Backend Setup

```bash
# Navigate to the backend directory
cd Backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# (Optional) Create a superuser for Django admin access
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

✅ Backend live at → **http://127.0.0.1:8000**

### 2️⃣ Frontend Setup

Open a new terminal:

```bash
# Navigate to the frontend directory
cd Frontend

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

✅ Frontend live at → **http://127.0.0.1:5173**

---

## 📝 Development Notes

- The frontend expects the backend to be running on `http://localhost:8000` for API requests.
- Django settings are configured to allow requests from `http://localhost:5173` during development.
- Media files are served from the backend under the `/media/` route.

---

## 📌 Common Commands

<table>
<tr>
<td valign="top" width="50%">

**Backend**
```bash
cd Backend
python manage.py migrate
python manage.py runserver
python manage.py createsuperuser
```

</td>
<td valign="top" width="50%">

**Frontend**
```bash
cd Frontend
npm install
npm run dev
npm run build
```

</td>
</tr>
</table>

---

## 🗺️ Roadmap

- [ ] Add automated test coverage for backend analysis pipeline
- [ ] Deploy live demo
- [ ] Add screenshots / demo GIF to this README
- [ ] Publish an open-source license

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project does not currently include a license file. If you plan to distribute or reuse it publicly, please add an appropriate open-source license.

---

<div align="center">

*If CranioAI sparked your interest, consider ⭐ starring the repo!*

</div>
