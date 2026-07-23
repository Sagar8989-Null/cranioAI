import subprocess
from pathlib import Path
from fastapi import FastAPI, UploadFile, File
import shutil
import uuid
from fastapi.responses import FileResponse

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
ARCFACE_DIR = BASE_DIR / "temp_arcface"
FUKA_DIR = BASE_DIR / "FUKA"

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)
ARCFACE_DIR.mkdir(exist_ok=True)


@app.get("/")
def home():
    return {
        "status": "running"
    }


@app.post("/generate")
async def generate(file: UploadFile = File(...)):

    filename = f"{uuid.uuid4()}{Path(file.filename).suffix}"

    image_path = UPLOAD_DIR / filename

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    stem = image_path.stem

    command = [
        "python",
        "demo.py",
        "-i",str(image_path),
        "-o",str(OUTPUT_DIR),
        "-a",str(ARCFACE_DIR),
    ]

    result = subprocess.run(
        command,
        cwd=FUKA_DIR,
        capture_output=True,
        text=True,
    )

    mesh_path = OUTPUT_DIR / stem / "mesh.obj"

    if result.returncode != 0:
        return {
            "success": False,
            "error": result.stderr
        }

    mesh_path = OUTPUT_DIR / stem / "mesh.obj"

    return FileResponse(
        mesh_path,
        filename="mesh.obj",
        media_type="application/octet-stream"
    )