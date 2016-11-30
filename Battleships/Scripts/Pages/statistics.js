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
        if(!easy[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(easy[i].userID, easy[i].score);
        }

        //Medium
        if(!medium[i])
        {
            tableHTML += "</td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(medium[i].userID, medium[i].score);
        }

        //Hard
        if(!hard[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(hard[i].userID, hard[i].score);
        }

        //Multiplayer
        if(!hard[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(multiplayer[i].userID, multiplayer[i].score);
        }

        tableHTML += "</tr>";
    }

    $("#topTenScore tbody").html(tableHTML);
}

function twoItemTableCell(item1, item2) {
    var tableHTML = "<td>";

    tableHTML += "<label>";
    tableHTML += item1;
    tableHTML += "</label>";

    tableHTML += "<span>";
    tableHTML += item2;
    tableHTML += "</span>";

    tableHTML += "</td>";

    return tableHTML;
}