/**
*
* Last Modified By: Joe Harper
* Current Version: 0.19
*
* V0.1    Joe   01/10/16    initial creation
* V0.11   Joe   03/01/16    added first name / last name to user
* V0.12   Joe   26/10/16    added various columns, tables, indexes for user stats, remove save game support
* V0.13   Nick  01/11/16    updated difficulties to be capitalised
* V0.14   Joe   14/11/16    added "multiplayer" difficulty for stats and cleaned sql file
* V0.15   Joe   14/11/16    added "incompleteGames" column to userstatistics
* V0.16   Joe   01/12/16    added high score
* V0.17   Joe   14/12/16    added support for medals
* V0.18   Joe   20/12/16    added email address field
* V0.19   Joe   16/01/17    populated 6 medals
**/

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `battleships`
--
DROP DATABASE IF EXISTS `battleships`;

CREATE DATABASE IF NOT EXISTS `battleships` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `battleships`;

-- --------------------------------------------------------

--
-- Table structure for table `difficulties`
--

CREATE TABLE `difficulties` (
  `difficultyID` int(11) NOT NULL,
  `difficulty` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `difficulties`
--

INSERT INTO `difficulties` (`difficultyID`, `difficulty`) VALUES
(1, 'Easy'),
(2, 'Medium'),
(3, 'Hard'),
(4, 'Multiplayer');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` varchar(20) NOT NULL,
  `password` char(64) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `userstatistics`
--

CREATE TABLE `userstatistics` (
  `userID` varchar(20) NOT NULL,
  `difficultyID` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `wins` int(11) NOT NULL,
  `gamesPlayed` int(11) NOT NULL,
  `incompleteGames` int(11) NOT NULL,
  `totalShotsFired` int(11) NOT NULL,
  `totalShotsHit` int(11) NOT NULL,
  `totalHitsReceived` int(11) NOT NULL,
  `totalPlayingTime` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `difficulties`
--
ALTER TABLE `difficulties`
  ADD PRIMARY KEY (`difficultyID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `userID` (`userID`);

--
-- Indexes for table `userstatistics`
--
ALTER TABLE `userstatistics`
  ADD KEY `FK` (`difficultyID`),
  ADD KEY `INDEX` (`userID`) USING BTREE;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `userstatistics`
--
ALTER TABLE `userstatistics`
  ADD CONSTRAINT `userstatistics_ibfk_2` FOREIGN KEY (`difficultyID`) REFERENCES `difficulties` (`difficultyID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `userstatistics_ibfk_3` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


/*Added 01/12/2016 - High Score*/
ALTER TABLE `userstatistics` ADD `highScore` INT NOT NULL AFTER `score`;

/*Added 14/12/2016 - Medals*/
/*Medal Table*/
CREATE TABLE `battleships`.`medals` ( `medalID` INT NOT NULL AUTO_INCREMENT , `medalName` VARCHAR(50) NOT NULL , PRIMARY KEY (`medalID`)) ENGINE = InnoDB;
/*User Medals Link Table*/
CREATE TABLE `battleships`.`usermedals` ( `usermedalID` INT NOT NULL , `userID` VARCHAR(20) NOT NULL , `medalID` INT NOT NULL , INDEX `User FK` (`userID`), INDEX `Medal FK` (`medalID`)) ENGINE = InnoDB;
ALTER TABLE `usermedals` ADD PRIMARY KEY(`usermedalID`);
ALTER TABLE `usermedals` ADD CONSTRAINT `Medal ID` FOREIGN KEY (`medalID`) REFERENCES `battleships`.`medals`(`medalID`) ON DELETE RESTRICT ON UPDATE RESTRICT; ALTER TABLE `usermedals` ADD CONSTRAINT `User ID` FOREIGN KEY (`userID`) REFERENCES `battleships`.`users`(`userID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

/*Added 20/12/2016 - Email address field*/
ALTER TABLE `users` ADD `emailAddress` VARCHAR(255) NOT NULL AFTER `lastName`;

/*Added 16/01/2017 - Populated 6 medals*/
INSERT INTO `medals` (`medalID`, `medalName`) VALUES (NULL, 'Win Easy Difficulty'), (NULL, 'Win Medium Difficulty'), (NULL, 'Win Hard Difficulty'), (NULL, 'Win Small Board'), (NULL, 'Win Medium Board'), (NULL, 'Win Large Board');

/*Added 16/01/2017 - Added autoincrement to usermedalsID in usermedals table*/
ALTER TABLE `usermedals` CHANGE `usermedalID` `usermedalID` INT(11) NOT NULL AUTO_INCREMENT;

/*Added 16/01/2017 - Added pendingpasswordresets table*/
CREATE TABLE `battleships`.`pendingpasswordresets` ( `pendingPasswordResetID` INT NOT NULL AUTO_INCREMENT , `userID` VARCHAR(20) NOT NULL , `resetNumber` INT NOT NULL , PRIMARY KEY (`pendingPasswordResetID`), INDEX `userID` (`userID`)) ENGINE = InnoDB;
ALTER TABLE `pendingpasswordresets` ADD FOREIGN KEY (`userID`) REFERENCES `battleships`.`users`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*Added 16/01/2017 - Added medal category to medals table*/
ALTER TABLE `medals` ADD `medalCategory` VARCHAR(50) NOT NULL AFTER `medalName`;