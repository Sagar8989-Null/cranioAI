from django.db.models import Avg, Max
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from analysis.models import AnalysisHistory
from accounts.models import UserProfile
from .serializers import HistorySerializer


class DashboardAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        history = AnalysisHistory.objects.filter(
            user=request.user
        ).order_by("-created_at")

        stats = history.aggregate(
            average_score=Avg("overall_score"),
            best_score=Max("overall_score")
        )

        recent_uploads = history[:5]

        graph = [
            {
                "date": item.created_at.strftime("%Y-%m-%d"),
                "score": item.overall_score
            }
            for item in history.order_by("created_at")
        ]

        profile, _ = UserProfile.objects.get_or_create(user=request.user)

        return Response({
            "user":{
                "username":request.user.username,
                "email":request.user.email,
                "profile_image":profile.profile_image.url if profile.profile_image else None,
                "full_name": profile.full_name,
                "phone_number": profile.phone_number,
                "location": profile.location,
                "about": profile.about,
            },

            "stats":{
                "total_uploads":history.count(),
                "average_score":stats["average_score"],
                "best_score":stats["best_score"],
                "latest_score":history.first().overall_score if history.exists() else None
            },

            "graph":graph,
            
            "recent_uploads":[
                {
                    "id":item.id,
                    "overall_score":item.overall_score,
                    "uploaded_image":item.uploaded_image.url,
                    "created_at":item.created_at
                }
                for item in recent_uploads
            ]
        })
        
class HistoryAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        history = AnalysisHistory.objects.filter(
            user=request.user
        )

        serializer = HistorySerializer(
            history,
            many=True
        )

        return Response(serializer.data)