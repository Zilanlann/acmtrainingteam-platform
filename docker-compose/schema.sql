create schema acm_training_platform;
use acm_training_platform;

-- problem
create table problem
(
    id                    int auto_increment,
    create_time           timestamp default CURRENT_TIMESTAMP not null,
    update_time           timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    leetcode_problem_id   int                                 null comment 'Same as LeetCode',
    codeforces_problem_id varchar(12)                         null comment 'contestId/index, like 1075/A1',
    title                 varchar(64)                         not null,
    title_slug            varchar(128)                        null,
    rating                int                                 null,
    tags                  varchar(256)                        null comment 'Tag to show in the frontend',
    constraint problem_codeforces_problem_id_uindex
        unique (codeforces_problem_id),
    constraint problem_id_uindex
        unique (id),
    constraint problem_leetcode_problem_id_uindex
        unique (leetcode_problem_id)
);

create index problem_rating_index
    on problem (rating);

alter table problem
    add primary key (id);

-- problem_tag
create table problem_tag
(
    id                    int auto_increment,
    create_time           timestamp default CURRENT_TIMESTAMP not null,
    update_time           timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    leetcode_problem_id   int                                 null,
    codeforces_problem_id varchar(12)                         null,
    tag                   varchar(32)                         not null,
    constraint problem_tag_id_uindex
        unique (id),
    constraint problem_tag_tag_codeforces_problem_id_uindex
        unique (tag, codeforces_problem_id),
    constraint problem_tag_tag_leetcode_problem_id_uindex
        unique (tag, leetcode_problem_id)
);

alter table problem_tag
    add primary key (id);

-- submission
create table submission
(
    id                    int auto_increment,
    create_time           timestamp default CURRENT_TIMESTAMP                                                                                                                                                                                                                                                                                                             not null,
    update_time           timestamp default CURRENT_TIMESTAMP                                                                                                                                                                                                                                                                                                             not null on update CURRENT_TIMESTAMP,
    submission_id         int                                                                                                                                                                                                                                                                                                                                             not null,
    leetcode_problem_id   int                                                                                                                                                                                                                                                                                                                                             null,
    codeforces_problem_id varchar(12)                                                                                                                                                                                                                                                                                                                                     null comment 'contestId/index, like 1075/A1',
    user_id               int                                                                                                                                                                                                                                                                                                                                             not null,
    submit_time           int                                                                                                                                                                                                                                                                                                                                             not null,
    status                enum ('Accepted', 'Wrong Answer', 'Memory Limit Exceeded', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Skipped', 'Presentation Error', 'Failed', 'Partial', 'Idleness Limit Exceeded', 'Security Violated', 'Crashed', 'Input Preparation Crashed', 'Challenged', 'Rejected', 'Output Limit Exceeded', 'IE', 'TO', 'Testing') not null,
    rating                int                                                                                                                                                                                                                                                                                                                                             null,
    constraint submission_codeforces_problem_id_submission_id_uindex
        unique (codeforces_problem_id, submission_id),
    constraint submission_id_uindex
        unique (id),
    constraint submission_leetcode_problem_id_submission_id_uindex
        unique (leetcode_problem_id, submission_id)
);

create index submission_codeforces_problem_id_index
    on submission (codeforces_problem_id);

create index submission_rating_index
    on submission (rating);

create index submission_status_index
    on submission (status);

create index submission_submit_time_index
    on submission (submit_time);

create index submission_user_id_index
    on submission (user_id);

alter table submission
    add primary key (id);

-- user
create table user
(
    id                int auto_increment,
    create_time       timestamp    default CURRENT_TIMESTAMP not null,
    update_time       timestamp    default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    name              varchar(12)                            not null,
    password          varchar(64)                            not null,
    email             varchar(64)                            not null,
    qq                varchar(12)                            null,
    about             varchar(100) default '马骏老师真牛！'         null comment 'Describe yourself in one sentence.',
    codeforces_handle varchar(24)                            null,
    codeforces_avatar varchar(50)                            null,
    leetcode_handle   varchar(30)                            null,
    leetcode_avatar   varchar(80)                            null,
    constraint user_codeforces_handle_uindex
        unique (codeforces_handle),
    constraint user_email_uindex
        unique (email),
    constraint user_id_uindex
        unique (id),
    constraint user_leetcode_handle_uindex
        unique (leetcode_handle),
    constraint user_name_uindex
        unique (name)
);

alter table user
    add primary key (id);

-- user_daily_status
create table user_daily_status
(
    id                            int auto_increment,
    create_time                   timestamp default CURRENT_TIMESTAMP not null,
    update_time                   timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    user_id                       int                                 null,
    submission_number             int                                 null,
    ac_submission_number          int                                 null,
    easy_ac_submission_number     int                                 null,
    medium_ac_submission_number   int                                 null,
    hard_ac_submission_number     int                                 null,
    veryhard_ac_submission_number int                                 null,
    hardcore_ac_submission_number int                                 null,
    norating_ac_submission_number int                                 null,
    average_ac_rating             float                               null,
    month_submission_number       int                                 null,
    week_ac_submission_number     int                                 null,
    week_average_ac_rating        float                               null,
    week_submission_number        int                                 null,
    month_ac_submission_number    int                                 null,
    month_average_ac_rating       float                               null,
    active_score                  float                               null,
    career_ranking                int                                 null,
    active_ranking                int                                 null,
    constraint user_daily_id_uindex
        unique (id),
    constraint user_daily_user_id_uindex
        unique (user_id)
);

-- user_following
create table user_following
(
    id          int auto_increment,
    create_time timestamp default CURRENT_TIMESTAMP not null,
    update_time timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    user_id     int                                 not null,
    follow_id   int                                 not null,
    nickname    varchar(16)                         null,
    constraint user_following_id_uindex
        unique (id),
    constraint user_following_user_id_follow_id_uindex
        unique (user_id, follow_id)
)
    comment 'Store some followings, which the user to follow is registered.';

create index user_following_follow_id_index
    on user_following (follow_id);

alter table user_following
    add primary key (id);


-- refresh_user_daily_status
-- change the delimiter from `;` to `//` so the multi-line sql including `;` can be executed.
delimiter //
create
    definer = root@localhost procedure refresh_user_daily_status()
BEGIN
    DECLARE monthBeginTimestamp INT DEFAULT unix_timestamp(now()) - 86400 * 30;
    DECLARE weekBeginTimestamp INT DEFAULT unix_timestamp(now()) - 86400 * 7;
    INSERT INTO user_daily_status
        (user_id, submission_number, ac_submission_number, average_ac_rating,
        month_submission_number, month_ac_submission_number, month_average_ac_rating,
        week_submission_number, week_ac_submission_number, week_average_ac_rating,
        active_score, easy_ac_submission_number, medium_ac_submission_number,
        hard_ac_submission_number, veryhard_ac_submission_number,
        hardcore_ac_submission_number, norating_ac_submission_number)
        SELECT user_id, COUNT(*) submission_number,
        COUNT(status = 'Accepted' OR NULL) ac_submission_number,
        AVG(IF(status = 'Accepted', rating, NULL)) average_ac_rating,
        COUNT(submit_time > monthBeginTimestamp OR NULL) month_submission_number,
        COUNT(submit_time > monthBeginTimestamp AND status = 'Accepted' OR NULL)
            month_ac_submission_number,
        AVG(IF(status = 'Accepted' AND submit_time > monthBeginTimestamp, rating, NULL))
            month_average_ac_rating,
        COUNT(submit_time > weekBeginTimestamp OR NULL) week_submission_number,
        COUNT(submit_time > weekBeginTimestamp AND status = 'Accepted' OR NULL)
            week_ac_submission_number,
        AVG(IF(status = 'Accepted' AND submit_time > weekBeginTimestamp, rating, NULL))
            week_average_ac_rating,
        SUM(IF(status = 'Accepted' AND submit_time > monthBeginTimestamp,
			rating * (submit_time - monthBeginTimestamp) / (800 * 86400), 0))
            active_score,
        COUNT(status = 'Accepted' AND rating >= 800 AND rating < 1200 OR NULL)
            easy_ac_submission_number,
        COUNT(status = 'Accepted' AND rating >= 1200 AND rating < 1600 OR NULL)
            medium_ac_submission_number,
        COUNT(status = 'Accepted' AND rating >= 1600 AND rating < 2000 OR NULL)
            hard_ac_submission_number,
        COUNT(status = 'Accepted' AND rating >= 2000 AND rating < 2400 OR NULL)
            veryhard_ac_submission_number,
        COUNT(status = 'Accepted' AND rating >= 2400 OR NULL)
            hardcore_ac_submission_number,
        COUNT(status = 'Accepted' AND rating IS NULL OR NULL)
            norating_ac_submission_number
	FROM submission s
	GROUP BY user_id
    ON DUPLICATE KEY UPDATE
        submission_number = VALUES(submission_number),
        ac_submission_number = VALUES(ac_submission_number),
        average_ac_rating = VALUES(average_ac_rating),
        month_submission_number = VALUES(month_submission_number),
        month_ac_submission_number = VALUES(month_ac_submission_number),
        month_average_ac_rating = VALUES(month_average_ac_rating),
        week_submission_number = VALUES(week_submission_number),
        week_ac_submission_number = VALUES(week_ac_submission_number),
        week_average_ac_rating = VALUES(week_average_ac_rating),
        active_score = VALUES(active_score),
        easy_ac_submission_number = VALUES(easy_ac_submission_number),
        medium_ac_submission_number = VALUES(medium_ac_submission_number),
        hard_ac_submission_number = VALUES(hard_ac_submission_number),
        veryhard_ac_submission_number = VALUES(veryhard_ac_submission_number),
        hardcore_ac_submission_number = VALUES(hardcore_ac_submission_number),
        norating_ac_submission_number = VALUES(norating_ac_submission_number);
    INSERT INTO user_daily_status (user_id, active_ranking, career_ranking)
    SELECT user_id, RANK() OVER(ORDER BY active_score DESC) active_ranking,
        RANK() OVER(ORDER BY ac_submission_number * average_ac_rating DESC) career_ranking
    FROM user_daily_status
    ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        active_ranking = VALUES(active_ranking),
        career_ranking = VALUES(career_ranking);
END;
//
delimiter ;