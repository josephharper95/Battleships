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
 * V0.42    Nick        11/12/16    changed ajax links
 * V0.5     Nick        25/12/16    responsiveness and refactoring
 * 
 */

var menu = "#folderMenu";

var difficulties = ["easy", "medium", "hard", "multiplayer"];

$(document).ready(function(){

    getTopTenUserStatsByUserIdAndDifficulty();
    getTopTenUsersScoresByDifficulty();
    getTopTenUsersHighScoresByDifficulty();
    getTopTenUsersWinsByDifficulty();
    getTopTenUsersGamesPlayedByDifficulty();
    getTopTenUsersTotalShotsFiredByDifficulty();
    getTopTenUsersTotalShotsHitByDifficulty();
    getTopTenUsersTotalHitsReceivedByDifficulty();
    getTopTenUsersTotalPlayingTimeByDifficulty();
    getTopTenUsersHitAccuracyByDifficulty();

    populateDifficultyDropdowns();

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

function populateDifficultyDropdowns() {

    var html = "";

    html += "<select>";

    for (var i = 0; i < difficulties.length; i++) {

        html += "<option";
        html += " value='" + difficulties[i] + "'";
        html += ">";

        html += capitaliseFirstChar(difficulties[i]);

        html += "</option>";
    }

    html+= "</select>";

    $(".difficultyOptions").html(html);
    $(".difficultyOptions").off("change");

    $(".folderArea").on('change', ".difficultyOptions", function() {
        
        var dropdown = $(this);

        var grid = "#" + $(dropdown).attr("data-grid");
        var value = $(dropdown).val();

        $(grid + " table:not(." + value + ")").fadeOut(200).promise().done(function () {

            $(grid + " table." + value).fadeIn(200);
        });
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

function getTopTenUserStatsByUserIdAndDifficulty() {

    //TODO NEH - Show table loader
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUserStatsByUserIdAndDifficulty"
        },
        type: "post",
        success: function(data) {

            var parsed = JSON.parse(data);
            populateTopTenUserStatsByUserIdAndDifficultyTable(parsed);
            populateTopTenUserStatsByUserIdAndDifficultyTableMobile(parsed);
        },
        error: function(){

            alert("Something went wrong");
        },
        complete: function(){

            //TODO NEH - Hide table loader
        }
    });
}

function getTopTenUsersScoresByDifficulty() {
    //TODO NEH - Show table loader
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersScoresByDifficulty"
        },
        type: "post",
        success: function(data) {

            var parsed = JSON.parse(data);
            populateTopTenUsersScoresByDifficultyTable(parsed);
            populateTopTenUsersScoresByDifficultyTableMobile(parsed);
        },
        error: function(){
            alert("Something went wrong");
        },
        complete: function(){
            //TODO NEH - Hide table loader
        }
    });
}

function getTopTenUsersHighScoresByDifficulty(){
    //TODO NEH - Show table loader
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersHighScoresByDifficulty"
        },
        type: "post",
        success: function(data) {

            var parsed = JSON.parse(data);
            populateTopTenUsersHighScoresByDifficultyTable(parsed);
            populateTopTenUsersHighScoresByDifficultyTableMobile(parsed);
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
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersWinsByDifficulty"
        },
        type: "post",
        success: function(data){

            var parsed = JSON.parse(data);
            populateTopTenUsersWinsByDifficultyTable(parsed);
            populateTopTenUsersWinsByDifficultyTableMobile(parsed);
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
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersGamesPlayedByDifficulty"
        },
        type: "post",
        success: function(data) {

            var parsed = JSON.parse(data);
            populateTopTenUsersGamesPlayedByDifficultyTable(parsed);
            populateTopTenUsersGamesPlayedByDifficultyTableMobile(parsed);
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
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalShotsFiredByDifficulty"
        },
        type: "post",
        success: function(data) {

            var parsed = JSON.parse(data);
            populateTopTenUsersTotalShotsFiredByDifficultyTable(parsed);
            populateTopTenUsersTotalShotsFiredByDifficultyTableMobile(parsed);
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
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalShotsHitByDifficulty"
        },
        type: "post",
        success: function(data) {

            var parsed = JSON.parse(data);
            populateTopTenUsersTotalShotsHitByDifficultyTable(parsed);
            populateTopTenUsersTotalShotsHitByDifficultyTableMobile(parsed);
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
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalHitsReceivedByDifficulty"
        },
        type: "post",
        success: function(data) {

            var parsed = JSON.parse(data);
            populateTopTenUsersTotalHitsReceivedByDifficultyTable(parsed);
            populateTopTenUsersTotalHitsReceivedByDifficultyTableMobile(parsed);
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
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalPlayingTimeByDifficulty"
        },
        type: "post",
        success: function(data) {

            var parsed = JSON.parse(data);
            populateTopTenUsersTotalPlayingTimeByDifficultyTable(parsed);
            populateTopTenUsersTotalPlayingTimeByDifficultyTableMobile(parsed);
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
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersHitAccuracyByDifficulty"
        },
        type: "post",
        success: function(data) {

            var parsed = JSON.parse(data);
            getTopTenUsersHitAccuracyByDifficultyTable(parsed);
            getTopTenUsersHitAccuracyByDifficultyTableMobile(parsed);
        },
        error: function(){
            alert("Something went wrong");
        },
        complete: function(){
            //TODO NEH - Hide table loader
        }
    });
}

function populateTopTenUserStatsByUserIdAndDifficultyTable(data) {

    var tableHTML = "";
    var attrs = ["score", "highScore", "wins", "losses", "gamesPlayed", "incompleteGames", "gamesStarted", "completionRate", "totalShotsFired", "totalShotsHit", "accuracy", "totalHitsReceived", "totalPlayingTime"];
    var attrNames = ["Accumulative Score", "High Score", "Wins", "Losses", "Games Played", "Incomplete Games", "Games Started", "Completion Rate", "Total Shots Fired", "Total Shots Hit", "Accuracy", "Total Hits Received", "Total Playing Time"];

    tableHTML += difficultyTableRow(true);

    tableHTML += "<tbody>";

    for (var a = 0; a < attrs.length; a++) {

        tableHTML += "<tr>";

        tableHTML += "<td>";
        tableHTML += attrNames[a];
        tableHTML += "</td>";

        for (var i = 0; i < difficulties.length; i++) {

            var item = data[difficulties[i]];

            tableHTML += "<td>";

            var attr = attrs[a];

            if (attr == "losses") {

                tableHTML += item["gamesPlayed"] - item["wins"];
            } else if (attr == "gamesStarted") {

                tableHTML += parseInt(item["gamesPlayed"]) + parseInt(item["incompleteGames"]);
            } else if (attr == "completionRate") {

                var val = item["gamesPlayed"] / (parseInt(item["gamesPlayed"]) + parseInt(item["incompleteGames"])) * 100;
                tableHTML += convertPercentage(val);
            } else if (attr == "accuracy") {

                var val = (item["totalShotsHit"] / item["totalShotsFired"]) * 100;
                tableHTML += convertPercentage(val);
            } else if (attr == "totalPlayingTime") {

                tableHTML += convertPlayingTime(item[attr]);
            } else {

                tableHTML += item[attr];
            }

            tableHTML += "</td>";
        }

        tableHTML += "</tr>";
    }

    tableHTML += "</tbody>";

    $("#playerStatistics").html(tableHTML);
}
function populateTopTenUserStatsByUserIdAndDifficultyTableMobile(data) {

    var html = "";
    var attrs = ["score", "highScore", "wins", "losses", "gamesPlayed", "incompleteGames", "gamesStarted", "completionRate", "totalShotsFired", "totalShotsHit", "accuracy", "totalHitsReceived", "totalPlayingTime"];
    var attrNames = ["Accumulative Score", "High Score", "Wins", "Losses", "Games Played", "Incomplete Games", "Games Started", "Completion Rate", "Total Shots Fired", "Total Shots Hit", "Accuracy", "Total Hits Received", "Total Playing Time"];

    for (var d = 0; d < difficulties.length; d++) {

        html += "<table";
        html += " class='" + difficulties[d] + "'";
        html += ">";

        html += "<thead>";
        html += "<th></th>";
        html += "<th>";
        html += capitaliseFirstChar(difficulties[d]);
        html += "</th>";
        html += "</thead>";

        html += "<tbody>";

        for (var a = 0; a < attrs.length; a++) {

            html += "<tr>";

            html += "<td>";
            html += attrNames[a];
            html += "</td>";

            var item = data[difficulties[d]];

            html += "<td>";

            var attr = attrs[a];

            if (attr == "losses") {

                html += item["gamesPlayed"] - item["wins"];
            } else if (attr == "gamesStarted") {

                html += parseInt(item["gamesPlayed"]) + parseInt(item["incompleteGames"]);
            } else if (attr == "completionRate") {

                var val = item["gamesPlayed"] / (parseInt(item["gamesPlayed"]) + parseInt(item["incompleteGames"])) * 100;
                html += convertPercentage(val);
            } else if (attr == "accuracy") {

                var val = (item["totalShotsHit"] / item["totalShotsFired"]) * 100;
                html += convertPercentage(val);
            } else if (attr == "totalPlayingTime") {

                html += convertPlayingTime(item[attr]);
            } else {

                html += item[attr];
            }

            html += "</td>";

            html += "</tr>";
        }

        html += "</tbody>";
    }

    $("#playerStatisticsMobile .tables").html(html);
    $("#playerStatisticsMobile .difficultyOptions").trigger("change");
}

function populateTopTenUsersScoresByDifficultyTable(data) {

    var tableHTML = "";

    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "score");

    $("#topTenScores").html(tableHTML);
}
function populateTopTenUsersScoresByDifficultyTableMobile(data) {

    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "score");

    $("#topTenScoresMobile .tables").html(html);
    $("#topTenScoresMobile .difficultyOptions").trigger("change");
}

function populateTopTenUsersHighScoresByDifficultyTable(data) {

    var tableHTML = "";

    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "highScore");

    $("#topTenHighScores").html(tableHTML);
}
function populateTopTenUsersHighScoresByDifficultyTableMobile(data) {

    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "highScore");

    $("#topTenHighScoresMobile .tables").html(html);
    $("#topTenHighScoresMobile .difficultyOptions").trigger("change");
}

function populateTopTenUsersWinsByDifficultyTable(data) {

    var tableHTML = "";

    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "wins");

    $("#topTenWins").html(tableHTML);
}
function populateTopTenUsersWinsByDifficultyTableMobile(data) {

    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "wins");

    $("#topTenWinsMobile .tables").html(html);
    $("#topTenWinsMobile .difficultyOptions").trigger("change");
}

function populateTopTenUsersGamesPlayedByDifficultyTable(data) {

    var tableHTML = "";

    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "gamesPlayed");

    $("#topTenGamesPlayed").html(tableHTML);
}
function populateTopTenUsersGamesPlayedByDifficultyTableMobile(data) {

    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "gamesPlayed");

    $("#topTenGamesPlayedMobile .tables").html(html);
    $("#topTenGamesPlayedMobile .difficultyOptions").trigger("change");
}

function populateTopTenUsersTotalShotsFiredByDifficultyTable(data) {

    var tableHTML = "";

    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "totalShotsFired");

    $("#topTenTotalShotsFired").html(tableHTML);
}
function populateTopTenUsersTotalShotsFiredByDifficultyTableMobile(data) {

    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "totalShotsFired");

    $("#topTenTotalShotsFiredMobile .tables").html(html);
    $("#topTenTotalShotsFiredMobile .difficultyOptions").trigger("change");
}

function populateTopTenUsersTotalShotsHitByDifficultyTable(data) {

    var tableHTML = "";

    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "totalShotsHit");

    $("#topTenTotalShotsHit ").html(tableHTML);
}
function populateTopTenUsersTotalShotsHitByDifficultyTableMobile(data) {

    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "totalShotsHit");

    $("#topTenTotalShotsHitMobile .tables").html(html);
    $("#topTenTotalShotsHitMobile .difficultyOptions").trigger("change");
}

function populateTopTenUsersTotalHitsReceivedByDifficultyTable(data) {

    var tableHTML = "";

    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "totalHitsReceived");

    $("#topTenTotalHitsReceived").html(tableHTML);
}
function populateTopTenUsersTotalHitsReceivedByDifficultyTableMobile(data) {

    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "totalHitsReceived");

    $("#topTenTotalHitsReceivedMobile .tables").html(html);
    $("#topTenTotalHitsReceivedMobile .difficultyOptions").trigger("change");
}

function populateTopTenUsersTotalPlayingTimeByDifficultyTable(data) {

    var tableHTML = "";

    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "totalPlayingTime", "playingTime");

    $("#topTenTotalPlayingTime").html(tableHTML);
}
function populateTopTenUsersTotalPlayingTimeByDifficultyTableMobile(data) {

    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "totalPlayingTime", "playingTime");

    $("#topTenTotalPlayingTimeMobile .tables").html(html);
    $("#topTenTotalPlayingTimeMobile .difficultyOptions").trigger("change");
}

function getTopTenUsersHitAccuracyByDifficultyTable(data) {

    var tableHTML = "";

    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "accuracy", "percentage");

    $("#topTenTotalAccuracy").html(tableHTML);
}
function getTopTenUsersHitAccuracyByDifficultyTableMobile(data) {

    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "accuracy", "percentage");

    $("#topTenTotalAccuracyMobile .tables").html(html);
    $("#topTenTotalAccuracyMobile .difficultyOptions").trigger("change");
}

function tbodyTopTenTwoItemCell(data, item1, item2, extra) {

    var tableHTML = "";

    for (var i = 0; i < 10; i++) {

        tableHTML += "<tr>";

        for (var d = 0; d < difficulties.length; d++) {

            var item = data[difficulties[d]][i];

            if (extra == "playingTime" && item) {

                tableHTML += twoItemTableCell(item[item1], convertPlayingTime(item[item2]));
            }
            else if (extra == "percentage" && item) {

                tableHTML += twoItemTableCell(item[item1], convertPercentage(item[item2]));
            }
            else if (item) {

                tableHTML += twoItemTableCell(item[item1], item[item2]);
            } else {

                tableHTML += "<td>N/A</td>";
            }
        }

        tableHTML += "</tr>";
    }

    return tableHTML;
}

function mobileIndividualTablesByDifficultyTopTen(data, item1, item2, extra) {

    var html = "";

    for (var d = 0; d < difficulties.length; d++) {

        html += "<table";
        html += " class='" + difficulties[d] + "'";
        html += ">";

        html += "<thead>";
        html += "<th>";
        html += capitaliseFirstChar(difficulties[d]);
        html += "</th>";
        html += "</thead>";

        for (var i = 0; i < 10; i++) {

            html += "<tr>";

            var item = data[difficulties[d]][i];

            if (extra == "playingTime" && item) {

                html += twoItemTableCell(item[item1], convertPlayingTime(item[item2]));
            }
            else if (extra == "percentage" && item) {

                html += twoItemTableCell(item[item1], convertPercentage(item[item2]));
            }
            else if (item) {

                html += twoItemTableCell(item[item1], item[item2]);
            } else {

                html += "<td>N/A</td>";
            }

            html += "</tr>";
        }

        html += "</table>";
    }

    return html;
}

function twoItemTableCell(item1, item2) {

    var tableHTML = "<td><div>";

    tableHTML += "<label>";
    tableHTML += item1;
    tableHTML += "</label>";
    tableHTML += "<span>";
    tableHTML += item2;
    tableHTML += "</span>";

    tableHTML += "</div></td>";

    return tableHTML;
}

function convertPlayingTime(seconds) {

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

function capitaliseFirstChar(input) {

    var split = input.split(" ");

    for (var i = 0; i < split.length; i++) {

        var chars = split[i].split("");
        
        chars[0] = chars[0].toUpperCase();

        split[i] = chars.join("");
    }

    return split.join(" ");
}

function difficultyTableRow(extraCol) {

    var tableHTML = "";

    tableHTML += "<thead>";
    tableHTML += "<tr>";

    if (extraCol) {

        tableHTML += "<th></th>";
    }

    for (var d = 0; d < difficulties.length; d++) {

        tableHTML += "<th>";
        tableHTML += capitaliseFirstChar(difficulties[d]);
        tableHTML += "</th>";
    }

    tableHTML += "</tr>";
    tableHTML += "</thead>";

    return tableHTML;
}