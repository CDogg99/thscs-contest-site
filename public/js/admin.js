var token = Cookies.get("token");
var ip = "localhost";
var numTeams = 100;
var curTeam;
var showList=false;

if(token){
    if(jwt_decode(token).userType != "admin"){
        window.location.replace("team.html");
    }
}
else{
    window.location.replace("index.html");
}

$(document).ready(function(){
    for(var i = 0; i < numTeams; i++){
        $("#teamSelect").append($("<option></option>").attr("value", i+1).text(i+1));
    }
    loadTableData();

    $("#list-all").on("click",function(){
        if(!showList){
            loadAllTeamData(); 
            $(this).html("COLLAPSE");
            showList=true;
        }else{
            showList=false;
            $(this).html("LIST ALL");
            $("#forms-list").empty();
        }
    });
    
    $("#signOut").on("click", function(){
        Cookies.remove("token");
        window.location.replace("index.html");
    });

    $("#teamSelect").on("change", function(){
        $("#updateScoresResponse").html();
        loadTeamData();
    });

    $("#updateScoresForm").on("submit", function(){
        var update = {
            members:{
                m1:{
                    writtenScore: $("#m1wsIn").val()
                },
                m2:{
                    writtenScore: $("#m2wsIn").val()
                },
                m3:{
                    writtenScore: $("#m3wsIn").val()
                }
            },
            codingScore: $("#codingScoreIn").val()
        };
        console.log(JSON.stringify(update));
        $.ajax({
            url: "http://" + ip + ":80/api/users/" + curTeam._id,
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            headers: {
                "authorization": token
            },
            data: JSON.stringify(update),
            success: function(data){
                if(data.error){
                    $("#updateScoresResponse").html(data.error);
                }
                else{
                    if(data.success){
                        $("#updateScoresResponse").html("Update successful");
                    }
                    else{
                        $("#updateScoresResponse").html("Update failed");
                    }
                    loadTableData();
                }
            }
        });
        return false;
    });
});

function loadAllTeamData(){
    console.log("called");
    $("#forms-list").empty();
    var template="<span>Team @:</span><span id='updateScoresResponse@'></span><form id='updateScoresForm@'  class='list-form'><p>Written Scores</p><label for='m1wsIn@' id='m1@' ></label>";
    template+="<input type='text' id='m1wsIn@' ><label for='m2wsIn@' id='m2@' ></label><input type='text' id='m2wsIn@' ><label for='m3wsIn@' id='m3@' ></label>";
    template+="<input type='text' id='m3wsIn@' ><p>Coding Score</p><input type='text' id='codingScoreIn@'><input type='submit' id='button@'</form>";
    for(i=1;i<numTeams+1;i++){
        $.ajax({
        url: "http://" + ip + ":80/api/users/team" + i,
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        headers: {
            "authorization": token
        },
        success: function(data){
            if(data.error){
            }else{
                var i=parseInt(data.user.username.substring(4));
                var temp=template;
                temp=temp.replace(new RegExp(/@/,'g'),i);
                $("#forms-list").append(temp);
                $("#button"+i).on("click",function(){
                    var update = {
                        members:{
                            m1:{
                                writtenScore: $("#m1wsIn"+i).val()
                            },
                            m2:{
                                writtenScore: $("#m2wsIn"+i).val()
                            },
                            m3:{
                                writtenScore: $("#m3wsIn"+i).val()
                            }
                        },
                        codingScore: $("#codingScoreIn"+i).val()
                    };
                    $.ajax({
                        url: "http://" + ip + ":80/api/users/" + data._id,
                        type: "PUT",
                        contentType: "application/json",
                        dataType: "json",
                        headers: {
                            "authorization": token
                        },
                        data: JSON.stringify(update),
                        success: function(data){
                            if(data.error){
                                $("#updateScoresResponse"+i).html(data.error);
                            }
                            else{
                                if(data.success){
                                    $("#updateScoresResponse"+i).html("Update successful");
                                }
                                else{
                                    $("#updateScoresResponse"+i).html("Update failed");
                                }
                                loadTableData();
                            }
                        }
                    });
                    return false;   
                });
                data = data.user;
                curTeam = data;
                $("#m1"+i).html(data.members.m1.name);
                $("#m2"+i).html(data.members.m2.name);
                $("#m3"+i).html(data.members.m3.name);
                $("#m1wsIn"+i).val(data.members.m1.writtenScore);
                $("#m2wsIn"+i).val(data.members.m2.writtenScore);
                $("#m3wsIn"+i).val(data.members.m3.writtenScore);
                $("#codingScoreIn"+i).val(data.codingScore);
            }
        }
        });
    }
}

function loadTeamData(){
    var team = $("#teamSelect").val();
    if(team === "select"){
        $("#m1").html("");
        $("#m2").html("");
        $("#m3").html("");
        $("#updateScoresForm")[0].reset();
        curTeam = null;
        return;
    }
    $.ajax({
        url: "http://" + ip + ":80/api/users/team" + team,
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        headers: {
            "authorization": token
        },
        success: function(data){
            if(data.error){
                $("#updateScoresResponse").html(data.error);
            }
            else{
                data = data.user;
                curTeam = data;
                $("#m1").html(data.members.m1.name);
                $("#m2").html(data.members.m2.name);
                $("#m3").html(data.members.m3.name);
                $("#m1wsIn").val(data.members.m1.writtenScore);
                $("#m2wsIn").val(data.members.m2.writtenScore);
                $("#m3wsIn").val(data.members.m3.writtenScore);
                $("#codingScoreIn").val(data.codingScore);
            }
        }
    });
}

function loadTableData(){
    $.ajax({
        url: "http://" + ip + ":80/api/users",
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        headers: {
            "authorization": token
        },
        success: function(data){
            if(data.error){
                console.log("Failed to retrieve users");
            }
            else{
                $("#teamViewAdvanced tbody").empty();
                $("#teamViewNovice tbody").empty();
                $("#wsViewAdvanced tbody").empty();
                $("#wsViewNovice tbody").empty();
                data = data.users;
                var advancedTeams = [];
                var noviceTeams = [];
                var advancedWS = [];
                var noviceWS = [];
                for(var i = 0; i < data.length; i++){
                    var cur = data[i];
                    if(cur.admin){
                        continue;
                    }
                    else{
                        var members = cur.members;
                        var ws1 = members.m1.writtenScore;
                        var ws2 = members.m2.writtenScore;
                        var ws3 = members.m3.writtenScore;
                        var cs = cur.codingScore;
                        if(isNaN(ws1) || ws1 == null || ws1.trim() == ""){
                            ws1 = 0;
                        }
                        else{
                            ws1 = parseInt(ws1);
                        }
                        if(isNaN(ws2) || ws2 == null || ws2.trim() == ""){
                            ws2 = 0;
                        }
                        else{
                            ws2 = parseInt(ws2);
                        }
                        if(isNaN(ws3) || ws3 == null || ws3.trim() == ""){
                            ws3 = 0;
                        }
                        else{
                            ws3 = parseInt(ws3);
                        }
                        if(isNaN(cs) || cs == null || cs.trim() == ""){
                            cs = 0;
                        }
                        else{
                            cs = parseInt(cs);
                        }
                        cur.totalScore = ws1 + ws2 + ws3 + cs;
                        if(cur.division == "Advanced"){
                            advancedTeams.push(cur);
                            var m1a = {
                                name: cur.members.m1.name,
                                school: cur.school,
                                writtenScore: ws1
                            };
                            var m2a = {
                                name: cur.members.m2.name,
                                school: cur.school,
                                writtenScore: ws2
                            };
                            var m3a = {
                                name: cur.members.m3.name,
                                school: cur.school,
                                writtenScore: ws3
                            };
                            advancedWS.push(m1a, m2a, m3a);
                        }
                        else if(cur.division == "Novice"){
                            noviceTeams.push(cur);
                            var m1n = {
                                name: cur.members.m1.name,
                                school: cur.school,
                                writtenScore: ws1
                            };
                            var m2n = {
                                name: cur.members.m2.name,
                                school: cur.school,
                                writtenScore: ws2
                            };
                            var m3n = {
                                name: cur.members.m3.name,
                                school: cur.school,
                                writtenScore: ws3
                            };
                            noviceWS.push(m1n, m2n, m3n);
                        }
                    }
                }
                console.log(advancedWS);
                console.log(noviceWS);
                advancedTeams.sort(function(a, b){
                    return b.totalScore - a.totalScore;
                });
                noviceTeams.sort(function(a, b){
                    return b.totalScore - a.totalScore;
                });
                advancedWS.sort(function(a, b){
                    return b.writtenScore - a.writtenScore;
                });
                noviceWS.sort(function(a, b){
                    return b.writtenScore - a.writtenScore;
                });
                console.log(advancedWS);
                console.log(noviceWS);
                for(var f =0; f < advancedTeams.length; f++){
                    var curAd = advancedTeams[f];
                    curAd.username = curAd.username.substring(4);
                    var app = $("<tr>");
                    app.append($("<td>").text(curAd.school));
                    app.append($("<td>").text(curAd.username));
                    app.append($("<td>").text(curAd.members.m1.writtenScore));
                    app.append($("<td>").text(curAd.members.m2.writtenScore));
                    app.append($("<td>").text(curAd.members.m3.writtenScore));
                    app.append($("<td>").text(curAd.codingScore));
                    app.append($("<td>").text(curAd.totalScore));
                    $("#teamViewAdvanced").append(app);
                }
                for(var g =0; g < noviceTeams.length; g++){
                    var curNov = noviceTeams[g];
                    curNov.username = curNov.username.substring(4);
                    var app2 = $("<tr>");
                    app2.append($("<td>").text(curNov.school));
                    app2.append($("<td>").text(curNov.username));
                    app2.append($("<td>").text(curNov.members.m1.writtenScore));
                    app2.append($("<td>").text(curNov.members.m2.writtenScore));
                    app2.append($("<td>").text(curNov.members.m3.writtenScore));
                    app2.append($("<td>").text(curNov.codingScore));
                    app2.append($("<td>").text(curNov.totalScore));
                    $("#teamViewNovice").append(app2);
                }
                for(var z = 0; z < advancedWS.length; z++){
                    var curAdWS = advancedWS[z];
                    var app3 = $("<tr>");
                    app3.append($("<td>").text(curAdWS.name));
                    app3.append($("<td>").text(curAdWS.school));
                    app3.append($("<td>").text(curAdWS.writtenScore));
                    $("#wsViewAdvanced").append(app3);
                }
                for(var h = 0; h < noviceWS.length; h++){
                    var curNovWS = noviceWS[h];
                    var app4 = $("<tr>");
                    app4.append($("<td>").text(curNovWS.name));
                    app4.append($("<td>").text(curNovWS.school));
                    app4.append($("<td>").text(curNovWS.writtenScore));
                    $("#wsViewNovice").append(app4);
                }
            }
        }
    });
}