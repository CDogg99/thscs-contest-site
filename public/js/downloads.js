var token = Cookies.get("token");

if(!token){
    window.location.replace("index.html");
}

$(document).ready(function(){
    $("#signOut").on("click", function(){
        Cookies.remove("token");
        window.location.replace("index.html");
    });
});