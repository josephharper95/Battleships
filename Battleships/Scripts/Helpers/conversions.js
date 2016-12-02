/**
 * 
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    02/12/16    initial creation
 * 
 */

function convertBoardSizeStrToInt(size) {
    switch (size) {
        case "small":
            return 10;
        case "medium" :
            return 15;
        case "large":
            return 20;
    }
}

function convertBoardSizeIntToStr(size) {
    switch (size) {
        case 10:
            return "small";
        case 15:
            return "medium";
        case 20:
            return "hard";
    }
}