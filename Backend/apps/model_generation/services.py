import cv2
import mediapipe as mp
import numpy as np
import trimesh
import os
import uuid


class FaceModelGenerator:

    def __init__(self):

        self.face_mesh = mp.solutions.face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=False,
            min_detection_confidence=0.5
        )
        
        self.canonical = trimesh.load(
            "media/models/canonical_face_model.obj",
            process=False
        )
        
        self.faces = self.canonical.faces

    def generate(self, image_path):

        image = cv2.imread(image_path)

        if image is None:
            raise ValueError("Could not load image")

        rgb = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        results = self.face_mesh.process(rgb)

        if not results.multi_face_landmarks:
            raise ValueError("No face detected")

        face_landmarks = (
            results.multi_face_landmarks[0]
        )
        
        h, w, _ = image.shape

        vertices = []

        for lm in face_landmarks.landmark:

            # x = lm.x * w
            # y = (1.0 - lm.y) * h

            # # mediapipe z depth
            # z = lm.z * w
            
            x = (lm.x-0.5)
            y = -(lm.y-0.5)
            z = lm.z

            vertices.append([x, y, z])

        vertices = np.array(vertices, dtype=np.float32)

        # faces = np.array(
        #     list(mp.solutions.face_mesh.FACEMESH_TESSELATION)
        # )
        
        faces = self.faces
        faces = np.flip(faces, axis=1)
        
        pc = trimesh.points.PointCloud(vertices)
        pc.export("landmarks.ply")
        
        
        print(faces.shape)
        print(vertices.shape)
        print(self.faces.shape)
        print(self.faces.max())
        print(self.faces[:10])

        mesh = trimesh.Trimesh(
            vertices=vertices,
            faces=faces,
            process=False
            # process=True
        )
        
        mesh.fix_normals()

        os.makedirs(
            "media/generated_models",
            exist_ok=True
        )

        file_id = str(uuid.uuid4())

        glb_path = (
            f"media/generated_models/{file_id}.glb"
        )

        mesh.export(glb_path)

        return {
            "model_path": glb_path,
            "vertices": len(vertices),
            "faces": len(faces)
        }