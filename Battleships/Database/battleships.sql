-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 30, 2016 at 11:48 PM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 7.0.4

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
(1, 2, 'battleship', 1, 1, 0, 0),
(2, 2, 'carrier', 1, 1, 0, 1),
(3, 2, 'destroyer', 1, 1, 0, 2),
(4, 2, 'patrol', 1, 1, 0, 3),
(5, 2, 'submarine', 1, 1, 0, 4),
(6, 2, 'battleship', 0, 1, 0, 0),
(7, 2, 'carrier', 0, 1, 0, 1),
(8, 2, 'destroyer', 0, 1, 0, 2),
(9, 2, 'patrol', 0, 1, 0, 3),
(10, 2, 'submarine', 0, 1, 0, 4);

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
('battleship', 4),
('carrier', 5),
('destroyer', 3),
('patrol', 2),
('submarine', 3);

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

INSERT INTO `users` (`userID`, `password`, `saveGameID`) VALUES
('test1', '1b4f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d83567014', NULL),
('user', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 2);

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

INSERT INTO `userstatistics` (`userID`, `score`, `wins`, `losses`, `gamesPlayed`, `totalShotsFired`) VALUES
('test1', 0, 0, 0, 0, 0),
('user', 0, 0, 0, 0, 0);

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
