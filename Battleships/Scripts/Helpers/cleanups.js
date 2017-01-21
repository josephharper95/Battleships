/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    Initial creation
 * 
 */

/**
 * Function to remove all hover classes from both boards
 */
function cleanupHoverClasses() {

    $(page + " " + playerBoard + " td.hover, " + page + " " + opponentBoard + " td.hover").removeClass("hover");
    $(page + " " + playerBoard + " td.noHover, " + page + " " + opponentBoard + " td.noHover").removeClass("noHover");
}

/**
 * Function to remove all hover and mouse events from both boards
 */
function removeHovers() {
    
    $(page + " " + playerBoard + " td, " + page + " " + opponentBoard + " td").unbind("hover");
    $(page + " " + playerBoard + " td, " + page + " " + opponentBoard + " td").unbind("mouseenter");
    $(page + " " + playerBoard + " td, " + page + " " + opponentBoard + " td").unbind("mouseleave");
}

/**
 * Function to remove all click events from both boards
 */
function removeClicks() {
    
    $(page + " " + playerBoard + " td, " + page + " " + opponentBoard + " td").unbind("click");
}