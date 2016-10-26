/**
*
* Last Modified By: Joe Harper
* Current Version: 0.01
*
* V0.1    Joe     01/10/16    initial creation
* V0.11   Joe     03/01/16    added first name / last name to user
* V0.12   Joe     26/10/16    added various columns, tables, indexes for user stats
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
CREATE DATABASE IF NOT EXISTS `battleships` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `battleships`;

-- --------------------------------------------------------

--
-- Table structure for table `savegames`
--

CREATE TABLE `savegames` (
  `saveGameID` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `boardWidth` int(11) NOT NULL,
  `boardHeight` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `savegames`
--

INSERT INTO `savegames` (`saveGameID`, `score`, `boardWidth`, `boardHeight`) VALUES
(2, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `savegameships`
--

CREATE TABLE `savegameships` (
  `saveGameShipsID` int(11) NOT NULL,
  `saveGameID` int(11) NOT NULL,
  `shipID` varchar(15) NOT NULL,
  `userControlled` tinyint(1) NOT NULL,
  `orientation` tinyint(1) NOT NULL,
  `headPositionX` int(11) NOT NULL,
  `headPositionY` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `savegameships`
--

INSERT INTO `savegameships` (`saveGameShipsID`, `saveGameID`, `shipID`, `userControlled`, `orientation`, `headPositionX`, `headPositionY`) VALUES
(1, 2, 'Battleship', 1, 1, 0, 0),
(2, 2, 'Carrier', 1, 1, 0, 1),
(3, 2, 'Destroyer', 1, 1, 0, 2),
(4, 2, 'Patrol', 1, 1, 0, 3),
(5, 2, 'Submarine', 1, 1, 0, 4),
(6, 2, 'Battleship', 0, 1, 0, 0),
(7, 2, 'Carrier', 0, 1, 0, 1),
(8, 2, 'Destroyer', 0, 1, 0, 2),
(9, 2, 'Patrol', 0, 1, 0, 3),
(10, 2, 'Submarine', 0, 1, 0, 4);

-- --------------------------------------------------------

--
-- Table structure for table `ships`
--

CREATE TABLE `ships` (
  `shipID` varchar(15) NOT NULL,
  `size` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ships`
--

INSERT INTO `ships` (`shipID`, `size`) VALUES
('Battleship', 4),
('Carrier', 5),
('Destroyer', 3),
('Patrol', 2),
('Submarine', 3);

-- --------------------------------------------------------

--
-- Table structure for table `shotsfired`
--

CREATE TABLE `shotsfired` (
  `shotFiredID` int(11) NOT NULL,
  `saveGameID` int(11) NOT NULL,
  `positionX` int(11) NOT NULL,
  `positionY` int(11) NOT NULL,
  `userControlled` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` varchar(20) NOT NULL,
  `password` char(64) NOT NULL,
  `saveGameID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

-- --------------------------------------------------------

--
-- Table structure for table `userstatistics`
--

CREATE TABLE `userstatistics` (
  `userID` varchar(20) NOT NULL,
  `score` int(11) NOT NULL,
  `wins` int(11) NOT NULL,
  `losses` int(11) NOT NULL,
  `gamesPlayed` int(11) NOT NULL,
  `totalShotsFired` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userstatistics`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `savegames`
--
ALTER TABLE `savegames`
  ADD PRIMARY KEY (`saveGameID`);

--
-- Indexes for table `savegameships`
--
ALTER TABLE `savegameships`
  ADD PRIMARY KEY (`saveGameShipsID`),
  ADD KEY `saveGameID` (`saveGameID`),
  ADD KEY `shipID` (`shipID`);

--
-- Indexes for table `ships`
--
ALTER TABLE `ships`
  ADD PRIMARY KEY (`shipID`),
  ADD UNIQUE KEY `shipID` (`shipID`);

--
-- Indexes for table `shotsfired`
--
ALTER TABLE `shotsfired`
  ADD PRIMARY KEY (`shotFiredID`),
  ADD KEY `saveGameID` (`saveGameID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `userID` (`userID`),
  ADD KEY `INDEX` (`saveGameID`);

--
-- Indexes for table `userstatistics`
--
ALTER TABLE `userstatistics`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `userStatisticsID` (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `savegames`
--
ALTER TABLE `savegames`
  MODIFY `saveGameID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `savegameships`
--
ALTER TABLE `savegameships`
  MODIFY `saveGameShipsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `shotsfired`
--
ALTER TABLE `shotsfired`
  MODIFY `shotFiredID` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `savegameships`
--
ALTER TABLE `savegameships`
  ADD CONSTRAINT `savegameships_ibfk_1` FOREIGN KEY (`saveGameID`) REFERENCES `savegames` (`saveGameID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `savegameships_ibfk_2` FOREIGN KEY (`shipID`) REFERENCES `ships` (`shipID`);

--
-- Constraints for table `shotsfired`
--
ALTER TABLE `shotsfired`
  ADD CONSTRAINT `shotsfired_ibfk_1` FOREIGN KEY (`saveGameID`) REFERENCES `savegames` (`saveGameID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`saveGameID`) REFERENCES `savegames` (`saveGameID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userstatistics`
--
ALTER TABLE `userstatistics`
  ADD CONSTRAINT `userstatistics_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


/* V0.11 - Adding first name / last name */

ALTER TABLE `users` ADD `firstName` VARCHAR(50) NOT NULL AFTER `password`;
ALTER TABLE `users` ADD `lastName` VARCHAR(50) NOT NULL AFTER `firstName`;


/* V1.12 - Adding tables/columns/indexes for stats */
CREATE TABLE `battleships`.`difficulties` ( `difficultyID` INT NOT NULL , `difficulty` VARCHAR(10) NOT NULL , PRIMARY KEY (`difficultyID`)) ENGINE = InnoDB;
INSERT INTO `difficulties` (`difficultyID`, `difficulty`) VALUES ('1', 'easy'), ('2', 'medium'), ('3', 'hard');
ALTER TABLE `userstatistics` ADD `difficultyID` INT NOT NULL AFTER `userID`, ADD INDEX `FK` (`difficultyID`);
ALTER TABLE `userstatistics` ADD FOREIGN KEY (`difficultyID`) REFERENCES `battleships`.`difficulties`(`difficultyID`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `userstatistics` ADD `totalShotsHit` INT NOT NULL AFTER `totalShotsFired`;
ALTER TABLE `userstatistics` ADD `totalPlayingTime` INT NOT NULL AFTER `totalShotsHit`;
ALTER TABLE userstatistics DROP FOREIGN KEY userstatistics_ibfk_1;
ALTER TABLE `battleships`.`userstatistics` DROP PRIMARY KEY, ADD INDEX `INDEX` (`userID`) USING BTREE;
ALTER TABLE `userstatistics` ADD FOREIGN KEY (`userID`) REFERENCES `battleships`.`users`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;