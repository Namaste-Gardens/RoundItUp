SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `roundup`
--

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE IF NOT EXISTS `stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` varchar(255) NOT NULL,
  `active` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_id` (`store_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `store_id`, `active`) VALUES
(1, '431e6a53-86f6-4870-b039-ed065d3a17ba', 1);

--
-- Table structure for table `charities`
--

CREATE TABLE IF NOT EXISTS `charities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `charity_id` varchar(255) NOT NULL,
  `charitiy_name` varchar(255) NOT NULL,
  `ref` varchar(255) NOT NULL,
  `enabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 1,
  `weight` smallint UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `charitiy_name` (`charitiy_name`),
  UNIQUE KEY `charity_id` (`charity_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `charities`
--

INSERT INTO `charities` (`id`, `charity_id`, `charitiy_name`, `ref`, `enabled`) VALUES
(1, '431e6a53-86f6-4870-b039-ed06-qwe17ba', 'Red Cross', 'https://www.icrc.org/', 1);

INSERT INTO `charities` (`id`, `charity_id`, `charitiy_name`, `ref`, `enabled`) VALUES
(2, '431e6a53-86f6-4870-b039-ed06-qwe17bb', 'Doctors Without Borders', 'http://www.doctorswithoutborders.org/', 1);

INSERT INTO `charities` (`id`, `charity_id`, `charitiy_name`, `ref`, `enabled`) VALUES
(3, '431e6a53-86f6-4870-b039-ed06-qwe17bc', 'New York Restoration Project', 'https://www.nyrp.org/', 1);

INSERT INTO `charities` (`id`, `charity_id`, `charitiy_name`, `ref`, `enabled`) VALUES
(4, '431e6a53-86f6-4870-b039-ed06-qwe17bd', 'Animal Rescue Foundation', 'https://www.arflife.org/', 1);

INSERT INTO `charities` (`id`, `charity_id`, `charitiy_name`, `ref`, `enabled`) VALUES
(5, '431e6a53-86f6-4870-b039-ed06-qwe17be', 'World Wild Life', 'http://www.worldwildlife.org/', 1);

--
-- Table structure for table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `is` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` varchar(255) NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `charity_id` varchar(255) DEFAULT NULL,
  `amount` float NOT NULL,
  `is_paid` tinyint(4) NOT NULL DEFAULT '0',
  `ref` varchar(255) DEFAULT NULL,
  `created` int(11) NOT NULL,
  PRIMARY KEY (`is`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
