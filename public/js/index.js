var token = Cookies.get("token");

if(token){
    if(jwt_decode(token).userType=="team"){
        window.location.replace("team.html");
    }
    else if(jwt_decode(token).userType=="admin"){
        window.location.replace("admin.html");
    }
}

$(document).ready(function(){
    //Events
    $("#loginForm").on("submit", function(){
        var user = {
            username: $("#username").val(),
            password: $("#password").val()
        };
        $.ajax({
            url: "http://localhost:3000/api/users/authenticate",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(user),
            success: function(data){
                if(data.error){
                    $("#loginResponse").html(data.error);
                }
                else{
                    var decoded = jwt_decode(data.token);
                    Cookies.set("token", data.token, {expires: 365});
                    if(decoded.userType == "team"){
                        window.location.replace("team.html");
                    }
                    else if(decoded.userType == "admin"){
                        window.location.replace("admin.html");
                    }
                }
            }
        });
        return false;
    });
});