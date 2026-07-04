from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login



def signup(request):

    if request.method =="POST":

        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")


        user  = User.objects.create_user(
            username =username,
            email=email,
            password = password
        )
        user.save()

        return redirect("login")

    return render(request,"pages/signup.html")


def login(request):

    if request.method =="POST":

        username= request.POST.get("username")
        password = request.POST.get("password")




        user = authenticate(
            request,
            username =username,
            password =password
        )

        if user is not None:

            auth_login(
                request,
                user
            )

            return redirect("signup")

    return render(
        request,
        "pages/login.html"
    )