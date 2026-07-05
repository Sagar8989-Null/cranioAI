from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages


def signup(request):

    if request.method == "POST":

        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        user.save()

        return redirect("login")

    return render(request, "pages/signup.html")


def login(request):

    if request.method == "POST":

        email = request.POST.get("email")
        password = request.POST.get("password")

        user_obj = User.objects.filter(
            email=email
        ).first()

        if user_obj is not None:

            user = authenticate(
                request,
                username=user_obj.username,
                password=password
            )

            if user is not None:

                auth_login(
                    request,
                    user
                )

                return redirect("dashboard")

            else:
                messages.error(
                    request,
                    "Wrong password"
                )

        else:
            messages.error(
                request,
                "Email not found"
            )

    return render(
        request,
        "pages/login.html"
    )


def dashboard(request):

    return render(
        request,
        "pages/dashboard.html"
    )