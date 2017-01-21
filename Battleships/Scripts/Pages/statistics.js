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
 * V0.51    Nick        21/01/17    final comments added
 * 
 */

// global variables
var menu = "#folderMenu";

var difficulties = ["easy", "medium", "hard", "multiplayer"];

/**
 * Function that runs when the DOM is ready and loaded
 */
$(document).ready(function(){

    // run all statistics methods
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

    // populate the dropdowns
    populateDifficultyDropdowns();

    // add a click event onto the menu
    $(menu + " button[data-selected=false]").on("click", function () {
        
        // set the button to a variable
        var button = $(this);
        var page = button.data("page");

        // change the page
        changePage(page);
    });
});

/**
 * Function to change the sub page
 * 
 * @param   {string}    page    page to change to
 */
function changePage(page) {

    // hide the visible subpage
    $(".subPage:visible").fadeOut(100, function () {

        // show the new sub page
        $(".subPage[data-page=" + page + "]").fadeIn(100);
    });

    // set the menu item to be selected
    $(menu + " button").attr("data-selected", "false");
    $(menu + " button[data-page=" + page + "]").attr("data-selected", "true");

    // reattach click handlers
    $(menu + " button").off("click")
    $(menu + " button[data-selected=false]").on("click", function () {
        
        // set the button to a variable
        var button = $(this);
        var page = button.data("page");

        // change the page
        changePage(page);
    });

    // refresh change handlers
    dropdowns();
}

/**
 * Function to house the change events for select boxes
 */
function dropdowns() {

    $("[data-page=all-scores] select").off("change").change(function () {
        allScoresDropDownChange();
    });

    $("[data-page=all-games] select").off("change").change(function () {
        allGamesDropDownChange();
    });

    $("[data-page=all-shots] select").off("change").change(function () {
        allShotsDropDownChange();
    });
}

/**
 * Populate the difficulty dropdowns for the responsiveness
 */
function populateDifficultyDropdowns() {

    // initialise HTML as an empty string
    var html = "";

    // create select
    html += "<select>";

    // iterate through difficulties
    for (var i = 0; i < difficulties.length; i++) {

        // create option
        html += "<option";
        html += " value='" + difficulties[i] + "'";
        html += ">";

        html += capitaliseFirstChar(difficulties[i]);

        html += "</option>";
    }

    // close the select
    html+= "</select>";

    // public the html
    $(".difficultyOptions").html(html);

    // remove change event
    $(".difficultyOptions").off("change");

    // add change event
    $(".folderArea").on('change', ".difficultyOptions", function() {
        
        var dropdown = $(this);

        var grid = "#" + $(dropdown).attr("data-grid");
        var value = $(dropdown).val();

        $(grid + " table:not(." + value + ")").fadeOut(200).promise().done(function () {

            $(grid + " table." + value).fadeIn(200);
        });
    });
}

/**
 * Function to change the table shown for the scores subpage
 */
function allScoresDropDownChange() {

    // get the value from the dropdown
    var toShow = $("[data-page=all-scores] select").val();

    // hide the visible table
    $("[data-page=all-scores] .tableCont:visible").fadeOut(200, function () {

        // show the table
        $("[data-page=all-scores] .tableCont[data-table=" + toShow + "]").fadeIn(200);
    });
}

/**
 * Function to change the table shown for the games subpage
 */
function allGamesDropDownChange() {

    // get the value from the dropdown
    var toShow = $("[data-page=all-games] select").val();

    // hide the visible table
    $("[data-page=all-games] .tableCont:visible").fadeOut(200, function () {

        // show the table
        $("[data-page=all-games] .tableCont[data-table=" + toShow + "]").fadeIn(200);
    });
}

/**
 * Function to change the table shown for the shots subpage
 */
function allShotsDropDownChange() {

    // get the value from the dropdown
    var toShow = $("[data-page=all-shots] select").val();

    // hide the visible table
    $("[data-page=all-shots] .tableCont:visible").fadeOut(200, function () {

        // show the table
        $("[data-page=all-shots] .tableCont[data-table=" + toShow + "]").fadeIn(200);
    });
}

/**
 * Function to get the top 10 user statistics by ID and difficulty
 */
function getTopTenUserStatsByUserIdAndDifficulty() {

    //TODO NEH - Show table loader

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUserStatsByUserIdAndDifficulty"
        },
        type: "post",
        success: function(data) {

            // parse to JSON
            var parsed = JSON.parse(data);

            // populate normal and mobile table
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

/**
 * Function to get the top 10 user scores by difficulty
 */
function getTopTenUsersScoresByDifficulty() {

    //TODO NEH - Show table loader

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersScoresByDifficulty"
        },
        type: "post",
        success: function(data) {

            // parse to JSON
            var parsed = JSON.parse(data);

            // populate normal and mobile tables
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

/**
 * Function to get the top 10 user high scores by difficulty
 */
function getTopTenUsersHighScoresByDifficulty() {
    
    //TODO NEH - Show table loader

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersHighScoresByDifficulty"
        },
        type: "post",
        success: function(data) {

            // parse the data to JSON
            var parsed = JSON.parse(data);

            // populate normal and mobile tables
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

/**
 * Function to get the top 10 user wins by difficulty
 */
function getTopTenUsersWinsByDifficulty() {

    //TODO NEH - Show table loader

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersWinsByDifficulty"
        },
        type: "post",
        success: function(data){

            // parse the data to JSON
            var parsed = JSON.parse(data);

            // populate normal and mobile tables
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

/**
 * Function to get the top 10 user games player by difficulty
 */
function getTopTenUsersGamesPlayedByDifficulty() {

    //TODO NEH - Show table loader

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersGamesPlayedByDifficulty"
        },
        type: "post",
        success: function(data) {

            // parse data to JSON
            var parsed = JSON.parse(data);

            // populate normal and mobile tables
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

/**
 * Function to get the top 10 user total shots fired by difficulty
 */
function getTopTenUsersTotalShotsFiredByDifficulty() {

    //TODO NEH - Show table loader

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalShotsFiredByDifficulty"
        },
        type: "post",
        success: function(data) {

            // parse data to JSON
            var parsed = JSON.parse(data);

            // populate normal and mobile tables
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

/**
 * Function to get the top 10 user shots hit by difficulty
 */
function getTopTenUsersTotalShotsHitByDifficulty() {

    //TODO NEH - Show table loader

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalShotsHitByDifficulty"
        },
        type: "post",
        success: function(data) {

            // parse data to JSON
            var parsed = JSON.parse(data);

            // populate the normal and mobile tables
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

/**
 * Function to get the top 10 user total hits received by difficulty
 */
function getTopTenUsersTotalHitsReceivedByDifficulty() {

    //TODO NEH - Show table loader

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalHitsReceivedByDifficulty"
        },
        type: "post",
        success: function(data) {

            // parse data to JSON
            var parsed = JSON.parse(data);

            // populate the normal and mobile tables
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

/**
 * Function to get the top 10 user total playing time by difficulty
 */
function getTopTenUsersTotalPlayingTimeByDifficulty() {

    //TODO NEH - Show table loader

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersTotalPlayingTimeByDifficulty"
        },
        type: "post",
        success: function(data) {

            // parse data to JSON
            var parsed = JSON.parse(data);

            // populate normal and mobile tables
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

/**
 * Function to get the top 10 user hit accuracy by difficulty
 */
function getTopTenUsersHitAccuracyByDifficulty() {

    // TODO NEH: show loader

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "getTopTenUsersHitAccuracyByDifficulty"
        },
        type: "post",
        success: function(data) {

            // parse data to JSON
            var parsed = JSON.parse(data);

            // populate the normal and mobile tables
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

/**
 * Function to create the table for the top ten user stats by id and difficulty
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUserStatsByUserIdAndDifficultyTable(data) {

    // initial HTML
    var tableHTML = "";

    // attributes and names for columns
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

/**
 * Function to create the table for the top 10 user stats by id and difficulty for mobile
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUserStatsByUserIdAndDifficultyTableMobile(data) {

    // initial HTML
    var html = "";

    // attributes and column names
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

    // public HTML and trigger change of difficulty options
    $("#playerStatisticsMobile .tables").html(html);
    $("#playerStatisticsMobile .difficultyOptions").trigger("change");
}

/**
 * Function to create the table for the top 10 user scores by difficulty table
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersScoresByDifficultyTable(data) {

    // initial HTML
    var tableHTML = "";

    // get the HTML from helper methods
    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "score");

    // public HTML
    $("#topTenScores").html(tableHTML);
}

/**
 * Function to create the table for the top 10 user scores by difficulty table for mobile
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersScoresByDifficultyTableMobile(data) {

    // set the HTML with the helper methods
    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "score");

    // publish HTML and trigger change to show first difficulty table
    $("#topTenScoresMobile .tables").html(html);
    $("#topTenScoresMobile .difficultyOptions").trigger("change");
}

/**
 * Function to create the table for the top 10 user high scores by difficulty
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersHighScoresByDifficultyTable(data) {

    // initial HTML
    var tableHTML = "";

    // add to HTML using helper methods
    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "highScore");

    // publish HTML
    $("#topTenHighScores").html(tableHTML);
}

/**
 * Function to create the table for the top 10 user high scores by difficulty for mobile
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersHighScoresByDifficultyTableMobile(data) {

    // construct HTML using helper methods
    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "highScore");

    // publish HTML and trigger dropdown change
    $("#topTenHighScoresMobile .tables").html(html);
    $("#topTenHighScoresMobile .difficultyOptions").trigger("change");
}

/**
 * Function to create the table for the top 10 user wins by difficulty
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersWinsByDifficultyTable(data) {

    // initial HTML
    var tableHTML = "";

    // construct HTML by using helper methods
    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "wins");

    // publish HTML
    $("#topTenWins").html(tableHTML);
}

/**
 * function to create the table for the top 10 user wins by difficulty for mobile
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersWinsByDifficultyTableMobile(data) {

    // construct HTML using helper method
    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "wins");

    // publish HTML and trigger change for dropdown
    $("#topTenWinsMobile .tables").html(html);
    $("#topTenWinsMobile .difficultyOptions").trigger("change");
}

/**
 * Function to create the table for the top 10 user games played by difficulty
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersGamesPlayedByDifficultyTable(data) {

    // initial HTML
    var tableHTML = "";

    // construct HTML using helper methods
    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "gamesPlayed");

    // publish HTML
    $("#topTenGamesPlayed").html(tableHTML);
}

/**
 * function to create the table for the top 10 user games played by difficulty for mobile
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersGamesPlayedByDifficultyTableMobile(data) {

    // construct HTML using helper method
    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "gamesPlayed");

    // publish the HTML and trigger the change for dropdown
    $("#topTenGamesPlayedMobile .tables").html(html);
    $("#topTenGamesPlayedMobile .difficultyOptions").trigger("change");
}

/**
 * Function to create the table for the top 10 total shots fired by difficulty
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersTotalShotsFiredByDifficultyTable(data) {

    // initial HTML
    var tableHTML = "";

    // construct HTML using helper methods
    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "totalShotsFired");

    // publish HTML
    $("#topTenTotalShotsFired").html(tableHTML);
}

/**
 * Function to create the table for the top 10 total shots fired by difficulty for mobile
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersTotalShotsFiredByDifficultyTableMobile(data) {

    // construct HTML using helper method
    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "totalShotsFired");

    // publish HTML and trigger change for dropdown
    $("#topTenTotalShotsFiredMobile .tables").html(html);
    $("#topTenTotalShotsFiredMobile .difficultyOptions").trigger("change");
}

/**
 * Function to create the table for the top 10 total shots hit by difficulty
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersTotalShotsHitByDifficultyTable(data) {

    // initial HTML
    var tableHTML = "";

    // construct HTML using helper methods
    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "totalShotsHit");

    // publish HTML
    $("#topTenTotalShotsHit ").html(tableHTML);
}

/**
 * Function to create the table for the top 10 total shots hit by difficulty for mobile
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersTotalShotsHitByDifficultyTableMobile(data) {

    // construct the HTML using helper method
    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "totalShotsHit");

    // publish HTML and trigger change to dropdown
    $("#topTenTotalShotsHitMobile .tables").html(html);
    $("#topTenTotalShotsHitMobile .difficultyOptions").trigger("change");
}

/**
 * Function to create the table for the top 10 total hits received by difficulty
 */
function populateTopTenUsersTotalHitsReceivedByDifficultyTable(data) {

    // initial HTML
    var tableHTML = "";

    // construct HTML using helper methods
    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "totalHitsReceived");

    // publish HTML
    $("#topTenTotalHitsReceived").html(tableHTML);
}

/**
 * Function to create the table for the top 10 total hits received by difficulty for mobile
 */
function populateTopTenUsersTotalHitsReceivedByDifficultyTableMobile(data) {

    // construct the HTML using helper method
    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "totalHitsReceived");

    // publish HTML and trigger change for dropdown
    $("#topTenTotalHitsReceivedMobile .tables").html(html);
    $("#topTenTotalHitsReceivedMobile .difficultyOptions").trigger("change");
}

/**
 * Function to create the table for the top 10 total playing time by difficulty
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersTotalPlayingTimeByDifficultyTable(data) {

    // initial HTML
    var tableHTML = "";

    // construct the HTML using helper methods
    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "totalPlayingTime", "playingTime");

    // publish HTML
    $("#topTenTotalPlayingTime").html(tableHTML);
}

/**
 * Function to create the table for the top 10 total playing time by difficulty for mobile
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function populateTopTenUsersTotalPlayingTimeByDifficultyTableMobile(data) {

    // construct HTML using helper method
    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "totalPlayingTime", "playingTime");

    // publish HTML and trigger change for dropdown
    $("#topTenTotalPlayingTimeMobile .tables").html(html);
    $("#topTenTotalPlayingTimeMobile .difficultyOptions").trigger("change");
}

/**
 * Function to create the table for the top 10 hit accuracy by difficulty
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function getTopTenUsersHitAccuracyByDifficultyTable(data) {

    // initial HTML§
    var tableHTML = "";

    // construct the HTML using helper methods
    tableHTML += difficultyTableRow(false);
    tableHTML += tbodyTopTenTwoItemCell(data, "userID", "accuracy", "percentage");

    // publish HTML
    $("#topTenTotalAccuracy").html(tableHTML);
}

/**
 * Function to create the table for the top 10 hit accuracy by difficulty for mobile
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 */
function getTopTenUsersHitAccuracyByDifficultyTableMobile(data) {

    // construct the HTML using helper method
    var html = mobileIndividualTablesByDifficultyTopTen(data, "userID", "accuracy", "percentage");

    // publish HTML and trigger change for dropdown
    $("#topTenTotalAccuracyMobile .tables").html(html);
    $("#topTenTotalAccuracyMobile .difficultyOptions").trigger("change");
}

/**************************
 *     HELPER METHODS
 *************************/

/**
 * Function to create table rows for the data given, for the attributes given
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 * @param   {string}    item1   the first item to go in the cell
 * @param   {string}    item2   the second item to go in the cell
 * @param   {string}    extra   if the cell needs to behave a different way, pass this
 * 
 * @returns {string}            the HTML for inside the tbody
 */
function tbodyTopTenTwoItemCell(data, item1, item2, extra) {

    // initial HTML
    var tableHTML = "";

    // recurse through 10 times
    for (var i = 0; i < 10; i++) {

        // add tr opening tag
        tableHTML += "<tr>";

        // recurse through the difficulties
        for (var d = 0; d < difficulties.length; d++) {

            // put the item to a variable
            var item = data[difficulties[d]][i];

            // checking for the extras
            if (extra == "playingTime" && item) {

                tableHTML += twoItemTableCell(item[item1], convertPlayingTime(item[item2]));
            }
            else if (extra == "percentage" && item) {

                tableHTML += twoItemTableCell(item[item1], convertPercentage(item[item2]));
            }

            // if extras have not been met
            else if (item) {

                tableHTML += twoItemTableCell(item[item1], item[item2]);
            } 
            
            // if a null has been passed
            else {

                tableHTML += "<td>N/A</td>";
            }
        }

        // close the tr tag
        tableHTML += "</tr>";
    }

    // return the HTML
    return tableHTML;
}

/**
 * Function to create the individual tables for use in the mobile responsiveness
 * 
 * @param   {Object}    data    object that holds the data for the statistics
 * @param   {string}    item1   the first item to go in the cell
 * @param   {string}    item2   the second item to go in the cell
 * @param   {string}    extra   if the cell needs to behave a different way, pass this
 * 
 * @returns {string}            the HTML for the tables
 */
function mobileIndividualTablesByDifficultyTopTen(data, item1, item2, extra) {

    // initial HTML
    var html = "";

    // iterate through the difficulties
    for (var d = 0; d < difficulties.length; d++) {

        // open up the table tag
        html += "<table";
        html += " class='" + difficulties[d] + "'";
        html += ">";

        // construct the table header
        html += "<thead>";
        html += "<th>";
        html += capitaliseFirstChar(difficulties[d]);
        html += "</th>";
        html += "</thead>";

        // iterate 10 times
        for (var i = 0; i < 10; i++) {

            // open the tr tag
            html += "<tr>";

            // put the item to the variable
            var item = data[difficulties[d]][i];

            // extras
            if (extra == "playingTime" && item) {

                html += twoItemTableCell(item[item1], convertPlayingTime(item[item2]));
            }
            else if (extra == "percentage" && item) {

                html += twoItemTableCell(item[item1], convertPercentage(item[item2]));
            }

            // if there aren't any extras
            else if (item) {

                html += twoItemTableCell(item[item1], item[item2]);
            } 
            
            // if the item is null
            else {

                html += "<td>N/A</td>";
            }

            // close tr tag
            html += "</tr>";
        }

        // close table tag
        html += "</table>";
    }

    // return HTML
    return html;
}

/**
 * Function to create a table cell that contains 2 items
 * 
 * @param   {string}    item1   the first item
 * @param   {string}    item2   the second item
 * 
 * @returns {string}            the HTML for the cell
 */
function twoItemTableCell(item1, item2) {

    // initial HTML
    var tableHTML = "<td><div>";

    // item 1
    tableHTML += "<label>";
    tableHTML += item1;
    tableHTML += "</label>";

    // item 2
    tableHTML += "<span>";
    tableHTML += item2;
    tableHTML += "</span>";

    // close
    tableHTML += "</div></td>";

    // return HTML
    return tableHTML;
}

/**
 * Function to convert a playing time from seconds to a string
 * 
 * @param   {number}    seconds     the seconds to convert
 * 
 * @returns {string}                the output in format hh:mm:ss
 */
function convertPlayingTime(seconds) {

    var date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);
}

/**
 * Function to convert a number to a string formatted as a percentage
 * 
 * @param   {any}       val     the value to convert
 * 
 * @returns {string}            the outputted value
 */
function convertPercentage(val) {

    if (!val) {
        return "N/A";
    }

    return parseFloat(val).toFixed(2) + "%";
}

/**
 * Function to capitalise the first character of a string
 * 
 * @param   {string}    input   the string to capitalise
 * 
 * @returns {string}            the capitalised string
 */
function capitaliseFirstChar(input) {

    // split the words into an array
    var split = input.split(" ");

    // iterate through the array
    for (var i = 0; i < split.length; i++) {

        // split the word into characters
        var chars = split[i].split("");
        
        // capitalise the first char
        chars[0] = chars[0].toUpperCase();

        // replace the array value with the capitalised word
        split[i] = chars.join("");
    }

    // join the words back together and return
    return split.join(" ");
}

/**
 * Function to create a table head that displays all difficulties
 * 
 * @param   {boolean}   extraCol    if the header should have a blank cell at the beginning
 * 
 * @returns {string}                the table header
 */
function difficultyTableRow(extraCol) {

    // initial HTML
    var tableHTML = "";

    // open table head and table row
    tableHTML += "<thead>";
    tableHTML += "<tr>";

    // if extra column is needed, add
    if (extraCol) {

        tableHTML += "<th></th>";
    }

    // iterate through difficulties
    for (var d = 0; d < difficulties.length; d++) {

        // add a table head
        tableHTML += "<th>";
        tableHTML += capitaliseFirstChar(difficulties[d]);
        tableHTML += "</th>";
    }

    // close the table row and table head§
    tableHTML += "</tr>";
    tableHTML += "</thead>";

    // return HTML
    return tableHTML;
}