/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    Initial creation
 * 
 */

/**
 * Function to place AI ships depending on difficulty
 */
function placeAIShips() {

    // initialise AI
    if (difficulty.toLowerCase() == "easy") {

        AI = new AI("AI", opponentBoardClass, playerBoardClass);

    } else if (difficulty.toLowerCase() == "medium") {

        AI = new AIMedium("AI", opponentBoardClass, playerBoardClass);

    } else if (difficulty.toLowerCase() == "hard") {

        AI = new AIHard("AI", opponentBoardClass, playerBoardClass);
        
    }

    // invoke the place ships method
    AI.placeShips();
}