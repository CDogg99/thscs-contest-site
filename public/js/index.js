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
                    $("#loginResponse").html("Success");
                    var decoded = jwt_decode(data.token);
                    Cookies.set("token", data.token, {expires: 365});
                    Cookies.set("userType", decoded.userType, {expires: 365});
                    Cookies.set("_id", decoded._id, {expires: 365});
                }
            }
        });
        return false;
    });
});