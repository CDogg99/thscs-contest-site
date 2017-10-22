var token = Cookies.get("token");

if(token){
    if(jwt_decode(token).userType != "admin"){
        window.location.replace("team.html");
    }
}
else{
    window.location.replace("index.html");
}

$(document).ready(function(){
    $("#signOut").on("click", function(){
        Cookies.remove("token");
        window.location.replace("index.html");
    });
});