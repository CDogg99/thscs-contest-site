var token = Cookies.get("token");
var ip = "localhost";

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

    $("#teamUpdateForm").on("submit", function(){
        var update = {
            division: $("#divisionIn").val(),
            school: $("#schoolIn").val(),
            members: {
                m1: {
                    name: $("#m1nameIn").val()
                },
                m2: {
                    name: $("#m2nameIn").val()
                },
                m3: {
                    name: $("#m3nameIn").val()
                }
            }
        };
        $.ajax({
            url: "http://" + ip + ":80/api/users/" + jwt_decode(token)._id,
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            headers: {
                "authorization": token
            },
            data: JSON.stringify(update),
            success: function(data){
                if(data.error){
                    $("#teamUpdateResponse").html(data.error);
                }
                else{
                    if(data.success){
                        $("#teamUpdateResponse").html("Update successful");
                    }
                    else{
                        $("#teamUpdateResponse").html("Update failed");
                    }
                    loadTeamData();
                }
            }
        });
        return false;
    });

    loadTeamData();
});

function loadTeamData(){
    $.ajax({
        url: "http://" + ip + ":80/api/users/" + jwt_decode(token).username,
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

                //Set values in update form inputs
                $("#divisionIn").val(data.division);
                $("#schoolIn").val(data.school);
                $("#m1nameIn").val(data.members.m1.name);
                $("#m2nameIn").val(data.members.m2.name);
                $("#m3nameIn").val(data.members.m3.name);
            }
        }
    });
}