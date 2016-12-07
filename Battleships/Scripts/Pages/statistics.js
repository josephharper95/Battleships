/**
 * 
 * Last Modified By: Joe Harper
 * 
 * V0.1     Nick / Joe  30/11/16    initial creation
 * V0.11    Nick        30/11/16    added helper method 
 * V0.2     Joe         01/12/16    created relevant get/populate methods and added them to .ready function
 * V0.3     Nick        03/12/16    added ability to change page   
 * V0.4     Nick        03/12/16    added top ten accuracy
 * V0.41    Nick        07/12/16    updated menu to be variable
 * 
 */

var menu = "#folderMenu";

$(document).ready(function(){
    getTopTenUsersScoresByDifficulty();
    getTopTenUsersHighScoresByDifficulty();
    getTopTenUsersWinsByDifficulty();
    getTopTenUsersGamesPlayedByDifficulty();
    getTopTenUsersTotalShotsFiredByDifficulty();
    getTopTenUsersTotalShotsHitByDifficulty();
    getTopTenUsersTotalHitsReceivedByDifficulty();
    getTopTenUsersTotalPlayingTimeByDifficulty();
    getTopTenUsersHitAccuracyByDifficulty();

    $(menu + " button[data-selected=false]").on("click", function () {
        
        var button = $(this);
        var page = button.data("page");

        changePage(page);
    });
});

function changePage(page) {

    $(".subPage:visible").fadeOut(100, function () {
        $(".subPage[data-page=" + page + "]").fadeIn(100);
    });

    $(menu + " button").attr("data-selected", "false");
    $(menu + " button[data-page=" + page + "]").attr("data-selected", "true");

    $(menu + " button[data-selected=false]").off("click").on("click", function () {
        
        var button = $(this);
        var page = button.data("page");

        changePage(page);
    });

    dropdowns();
}


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

function dropdowns() {
    $("[data-page=all-scores] select").change(function () {
        allScoresDropDownChange();
    });

    $("[data-page=all-games] select").change(function () {
        allGamesDropDownChange();
    });

    $("[data-page=all-shots] select").change(function () {
        allShotsDropDownChange();
    });
}

function allScoresDropDownChange() {

    var toShow = $("[data-page=all-scores] select").val();

    $("[data-page=all-scores] .tableCont:visible").fadeOut(200, function () {
        $("[data-page=all-scores] .tableCont[data-table=" + toShow + "]").fadeIn(200);
    });
}

function allGamesDropDownChange() {

    var toShow = $("[data-page=all-games] select").val();

    $("[data-page=all-games] .tableCont:visible").fadeOut(200, function () {
        $("[data-page=all-games] .tableCont[data-table=" + toShow + "]").fadeIn(200);
    });
}

function allShotsDropDownChange() {

    var toShow = $("[data-page=all-shots] select").val();

    $("[data-page=all-shots] .tableCont:visible").fadeOut(200, function () {
        $("[data-page=all-shots] .tableCont[data-table=" + toShow + "]").fadeIn(200);
    });
}

function getTopTenUsersHighScoresByDifficulty(){
    //TODO NEH - Show table loader
    $.ajax({
        url: "../../Content/Pages/statisticsAjax.php",
        data: {
            action: "getTopTenUsersHighScoresByDifficulty"
        },
        type: "post",
        success: function(data){
            var parsed = JSON.parse(data);
            populateTopTenUsersHighScoresByDifficultyTable(parsed);
        },
        error: function(){
            alert("Something went wrong");
        },
        complete: function(){
            //TODO NEH - Hide table loader
        }
    });
}

function getTopTenUsersWinsByDifficulty(){
    //TODO NEH - Show table loader
    $.ajax({
        url: "../../Content/Pages/statisticsAjax.php",
        data: {
            action: "getTopTenUsersWinsByDifficulty"
        },
        type: "post",
        success: function(data){
            var parsed = JSON.parse(data);
            populateTopTenUsersWinsByDifficultyTable(parsed);
        },
        error: function(){
            alert("Something went wrong");
        },
        complete: function(){
            //TODO NEH - Hide table loader
        }
    });
}

function getTopTenUsersGamesPlayedByDifficulty(){
    //TODO NEH - Show table loader
    $.ajax({
        url: "../../Content/Pages/statisticsAjax.php",
        data: {
            action: "getTopTenUsersGamesPlayedByDifficulty"
        },
        type: "post",
        success: function(data){
            var parsed = JSON.parse(data);
            populateTopTenUsersGamesPlayedByDifficultyTable(parsed);
        },
        error: function(){
            alert("Something went wrong");
        },
        complete: function(){
            //TODO NEH - Hide table loader
        }
    });
}

function getTopTenUsersTotalShotsFiredByDifficulty(){
    //TODO NEH - Show table loader
    $.ajax({
        url: "../../Content/Pages/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalShotsFiredByDifficulty"
        },
        type: "post",
        success: function(data){
            var parsed = JSON.parse(data);
            populateTopTenUsersTotalShotsFiredByDifficultyTable(parsed);
        },
        error: function(){
            alert("Something went wrong");
        },
        complete: function(){
            //TODO NEH - Hide table loader
        }
    });
}

function getTopTenUsersTotalShotsHitByDifficulty(){
    //TODO NEH - Show table loader
    $.ajax({
        url: "../../Content/Pages/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalShotsHitByDifficulty"
        },
        type: "post",
        success: function(data){
            var parsed = JSON.parse(data);
            populateTopTenUsersTotalShotsHitByDifficultyTable(parsed);
        },
        error: function(){
            alert("Something went wrong");
        },
        complete: function(){
            //TODO NEH - Hide table loader
        }
    });
}

function getTopTenUsersTotalHitsReceivedByDifficulty(){
    //TODO NEH - Show table loader
    $.ajax({
        url: "../../Content/Pages/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalHitsReceivedByDifficulty"
        },
        type: "post",
        success: function(data){
            var parsed = JSON.parse(data);
            populateTopTenUsersTotalHitsReceivedByDifficultyTable(parsed);
        },
        error: function(){
            alert("Something went wrong");
        },
        complete: function(){
            //TODO NEH - Hide table loader
        }
    });
}

function getTopTenUsersTotalPlayingTimeByDifficulty(){
    //TODO NEH - Show table loader
    $.ajax({
        url: "../../Content/Pages/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalPlayingTimeByDifficulty"
        },
        type: "post",
        success: function(data){
            var parsed = JSON.parse(data);
            populateTopTenUsersTotalPlayingTimeByDifficultyTable(parsed);
        },
        error: function(){
            alert("Something went wrong");
        },
        complete: function(){
            //TODO NEH - Hide table loader
        }
    });
}

function getTopTenUsersHitAccuracyByDifficulty() {
    $.ajax({
        url: "../../Content/Pages/statisticsAjax.php",
        data: {
            action: "getTopTenUsersHitAccuracyByDifficulty"
        },
        type: "post",
        success: function(data){
            var parsed = JSON.parse(data);
            getTopTenUsersHitAccuracyByDifficultyTable(parsed);
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
            tableHTML += "<td>N/A</td>";
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
        if(!multiplayer[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(multiplayer[i].userID, multiplayer[i].score);
        }

        tableHTML += "</tr>";
    }

    $("#topTenScores tbody").html(tableHTML);
}

function populateTopTenUsersHighScoresByDifficultyTable(data)
{
    var easy = data["easy"];
    var medium = data["medium"];
    var hard = data["hard"];
    var multiplayer = data["multiplayer"];
    var tableHTML = "";

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
            tableHTML += twoItemTableCell(easy[i].userID, easy[i].highScore);
        }

        //Medium
        if(!medium[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(medium[i].userID, medium[i].highScore);
        }

        //Hard
        if(!hard[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(hard[i].userID, hard[i].highScore);
        }

        //Multiplayer
        if(!multiplayer[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(multiplayer[i].userID, multiplayer[i].highScore);
        }

        tableHTML += "</tr>";
    }

    $("#topTenHighScores tbody").html(tableHTML);
}

function populateTopTenUsersWinsByDifficultyTable(data)
{
    var easy = data["easy"];
    var medium = data["medium"];
    var hard = data["hard"];
    var multiplayer = data["multiplayer"];
    var tableHTML = "";

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
            tableHTML += twoItemTableCell(easy[i].userID, easy[i].wins);
        }

        //Medium
        if(!medium[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(medium[i].userID, medium[i].wins);
        }

        //Hard
        if(!hard[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(hard[i].userID, hard[i].wins);
        }

        //Multiplayer
        if(!multiplayer[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(multiplayer[i].userID, multiplayer[i].wins);
        }

        tableHTML += "</tr>";
    }

    $("#topTenWins tbody").html(tableHTML);
}

function populateTopTenUsersGamesPlayedByDifficultyTable(data)
{
    var easy = data["easy"];
    var medium = data["medium"];
    var hard = data["hard"];
    var multiplayer = data["multiplayer"];
    var tableHTML = "";

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
            tableHTML += twoItemTableCell(easy[i].userID, easy[i].gamesPlayed);
        }

        //Medium
        if(!medium[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(medium[i].userID, medium[i].gamesPlayed);
        }

        //Hard
        if(!hard[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(hard[i].userID, hard[i].gamesPlayed);
        }

        //Multiplayer
        if(!multiplayer[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(multiplayer[i].userID, multiplayer[i].gamesPlayed);
        }

        tableHTML += "</tr>";
    }

    $("#topTenGamesPlayed tbody").html(tableHTML);
}

function populateTopTenUsersTotalShotsFiredByDifficultyTable(data)
{
    var easy = data["easy"];
    var medium = data["medium"];
    var hard = data["hard"];
    var multiplayer = data["multiplayer"];
    var tableHTML = "";

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
            tableHTML += twoItemTableCell(easy[i].userID, easy[i].totalShotsFired);
        }

        //Medium
        if(!medium[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(medium[i].userID, medium[i].totalShotsFired);
        }

        //Hard
        if(!hard[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(hard[i].userID, hard[i].totalShotsFired);
        }

        //Multiplayer
        if(!multiplayer[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(multiplayer[i].userID, multiplayer[i].totalShotsFired);
        }

        tableHTML += "</tr>";
    }

    $("#topTenTotalShotsFired tbody").html(tableHTML);
}

function populateTopTenUsersTotalShotsHitByDifficultyTable(data)
{
    var easy = data["easy"];
    var medium = data["medium"];
    var hard = data["hard"];
    var multiplayer = data["multiplayer"];
    var tableHTML = "";

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
            tableHTML += twoItemTableCell(easy[i].userID, easy[i].totalShotsHit);
        }

        //Medium
        if(!medium[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(medium[i].userID, medium[i].totalShotsHit);
        }

        //Hard
        if(!hard[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(hard[i].userID, hard[i].totalShotsHit);
        }

        //Multiplayer
        if(!multiplayer[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(multiplayer[i].userID, multiplayer[i].totalShotsHit);
        }

        tableHTML += "</tr>";
    }

    $("#topTenTotalShotsHit tbody").html(tableHTML);
}

function populateTopTenUsersTotalHitsReceivedByDifficultyTable(data)
{
    var easy = data["easy"];
    var medium = data["medium"];
    var hard = data["hard"];
    var multiplayer = data["multiplayer"];
    var tableHTML = "";

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
            tableHTML += twoItemTableCell(easy[i].userID, easy[i].totalHitsReceived);
        }

        //Medium
        if(!medium[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(medium[i].userID, medium[i].totalHitsReceived);
        }

        //Hard
        if(!hard[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(hard[i].userID, hard[i].totalHitsReceived);
        }

        //Multiplayer
        if(!multiplayer[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(multiplayer[i].userID, multiplayer[i].totalHitsReceived);
        }

        tableHTML += "</tr>";
    }

    $("#topTenTotalHitsReceived tbody").html(tableHTML);
}

function populateTopTenUsersTotalPlayingTimeByDifficultyTable(data)
{
    var easy = data["easy"];
    var medium = data["medium"];
    var hard = data["hard"];
    var multiplayer = data["multiplayer"];
    var tableHTML = "";

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
            tableHTML += twoItemTableCell(easy[i].userID, convertPlayingTime(easy[i].totalPlayingTime));
        }

        //Medium
        if(!medium[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(medium[i].userID, convertPlayingTime(medium[i].totalPlayingTime));
        }

        //Hard
        if(!hard[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(hard[i].userID, convertPlayingTime(hard[i].totalPlayingTime));
        }

        //Multiplayer
        if(!multiplayer[i])
        {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(multiplayer[i].userID, convertPlayingTime(multiplayer[i].totalPlayingTime));
        }

        tableHTML += "</tr>";
    }

    $("#topTenTotalPlayingTime tbody").html(tableHTML);
}

function getTopTenUsersHitAccuracyByDifficultyTable(data)
{
    var easy = data["easy"];
    var medium = data["medium"];
    var hard = data["hard"];
    var multiplayer = data["multiplayer"];
    var tableHTML = "";

    for (var i = 0; i < 10; i++)
    {
        tableHTML += "<tr>";
        //Easy
        if (!easy[i] || !easy[i].accuracy) {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(easy[i].userID, convertPercentage(easy[i].accuracy));
        }

        //Medium
        if (!medium[i] || !medium[i].accuracy) {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(medium[i].userID, convertPercentage(medium[i].accuracy));
        }

        //Hard
        if (!hard[i] || !hard[i].accuracy) {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(hard[i].userID, convertPercentage(hard[i].accuracy));
        }

        //Multiplayer
        if (!multiplayer[i] || !multiplayer[i].accuracy) {
            tableHTML += "<td>N/A</td>";
        }
        else
        {
            tableHTML += twoItemTableCell(multiplayer[i].userID, convertPercentage(multiplayer[i].accuracy));
        }

        tableHTML += "</tr>";
    }

    $("#topTenTotalAccuracy tbody").html(tableHTML);
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

function convertPlayingTime(seconds)
{
    var date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);
}

function convertPercentage(val) {
    if (!val) {
        return "N/A";
    }

    return parseFloat(val).toFixed(2) + "%";
}