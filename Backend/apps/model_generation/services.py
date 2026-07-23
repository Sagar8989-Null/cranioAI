import os
import uuid
import requests
import trimesh
from django.conf import settings


class FaceModelGenerator:

    @staticmethod
    def generate_face_model(image_path):

        FASTAPI_URL = "http://127.0.0.1:8001/generate"

        with open(image_path, "rb") as image:
            response = requests.post(
                FASTAPI_URL,
                files={"file": image},
                timeout=300,
            )

        response.raise_for_status()

        obj_filename = f"{uuid.uuid4()}.obj"

        obj_path = os.path.join(
            settings.MEDIA_ROOT,
            "generated_models",
            obj_filename,
        )

        os.makedirs(os.path.dirname(obj_path), exist_ok=True)

        with open(obj_path, "wb") as f:
            f.write(response.content)

        # Convert OBJ → GLB
        mesh = trimesh.load(obj_path, force="mesh")

        glb_filename = f"{uuid.uuid4()}.glb"

        glb_path = os.path.join(
            settings.MEDIA_ROOT,
            "generated_models",
            glb_filename,
        )

        mesh.export(glb_path)

        # Optional: remove OBJ if you don't need it
        os.remove(obj_path)

        return {
            "success": True,
            "model_path": f"media/generated_models/{glb_filename}"
        }