import os
import traceback

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import ImageUploadSerializer

from apps.symmetry_analysis.services import (SymmetryAnalysisService)
from apps.model_generation.services import (FaceModelGenerator)

class AnalyzeAndGenerateAPIView(APIView):

    def post(self, request):

        serializer = ImageUploadSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        image_file = serializer.validated_data["image"]

        upload_dir = "media/uploads"
        os.makedirs(upload_dir, exist_ok=True)

        image_path = os.path.join(
            upload_dir,
            image_file.name
        )

        with open(image_path, "wb+") as destination:
            for chunk in image_file.chunks():
                destination.write(chunk)

        service = SymmetryAnalysisService()

        generator_service = FaceModelGenerator()
        
        try:
            symmetry_result = service.analyze(image_path)
            model_result = generator_service.generate_face_model(image_path)
        except Exception as e:
            traceback.print_exc()
            return Response(
                { "success": False,
                    "error": str(e) },
                status=500)

        base_url = request.build_absolute_uri("/")[:-1]

        response_data = {
            "success": True,
            "symmetry_analysis": {
                **symmetry_result,
                "heatmap_image": f"{base_url}/{symmetry_result['heatmap_image']}",
                "overlay_image": f"{base_url}/{symmetry_result['overlay_image']}"
            },
            "generated_model": {
                "glb_url": f"{base_url}/{model_result['model_path']}"
            }
        }

        # print(response_data)

        return Response(response_data)