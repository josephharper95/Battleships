$(document).ready(function(){
    getTopTenUsersScoresByDifficulty();
});


function getTopTenUsersScoresByDifficulty(){
    //TODO NEH - Show table loader
    $.ajax({
        url: "../../Content/Pages/statisticsAjax.php",
        data: {
            action: "getTopTenUsersScoresByDifficulty"
        },
        type: "post",
        success: function(data){
            var parsed = JSON.parse(data);
            populateTopTenUsersScoresByDifficultyTable(parsed);
        },
        error: function(){
            alert("Something went wrong");
        },
        complete: function(){
            //TODO NEH - Hide table loader
        }
    });
}

function populateTopTenUsersScoresByDifficultyTable(data)
{
    var easy = data["easy"];
    var medium = data["medium"];
    var hard = data["hard"];
    var multiplayer = data["multiplayer"];
    var tableHTML = "";
    console.log(easy.length);

    for (var i = 0; i < 10; i++)
    {
        tableHTML += "<tr>";
        //Easy
        tableHTML += "<td>";
        if(!easy[i])
        {
            tableHTML += "N/A";
        }
        else
        {
            tableHTML += "<label>";
            tableHTML += easy[i].userID;
            tableHTML += "</label>";

            tableHTML += "<span>";
            tableHTML += easy[i].score;
            tableHTML += "</span>";
        }
        tableHTML += "</td>";

        //Medium
        tableHTML += "<td>";
        if(!medium[i])
        {
            tableHTML += "N/A";
        }
        else
        {
            tableHTML += "<label>";
            tableHTML += medium[i].userID;
            tableHTML += "</label>";

            tableHTML += "<span>";
            tableHTML += medium[i].score;
            tableHTML += "</span>";
        }
        tableHTML += "</td>";

        //Hard
        tableHTML += "<td>";
        if(!hard[i])
        {
            tableHTML += "N/A";
        }
        else
        {
            tableHTML += "<label>";
            tableHTML += hard[i].userID;
            tableHTML += "</label>";

            tableHTML += "<span>";
            tableHTML += hard[i].score;
            tableHTML += "</span>";
        }
        tableHTML += "</td>";

        //Multiplayer
        tableHTML += "<td>";
        if(!multiplayer[i])
        {
            tableHTML += "N/A";
        }
        else
        {
            tableHTML += "<label>";
            tableHTML += multiplayer[i].userID;
            tableHTML += "</label>";

            tableHTML += "<span>";
            tableHTML += multiplayer[i].score;
            tableHTML += "</span>";
        }
        tableHTML += "</td>";

        tableHTML += "</tr>";
    }

    $("#topTenScore tbody").html(tableHTML);
}