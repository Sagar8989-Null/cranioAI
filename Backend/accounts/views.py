from django.http import JsonResponse
from django.contrib.auth.models import User 
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
import requests
import json




@csrf_exempt 
def signup(request):

    if request.method == "POST":

        data = json.loads(request.body)

        username = data["username"]
        email = data["email"]
        password = data["password"]

        if User.objects.filter(username = username).exists():
            return JsonResponse({
                "message":"Username already exists"
            })

        User.objects.create_user(
            username = username,
            email = email,
            password = password
        )

        return JsonResponse({
            "message":"User created Successfully"
        })
    
    return JsonResponse({
        "message":"Invaild Request"
    })

@csrf_exempt
def login(request):

    if request.method == "POST":

        data = json.loads(request.body)

        email = data["email"]
        password = data["password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({
                "message": "Email not found" 
            })

        authenticated_user = authenticate(
            username = user.username,
            password = password
        )
        
        if authenticated_user is not None:

            refresh = RefreshToken.for_user(authenticated_user)

            return JsonResponse({
            "message": "Login Successful",
            "username": authenticated_user.username,
            "email": authenticated_user.email,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            })
            


        return JsonResponse({
            "message": "Invalid Username or Password"
        })

    return JsonResponse({
        "message": "Invalid Request"
    })

@csrf_exempt
def google_login(request):

    if request.method == "POST":

        data = json.loads(request.body)

        access_token = data.get("access_token")

        response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )

        if response.status_code != 200:
            return JsonResponse({
                "message": "Invalid Google Token"
            })

        google_user = response.json()

        email = google_user["email"]
        name = google_user["name"]

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            username = email.split("@")[0]

            user = User.objects.create_user(
                username=username,
                email=email,
                password=None
            )

            user.first_name = name
            user.save()

        refresh = RefreshToken.for_user(user)

        return JsonResponse({
            "message": "Google Login Successful",
            "username": user.username,
            "email": user.email,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

    return JsonResponse({
        "message": "Invalid Request"
    })