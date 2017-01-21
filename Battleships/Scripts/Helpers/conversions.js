/**
 * 
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    02/12/16    initial creation
 * V0.11    Nick    02/12/16    hard should have been large
 * V0.12    Nick    19/01/17    final comments added
 * 
 */

/**
 * Function to convert the string size into a number
 * 
 * @param   {string}    size    the size you wish to convert
 * 
 * @returns {number}            the converted value
 */
function convertBoardSizeStrToInt(size) {

    // switch the size
    switch (size) {
        case "small":
            return 10;

        case "medium" :
            return 15;

        case "large":
            return 20;
    }
}

/**
 * Function to convert the number size into a string
 * 
 * @param   {number}    size    the size you wish to convert
 * 
 * @returns {string}            the converted value
 */
function convertBoardSizeIntToStr(size) {

    switch (size) {
        case 10:
            return "small";

        case 15:
            return "medium";

        case 20:
            return "large";
    }
}