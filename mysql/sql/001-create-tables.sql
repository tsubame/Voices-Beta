create table IF not exists `users`
(
 `id`               INT(20) AUTO_INCREMENT,
 `name`             VARCHAR(100),
 `twitter_id`       VARCHAR(100), 
 `password`         VARCHAR(255), 
 `description`      VARCHAR(10000),
 `created_at`       Datetime DEFAULT CURRENT_TIMESTAMP,
 `updated_at`       Datetime DEFAULT NULL,
 `deleted_at`       Datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

create table IF not exists `chats`
(
 `id`               INT(20) AUTO_INCREMENT,
 `program_id`       INT(20),
 `user_id`          INT(20), 
 `comment`          VARCHAR(255), 
 `created_at`       Datetime DEFAULT CURRENT_TIMESTAMP,
 `updated_at`       Datetime DEFAULT NULL,
 `deleted_at`       Datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

