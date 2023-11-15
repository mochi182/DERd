CREATE TABLE Employee (ID INT, Name VARCHAR(255), PRIMARY KEY (ID));
CREATE TABLE Department (ID INT, Name VARCHAR(255), PRIMARY KEY (ID));
ALTER TABLE Employee ADD FOREIGN KEY (DepartmentID) REFERENCES Department (ID);


CREATE TABLE `teams` (
  `team_id` int(11) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `logo` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
ALTER TABLE `teams`
  ADD PRIMARY KEY (`team_id`);
 CREATE TABLE `events` (
    `event_id` int(11) NOT NULL,
    `event_date` date NOT NULL,
    `event_time` time NOT NULL,
    `event_content` text NOT NULL,
    `teamA_id` int(11) NOT NULL,
    `teamA_score` int(11) DEFAULT NULL,
    `teamB_id` int(11) NOT NULL,
    `teamB_score` int(11) DEFAULT NULL,
    `field_id` varchar(50) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`);
ALTER TABLE `events` ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`teamA_id`) REFERENCES `teams` (`team_id`);
ALTER TABLE `events` ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`teamB_id`) REFERENCES `teams` (`team_id`);





CREATE TABLE Employee (ID INT, Name VARCHAR(255), PRIMARY KEY (ID));
CREATE TABLE Department (ID INT, Name VARCHAR(255), PRIMARY KEY (ID));
CREATE TABLE `teams` (
  `team_id` int(11) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `logo` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
ALTER TABLE `teams`
  ADD PRIMARY KEY (`team_id`);
ALTER TABLE Employee ADD FOREIGN KEY (DepartmentID) REFERENCES Department (ID);
CREATE TABLE `players` (
  `player_id` int(11) NOT NULL,
  `player_name` varchar(50) NOT NULL,
  `team` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
ALTER TABLE `players`
  ADD PRIMARY KEY (`player_id`);
CREATE TABLE `events` (
    `event_id` int(11) NOT NULL,
    `event_date` date NOT NULL,
    `event_time` time NOT NULL,
    `event_content` text NOT NULL,
    `teamA_id` int(11) NOT NULL,
    `teamA_score` int(11) DEFAULT NULL,
    `teamB_id` int(11) NOT NULL,
    `teamB_score` int(11) DEFAULT NULL,
    `field_id` varchar(50) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `teamA_id` (`teamA_id`),
  ADD KEY `teamB_id` (`teamB_id`),
  ADD KEY `field_id` (`field_id`);
ALTER TABLE `events` ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`teamA_id`) REFERENCES `teams` (`team_id`);
ALTER TABLE `events` ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`teamB_id`) REFERENCES `teams` (`team_id`);