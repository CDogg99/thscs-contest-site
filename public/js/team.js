var token = Cookies.get("token");

if(token){
    if(jwt_decode(token).userType != "team"){
        window.location.replace("admin.html");
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

    loadTeamData();
});

function loadTeamData(){
    $.ajax({
        url: "http://localhost:3000/api/users/" + jwt_decode(token).username,
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        headers: {
            "authorization": token
        },
        success: function(data){
            if(data.error){
                console.log("Error retrieving team information");
            }
            else{
                data = data.user;
                if(!data.codingScore){
                    data.codingScore = "N/A";
                }
                if(!data.members.m1.writtenScore){
                    data.members.m1.writtenScore = "N/A";
                    data.members.m2.writtenScore = "N/A";
                    data.members.m3.writtenScore = "N/A";
                }
                $("#team").html(data.username);
                $("#division").html(data.division);
                $("#school").html(data.school);
                $(".m1").html(data.members.m1.name);
                $(".m2").html(data.members.m2.name);
                $(".m3").html(data.members.m3.name);
                $("#ws1").html(data.members.m1.writtenScore);
                $("#ws2").html(data.members.m2.writtenScore);
                $("#ws3").html(data.members.m3.writtenScore);
                $("#codingScore").html(data.codingScore);
            }
        }
    });
}