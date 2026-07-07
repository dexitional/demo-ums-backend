-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `_appToprovider` (
	`A` int NOT NULL,
	`B` int NOT NULL,
	CONSTRAINT `_appToprovider_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_prisma_migrations` (
	`id` varchar(36) NOT NULL,
	`checksum` varchar(64) NOT NULL,
	`finished_at` datetime(3),
	`migration_name` varchar(255) NOT NULL,
	`logs` text,
	`rolled_back_at` datetime(3),
	`started_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`applied_steps_count` int unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `_prisma_migrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_activity_backlog` (
	`id` varchar(191) NOT NULL,
	`sessionId` varchar(191),
	`schemeId` varchar(191),
	`title` varchar(191),
	`type` enum('REGISTRATION','ASSESSMENT','DELETION'),
	`meta` json,
	`status` tinyint(1) NOT NULL DEFAULT 0,
	`approvedBy` varchar(191),
	`createdBy` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_activity_backlog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_activity_defer` (
	`id` varchar(191) NOT NULL,
	`sessionId` varchar(191),
	`indexno` varchar(50),
	`semesterNum` int NOT NULL,
	`letterDate` datetime(3),
	`reason` varchar(255),
	`durationInYears` int NOT NULL DEFAULT 1,
	`status` enum('PENDED','APPROVED','DECLINED','RESUMED') NOT NULL DEFAULT 'PENDED',
	`statusBy` varchar(191),
	`start` datetime(3),
	`end` datetime(3),
	`createdBy` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_activity_defer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_activity_progchange` (
	`id` varchar(191) NOT NULL,
	`sessionId` varchar(191),
	`studentId` varchar(191) NOT NULL,
	`oldIndexno` varchar(50) NOT NULL,
	`newIndexno` varchar(50),
	`oldProgramId` varchar(191) NOT NULL,
	`newProgramId` varchar(191),
	`newSemesterNum` int NOT NULL,
	`reason` varchar(255),
	`approved` tinyint(1) NOT NULL DEFAULT 1,
	`approvedBy` varchar(191),
	`approvedAt` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_activity_progchange_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_activity_progress` (
	`id` varchar(191) NOT NULL,
	`sessionId` varchar(191) NOT NULL,
	`indexno` varchar(50) NOT NULL,
	`semesterNum` int NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_activity_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_activity_register` (
	`id` varchar(191) NOT NULL,
	`sessionId` varchar(191),
	`indexno` varchar(50),
	`courses` int NOT NULL,
	`credits` int NOT NULL,
	`semesterNum` int NOT NULL,
	`dump` json,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_activity_register_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_assessment` (
	`id` varchar(191) NOT NULL,
	`sessionId` varchar(191) NOT NULL,
	`schemeId` varchar(191) NOT NULL,
	`courseId` varchar(191) NOT NULL,
	`indexno` varchar(191) NOT NULL,
	`credit` int NOT NULL,
	`semesterNum` int NOT NULL,
	`classScore` double,
	`examScore` double,
	`totalScore` double,
	`type` enum('N','R') NOT NULL,
	`scoreA` double,
	`scoreB` double,
	`scoreC` double,
	`status` tinyint(1) NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_assessment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_course` (
	`id` varchar(191) NOT NULL,
	`title` varchar(450) NOT NULL,
	`creditHour` int NOT NULL,
	`theoryHour` int,
	`practicalHour` int,
	`remark` enum('FADED','ACTIVE'),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_course_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_graduate` (
	`id` varchar(191) NOT NULL,
	`sessionId` varchar(191),
	`indexno` varchar(191) NOT NULL,
	`cgpa` varchar(191),
	`certNo` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_graduate_id` PRIMARY KEY(`id`),
	CONSTRAINT `ais_graduate_indexno_key` UNIQUE(`indexno`)
);
--> statement-breakpoint
CREATE TABLE `ais_graduate_session` (
	`id` varchar(191) NOT NULL,
	`title` varchar(350) NOT NULL,
	`description` varchar(650),
	`start` datetime(3),
	`end` datetime(3),
	`default` tinyint(1) NOT NULL DEFAULT 0,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_graduate_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_letter` (
	`id` varchar(191) NOT NULL,
	`tag` varchar(191),
	`title` varchar(350) NOT NULL,
	`signatory` text NOT NULL,
	`signature` longtext NOT NULL,
	`template` longtext NOT NULL,
	`cc` text,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_letter_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_major` (
	`id` varchar(191) NOT NULL,
	`programId` varchar(191),
	`shortName` varchar(255),
	`longName` varchar(355),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_major_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_program` (
	`id` varchar(191) NOT NULL,
	`schemeId` varchar(191),
	`unitId` varchar(191),
	`modeId` varchar(191),
	`code` varchar(50) NOT NULL,
	`prefix` varchar(50),
	`stype` int,
	`shortName` varchar(255) NOT NULL,
	`longName` varchar(450) NOT NULL,
	`category` enum('CP','DP','UG','PG') NOT NULL,
	`semesterTotal` int,
	`creditTotal` int,
	`shallAdmit` tinyint(1) NOT NULL DEFAULT 0,
	`hasMajor` tinyint(1) NOT NULL DEFAULT 0,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_program_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_resit` (
	`id` varchar(191) NOT NULL,
	`sessionId` varchar(191),
	`registerSessionId` varchar(191),
	`trailSessionId` varchar(191) NOT NULL,
	`schemeId` varchar(191) NOT NULL,
	`courseId` varchar(191) NOT NULL,
	`indexno` varchar(50) NOT NULL,
	`semesterNum` int NOT NULL,
	`totalScore` int,
	`approveScore` tinyint(1) NOT NULL DEFAULT 0,
	`taken` tinyint(1) NOT NULL DEFAULT 0,
	`paid` tinyint(1) NOT NULL DEFAULT 0,
	`actionType` enum('APPEND','REPLACE'),
	`actionMeta` json,
	`registeredAt` datetime(3),
	`entryAt` datetime(3),
	`approvedAt` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_resit_id` PRIMARY KEY(`id`),
	CONSTRAINT `ais_resit_trailSessionId_indexno_courseId_key` UNIQUE(`trailSessionId`,`indexno`,`courseId`)
);
--> statement-breakpoint
CREATE TABLE `ais_resit_session` (
	`id` varchar(191) NOT NULL,
	`title` varchar(350) NOT NULL,
	`start` datetime(3),
	`end` datetime(3),
	`period` datetime(3),
	`default` tinyint(1) NOT NULL DEFAULT 0,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_resit_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_scheme` (
	`id` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`gradeMeta` json NOT NULL,
	`classMeta` json NOT NULL,
	`scoreRange` json NOT NULL,
	`passMark` double NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_scheme_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_session` (
	`id` varchar(191) NOT NULL,
	`tag` varchar(50) DEFAULT 'main',
	`title` varchar(255) NOT NULL,
	`year` varchar(50),
	`semester` enum('1','2') NOT NULL,
	`registerStart` datetime,
	`registerEnd` datetime,
	`registerEndLate` datetime,
	`registerPause` tinyint(1) NOT NULL DEFAULT 0,
	`orientStart` datetime,
	`orientEnd` datetime,
	`lectureStart` datetime,
	`lectureEnd` datetime,
	`paymentEnd` datetime,
	`matriculateStart` datetime,
	`medicalStart` datetime,
	`medicalEnd` datetime,
	`examStart` datetime,
	`examEnd` datetime,
	`entryStart` datetime,
	`entryEnd` datetime,
	`admissionPrefix` varchar(191),
	`assignLateSheet` tinyint(1) NOT NULL DEFAULT 0,
	`progressStudent` tinyint(1) NOT NULL DEFAULT 0,
	`stageSheet` tinyint(1) NOT NULL DEFAULT 0,
	`default` tinyint(1) NOT NULL DEFAULT 0,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`evaluationEnd` datetime,
	`evaluationStart` datetime,
	CONSTRAINT `ais_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_sheet` (
	`id` varchar(191) NOT NULL,
	`sessionId` varchar(191) NOT NULL,
	`courseId` varchar(191) NOT NULL,
	`unitId` varchar(191),
	`programId` varchar(191) NOT NULL,
	`majorId` varchar(191),
	`assignStaffId` varchar(191),
	`assessorId` varchar(191),
	`certifierId` varchar(191),
	`semesterNum` int NOT NULL,
	`studyMode` varchar(50),
	`studentCount` int DEFAULT 0,
	`completeRatio` double,
	`assessed` tinyint(1) NOT NULL DEFAULT 0,
	`certified` tinyint(1) NOT NULL DEFAULT 0,
	`finalized` tinyint(1) NOT NULL DEFAULT 0,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`classTimetable` json,
	`examTimetable` json,
	CONSTRAINT `ais_sheet_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_structmeta` (
	`id` varchar(191) NOT NULL,
	`programId` varchar(191) NOT NULL,
	`majorId` varchar(191),
	`semesterNum` int NOT NULL,
	`minCredit` int NOT NULL,
	`maxCredit` int NOT NULL,
	`maxElectiveNum` int,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_structmeta_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_structure` (
	`id` varchar(191) NOT NULL,
	`unitId` varchar(191),
	`programId` varchar(191) NOT NULL,
	`majorId` varchar(191),
	`courseId` varchar(191) NOT NULL,
	`semesterNum` int NOT NULL,
	`type` enum('C','E','O') NOT NULL,
	`lock` tinyint(1) NOT NULL DEFAULT 0,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_structure_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ais_student` (
	`id` varchar(191) NOT NULL,
	`indexno` varchar(50),
	`titleId` varchar(191),
	`fname` varchar(255),
	`mname` varchar(350),
	`lname` varchar(255),
	`gender` varchar(20),
	`dob` datetime(3),
	`maritalId` varchar(191),
	`email` varchar(255),
	`phone` varchar(25),
	`hometown` varchar(255),
	`address` varchar(350),
	`guardianName` varchar(350),
	`guardianPhone` varchar(15),
	`ghcardNo` varchar(255),
	`nationalityId` varchar(191),
	`countryId` varchar(191),
	`regionId` varchar(191),
	`religionId` varchar(191),
	`disabilityId` varchar(191),
	`programId` varchar(191),
	`majorId` varchar(191),
	`progCount` int,
	`semesterNum` int,
	`semesterDone` int,
	`creditDone` int,
	`entrySemesterNum` int,
	`entryGroup` enum('GH','INT') DEFAULT 'GH',
	`entryDate` datetime,
	`exitDate` datetime,
	`residentialStatus` enum('RESIDENTIAL','NON_RESIDENTIAL'),
	`studyMode` enum('M','W','E','A','f'),
	`deferStatus` tinyint(1) NOT NULL DEFAULT 0,
	`completeStatus` tinyint(1) NOT NULL DEFAULT 0,
	`completeType` enum('GRADUATION','RASTICATED','FORFEITED','DEAD','DISMISSED'),
	`graduateStatus` tinyint(1) NOT NULL DEFAULT 0,
	`instituteEmail` varchar(350),
	`instituteAffliate` varchar(350),
	`flagPardon` tinyint(1) NOT NULL DEFAULT 0,
	`accountNet` float DEFAULT 0,
	CONSTRAINT `ais_student_id` PRIMARY KEY(`id`),
	CONSTRAINT `ais_student_id_key` UNIQUE(`id`),
	CONSTRAINT `ais_student_indexno_key` UNIQUE(`indexno`)
);
--> statement-breakpoint
CREATE TABLE `ais_transwift` (
	`id` varchar(191) NOT NULL,
	`studentId` varchar(191) NOT NULL,
	`transactId` varchar(191) NOT NULL,
	`applicant` varchar(350),
	`receipient` text,
	`quantity` int NOT NULL DEFAULT 0,
	`mode` enum('PICKUP','INLAND','FOREIGN') DEFAULT 'PICKUP',
	`version` enum('SOFTCOPY','HARDCOPY') DEFAULT 'SOFTCOPY',
	`status` enum('PENDED','PRINTED','COMPLETED') NOT NULL DEFAULT 'PENDED',
	`issuerId` varchar(191),
	`printedAt` datetime(3),
	`completedAt` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ais_transwift_id` PRIMARY KEY(`id`),
	CONSTRAINT `ais_transwift_transactId_key` UNIQUE(`transactId`)
);
--> statement-breakpoint
CREATE TABLE `ams_activity_applicant` (
	`id` varchar(191) NOT NULL,
	`serial` int,
	`meta` json,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_activity_applicant_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_admission` (
	`id` varchar(191) NOT NULL,
	`pgletterId` varchar(191),
	`ugletterId` varchar(191),
	`dpletterId` varchar(191),
	`cpletterId` varchar(191),
	`sessionId` varchar(191),
	`title` varchar(255) NOT NULL,
	`examStart` datetime(3),
	`examEnd` datetime(3),
	`applyStart` datetime(3),
	`applyEnd` datetime(3),
	`applyPause` tinyint(1) NOT NULL DEFAULT 1,
	`showAdmitted` tinyint(1) NOT NULL DEFAULT 1,
	`voucherIndex` int,
	`default` tinyint(1) NOT NULL DEFAULT 0,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`admittedAt` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_admission_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_applicant` (
	`serial` varchar(191) NOT NULL,
	`admissionId` varchar(191) NOT NULL,
	`stageId` varchar(191) NOT NULL,
	`applyTypeId` varchar(191) NOT NULL,
	`choiceId` varchar(191),
	`profileId` varchar(191),
	`photo` longtext,
	`meta` json,
	`gradeValue` int,
	`classValue` int,
	`sorted` tinyint(1) NOT NULL DEFAULT 0,
	`submitted` tinyint(1) NOT NULL DEFAULT 0,
	`submittedAt` datetime(3),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_applicant_serial` PRIMARY KEY(`serial`)
);
--> statement-breakpoint
CREATE TABLE `ams_applytype` (
	`id` varchar(191) NOT NULL,
	`title` varchar(350) NOT NULL,
	`stages` json NOT NULL,
	`letterCondition` varchar(255) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_applytype_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_award_class` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(100) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_award_class_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_category` (
	`id` varchar(191) NOT NULL,
	`title` varchar(100) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_cert_category` (
	`id` varchar(191) NOT NULL,
	`instituteCategoryId` varchar(191),
	`title` varchar(100) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_cert_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_document_category` (
	`id` varchar(191) NOT NULL,
	`title` varchar(100) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_document_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_exam_category` (
	`id` varchar(191) NOT NULL,
	`title` varchar(100) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_exam_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_form` (
	`id` varchar(191) NOT NULL,
	`categoryId` varchar(191),
	`title` varchar(255) NOT NULL,
	`meta` json,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_form_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_fresher` (
	`serial` varchar(191) NOT NULL,
	`admissionId` varchar(191) NOT NULL,
	`letterId` varchar(191),
	`sessionId` varchar(191) NOT NULL,
	`billId` varchar(191),
	`programId` varchar(191) NOT NULL,
	`majorId` varchar(191),
	`sessionMode` enum('M','W','E'),
	`categoryId` varchar(191),
	`sellType` int,
	`semesterNum` int NOT NULL,
	`username` varchar(255),
	`password` varchar(255),
	`accept` tinyint(1) NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_fresher_serial` PRIMARY KEY(`serial`)
);
--> statement-breakpoint
CREATE TABLE `ams_grade_weight` (
	`id` varchar(191) NOT NULL,
	`certCategoryId` varchar(191),
	`title` varchar(100) NOT NULL,
	`weight` tinyint,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_grade_weight_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_institute_category` (
	`id` varchar(191) NOT NULL,
	`title` varchar(100) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_institute_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_letter` (
	`id` varchar(191) NOT NULL,
	`categoryId` varchar(191),
	`title` varchar(350) NOT NULL,
	`signatory` text NOT NULL,
	`signature` longtext NOT NULL,
	`template` longtext NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_letter_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_price` (
	`id` varchar(191) NOT NULL,
	`categoryId` varchar(191),
	`title` varchar(255) NOT NULL,
	`sellType` int,
	`currency` enum('GHC','USD') NOT NULL DEFAULT 'GHC',
	`amount` double NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_price_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_sorted` (
	`serial` varchar(191) NOT NULL,
	`admissionId` varchar(191) NOT NULL,
	`stageId` varchar(191) NOT NULL,
	`applyTypeId` varchar(191) NOT NULL,
	`categoryId` varchar(191),
	`sellType` int,
	`choice1Id` varchar(191),
	`choice2Id` varchar(191),
	`profileId` varchar(191),
	`gradeValue` int,
	`classValue` int,
	`admitted` tinyint(1) NOT NULL DEFAULT 0,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_sorted_serial` PRIMARY KEY(`serial`)
);
--> statement-breakpoint
CREATE TABLE `ams_stage` (
	`id` varchar(191) NOT NULL,
	`categoryId` varchar(191),
	`formId` varchar(191) NOT NULL,
	`title` varchar(350) NOT NULL,
	`sellType` int,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_stage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_step_choice` (
	`id` varchar(191) NOT NULL,
	`programId` varchar(191),
	`majorId` varchar(191),
	`serial` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_step_choice_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_step_document` (
	`id` varchar(191) NOT NULL,
	`documentCategoryId` varchar(191),
	`serial` varchar(191) NOT NULL,
	`base64` longtext,
	`mime` varchar(255),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_step_document_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_step_education` (
	`id` varchar(191) NOT NULL,
	`serial` varchar(191) NOT NULL,
	`instituteCategoryId` varchar(191),
	`certCategoryId` varchar(191),
	`instituteName` varchar(255) NOT NULL,
	`certName` varchar(350),
	`gradeValue` int,
	`classValue` int,
	`startMonth` int NOT NULL,
	`startYear` int NOT NULL,
	`endMonth` int,
	`endYear` int,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_step_education_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_step_employment` (
	`id` varchar(191) NOT NULL,
	`serial` varchar(191) NOT NULL,
	`employerName` varchar(350) NOT NULL,
	`employerAddress` varchar(350) NOT NULL,
	`jobTitle` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(255),
	`address` varchar(350),
	`startMonth` int,
	`startYear` int,
	`endMonth` int,
	`endYear` int,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_step_employment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_step_grade` (
	`id` varchar(191) NOT NULL,
	`resultId` varchar(191),
	`subjectId` varchar(191),
	`gradeWeightId` varchar(191),
	`serial` varchar(191) NOT NULL,
	`gradeValue` int NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_step_grade_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_step_guardian` (
	`serial` varchar(191) NOT NULL,
	`relationId` varchar(191) NOT NULL,
	`titleId` varchar(191) NOT NULL,
	`fname` varchar(255) NOT NULL,
	`mname` varchar(350),
	`lname` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(255),
	`address` varchar(350),
	`occupation` varchar(350),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_step_guardian_serial` PRIMARY KEY(`serial`)
);
--> statement-breakpoint
CREATE TABLE `ams_step_profile` (
	`serial` varchar(191) NOT NULL,
	`titleId` varchar(191) NOT NULL,
	`fname` varchar(255) NOT NULL,
	`mname` varchar(350),
	`lname` varchar(255) NOT NULL,
	`gender` varchar(20) NOT NULL,
	`dob` datetime(3) NOT NULL,
	`maritalId` varchar(50),
	`disabilities` varchar(350),
	`phone` varchar(20) NOT NULL,
	`email` varchar(255),
	`hometown` varchar(255),
	`residentAddress` varchar(350),
	`postalAddress` varchar(350),
	`occupation` varchar(350),
	`workPlace` varchar(255),
	`bondInstitute` varchar(255),
	`residentialStatus` enum('RESIDENTIAL','NON_RESIDENTIAL'),
	`studyMode` enum('M','W','E','A','f'),
	`nationalityId` varchar(191),
	`countryId` varchar(191),
	`regionId` varchar(191),
	`religionId` varchar(191),
	`disabilityId` varchar(191),
	`bonded` tinyint(1) NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_step_profile_serial` PRIMARY KEY(`serial`)
);
--> statement-breakpoint
CREATE TABLE `ams_step_referee` (
	`id` varchar(191) NOT NULL,
	`serial` varchar(191) NOT NULL,
	`titleId` varchar(191) NOT NULL,
	`fname` varchar(255) NOT NULL,
	`mname` varchar(350),
	`lname` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(255),
	`address` varchar(350),
	`occupation` varchar(350),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_step_referee_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_step_result` (
	`id` varchar(191) NOT NULL,
	`serial` varchar(191) NOT NULL,
	`certCategoryId` varchar(191),
	`indexNumber` varchar(255) NOT NULL,
	`sitting` int,
	`startYear` int NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_step_result_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_subject` (
	`id` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_subject_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_vendor` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`phone` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`address` varchar(191) NOT NULL,
	`technicianName` varchar(191) NOT NULL,
	`technicianPhone` varchar(191) NOT NULL,
	`technicianEmail` varchar(191) NOT NULL,
	`verified` tinyint(1) NOT NULL DEFAULT 1,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_vendor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ams_voucher` (
	`serial` varchar(191) NOT NULL,
	`pin` varchar(191) NOT NULL,
	`admissionId` varchar(191),
	`vendorId` varchar(191),
	`categoryId` varchar(191),
	`sellType` int,
	`applicantName` varchar(255),
	`applicantPhone` varchar(50),
	`sold` tinyint(1) NOT NULL DEFAULT 0,
	`soldAt` datetime(3),
	`soldBy` varchar(255),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `ams_voucher_serial` PRIMARY KEY(`serial`)
);
--> statement-breakpoint
CREATE TABLE `country` (
	`id` varchar(191) NOT NULL,
	`code` int,
	`shortName` varchar(10),
	`longName` varchar(255) NOT NULL,
	`nationality` varchar(300),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `country_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disability` (
	`id` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `disability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluation` (
	`id` varchar(191) NOT NULL,
	`courseId` varchar(191) NOT NULL,
	`staffNo` varchar(191),
	`indexno` varchar(191),
	`sessionId` varchar(191),
	`status` varchar(50) NOT NULL,
	`startedAt` datetime(3),
	`completedAt` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `evaluation_id` PRIMARY KEY(`id`),
	CONSTRAINT `evaluation_indexno_sessionId_courseId_key` UNIQUE(`indexno`,`sessionId`,`courseId`)
);
--> statement-breakpoint
CREATE TABLE `evaluation_option` (
	`id` varchar(191) NOT NULL,
	`option` varchar(100) NOT NULL,
	`value` int NOT NULL,
	`orderNum` int NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `evaluation_option_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluation_question` (
	`id` varchar(191) NOT NULL,
	`question` varchar(500) NOT NULL,
	`category` varchar(100) NOT NULL,
	`type` varchar(50) NOT NULL,
	`orderNum` int NOT NULL,
	`required` tinyint(1) NOT NULL DEFAULT 1,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `evaluation_question_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluation_response` (
	`id` varchar(191) NOT NULL,
	`evaluationId` varchar(191) NOT NULL,
	`questionId` varchar(191) NOT NULL,
	`optionId` varchar(191),
	`response` text,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `evaluation_response_id` PRIMARY KEY(`id`),
	CONSTRAINT `evaluation_response_evaluationId_questionId_key` UNIQUE(`evaluationId`,`questionId`)
);
--> statement-breakpoint
CREATE TABLE `evs_attack` (
	`id` int AUTO_INCREMENT NOT NULL,
	`electionId` int,
	`tag` varchar(100),
	`location` varchar(450),
	`ip` varchar(50),
	`meta` text,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	CONSTRAINT `evs_attack_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evs_candidate` (
	`id` int AUTO_INCREMENT NOT NULL,
	`portfolioId` int,
	`tag` varchar(100),
	`name` varchar(450),
	`teaser` varchar(100),
	`orderNo` int NOT NULL DEFAULT 1,
	`photo` varchar(450),
	`votes` int NOT NULL DEFAULT 0,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `evs_candidate_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evs_election` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int,
	`type` varchar(300) NOT NULL,
	`title` varchar(450),
	`tag` varchar(100),
	`logo` varchar(450),
	`admins` json,
	`voterCount` int NOT NULL DEFAULT 0,
	`voterList` json,
	`voterData` json,
	`allowMonitor` tinyint(1) NOT NULL DEFAULT 0,
	`allowEcMonitor` tinyint(1) NOT NULL DEFAULT 0,
	`allowVip` tinyint(1) NOT NULL DEFAULT 0,
	`allowEcVip` tinyint(1) NOT NULL DEFAULT 0,
	`allowResult` tinyint(1) NOT NULL DEFAULT 0,
	`allowEcResult` tinyint(1) NOT NULL DEFAULT 0,
	`allowMask` tinyint(1) NOT NULL DEFAULT 0,
	`autoStop` tinyint(1) NOT NULL DEFAULT 0,
	`startAt` datetime,
	`endAt` datetime,
	`action` enum('STAGED','STARTED','ENDED') NOT NULL DEFAULT 'STAGED',
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `evs_election_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evs_elector` (
	`id` int AUTO_INCREMENT NOT NULL,
	`electionId` int NOT NULL,
	`tag` varchar(100),
	`name` varchar(450),
	`descriptor` varchar(450),
	`gender` varchar(1),
	`voteTime` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`voteSum` varchar(750),
	`voteHash` varchar(100),
	`voteIp` varchar(50),
	`voteStatus` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `evs_elector_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evs_portfolio` (
	`id` int AUTO_INCREMENT NOT NULL,
	`electionId` int NOT NULL,
	`title` text,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `evs_portfolio_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fms_activity_api` (
	`id` varchar(191) NOT NULL,
	`ip` varchar(50),
	`title` varchar(255) NOT NULL,
	`meta` json,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `fms_activity_api_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fms_activity_bill` (
	`id` varchar(191) NOT NULL,
	`billId` varchar(191),
	`userId` int,
	`amount` double,
	`discount` double,
	`receivers` json,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `fms_activity_bill_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fms_activity_voucher` (
	`id` varchar(191) NOT NULL,
	`transactId` varchar(191),
	`admissionId` varchar(191),
	`serial` varchar(191),
	`pin` varchar(8),
	`buyerName` varchar(255) NOT NULL,
	`buyerPhone` varchar(15) NOT NULL,
	`smsCode` int,
	`generated` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `fms_activity_voucher_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fms_bankacc` (
	`id` varchar(191) NOT NULL,
	`unitId` varchar(191) NOT NULL,
	`tag` varchar(255) NOT NULL,
	`accountName` varchar(450) NOT NULL,
	`accountDescription` varchar(450) NOT NULL,
	`bankName` varchar(350) NOT NULL,
	`bankAccount` varchar(30) NOT NULL,
	`bankBranch` varchar(255) NOT NULL,
	`bankContact` varchar(20) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `fms_bankacc_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fms_bill` (
	`id` varchar(191) NOT NULL,
	`sessionId` varchar(191) NOT NULL,
	`bankaccId` varchar(191),
	`programId` varchar(191),
	`includeStudentIds` json,
	`excludeStudentIds` json,
	`mainGroupCode` varchar(4) NOT NULL,
	`discountGroupCode` varchar(4),
	`narrative` varchar(255) NOT NULL,
	`type` enum('GH','INT') NOT NULL DEFAULT 'GH',
	`residentialStatus` enum('RESIDENTIAL','NON_RESIDENTIAL') DEFAULT 'RESIDENTIAL',
	`currency` enum('GHC','USD') NOT NULL DEFAULT 'GHC',
	`amount` double NOT NULL,
	`discount` double,
	`quota` double,
	`posted` tinyint(1) NOT NULL DEFAULT 0,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `fms_bill_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fms_charge` (
	`id` varchar(191) NOT NULL,
	`studentId` varchar(191),
	`title` varchar(191) NOT NULL,
	`type` enum('FINE','FEES','GRADUATION','RESIT'),
	`currency` enum('GHC','USD') NOT NULL DEFAULT 'GHC',
	`amount` double NOT NULL,
	`posted` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `fms_charge_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fms_collector` (
	`id` varchar(191) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`phone` int,
	`technicianName` varchar(450),
	`technicianPhone` int,
	`apiToken` varchar(350),
	`apiEnabled` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `fms_collector_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fms_studaccount` (
	`id` varchar(191) NOT NULL,
	`studentId` varchar(191),
	`transactId` varchar(191),
	`sessionId` varchar(191),
	`chargeId` varchar(191),
	`billId` varchar(191),
	`type` enum('CHARGE','BILL','PAYMENT'),
	`narrative` varchar(255) NOT NULL,
	`currency` enum('GHC','USD') NOT NULL DEFAULT 'GHC',
	`amount` double NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `fms_studaccount_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fms_transaction` (
	`id` varchar(191) NOT NULL,
	`collectorId` varchar(191),
	`transtypeId` int,
	`bankaccId` varchar(191),
	`studentId` varchar(191),
	`reference` varchar(191),
	`transtag` varchar(191) NOT NULL,
	`payType` enum('BANK','MOMO') DEFAULT 'BANK',
	`feeType` enum('NORMAL','SCHOLARSHIP') DEFAULT 'NORMAL',
	`currency` enum('GHC','USD') NOT NULL DEFAULT 'GHC',
	`amount` double NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `fms_transaction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fms_transtype` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bankaccId` varchar(191),
	`bankaccMeta` json,
	`title` varchar(255) NOT NULL,
	`visibility` enum('PUBLIC','LOCAL') NOT NULL DEFAULT 'PUBLIC',
	`amountInGhc` double,
	`amountInUsd` double,
	`remark` varchar(350),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `fms_transtype_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_circular` (
	`id` varchar(191) NOT NULL,
	`uploadId` varchar(191),
	CONSTRAINT `hrs_circular_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_form` (
	`id` varchar(191) NOT NULL,
	`typeId` varchar(191),
	`title` varchar(191) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_form_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_form_type` (
	`id` varchar(191) NOT NULL,
	`title` varchar(191) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_form_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_job` (
	`id` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` enum('ACADEMIC','NON_ACADEMIC') NOT NULL,
	`yearsToNextRank` int,
	`allowNextRank` tinyint(1) NOT NULL DEFAULT 1,
	`staffCategory` enum('JS','SS','SM'),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_job_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_leave` (
	`id` varchar(191) NOT NULL,
	`leaveCategoryId` varchar(191),
	`staffId` varchar(191),
	`relieverId` varchar(191),
	`supervisorId` varchar(191),
	`approverId` varchar(191),
	`leaveWeight` int NOT NULL DEFAULT 0,
	`entitledWeight` int NOT NULL DEFAULT 0,
	`sosPhone` varchar(191),
	`sosAddress` varchar(191),
	`supervisorRemark` text,
	`startDate` date,
	`endDate` date,
	`resumeDate` date,
	`approvedDate` date,
	`flagResumed` tinyint(1) NOT NULL DEFAULT 0,
	`status` enum('HEAD_PENDING','HR_PENDING','GRANTED','ENDED','APPROVED','DECLINED','CANCELLED') NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_leave_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_leave_approver` (
	`id` varchar(191) NOT NULL,
	`approverId` varchar(191),
	`identifier` enum('STAFF','UNIT','JOB'),
	`value` varchar(191),
	`values` json,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_leave_approver_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_leave_balance` (
	`id` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`flagUsed` tinyint(1) NOT NULL DEFAULT 0,
	`leaveWeight` int NOT NULL DEFAULT 0,
	`staffId` varchar(191),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`updatedAt` datetime(3) NOT NULL,
	`usedWeight` int NOT NULL DEFAULT 0,
	CONSTRAINT `hrs_leave_balance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_leave_category` (
	`id` varchar(191) NOT NULL,
	`title` varchar(191),
	`description` text,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_leave_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_leave_constant` (
	`id` varchar(191) NOT NULL,
	`title` varchar(191),
	`leaveWeight` int NOT NULL DEFAULT 0,
	`action` enum('ADD','DEDUCT') NOT NULL,
	`staffCategory` enum('JS','SS','SM') NOT NULL,
	`exclusionRemark` text,
	`exclusionIdentifier` enum('STAFF','UNIT','JOB'),
	`exclusionValues` json,
	`effectiveYear` int NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_leave_constant_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_leave_defer` (
	`id` varchar(191) NOT NULL,
	`staffId` varchar(191),
	`supervisorId` varchar(191),
	`approverId` varchar(191),
	`reason` text,
	`leaveWeight` int NOT NULL DEFAULT 0,
	`usedWeight` int NOT NULL DEFAULT 0,
	`currentYear` int NOT NULL,
	`effectiveYear` int NOT NULL,
	`status` enum('HEAD_PENDING','HR_PENDING','GRANTED','ENDED','APPROVED','DECLINED','CANCELLED') NOT NULL DEFAULT 'HEAD_PENDING',
	`approvedOn` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_leave_defer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_leave_exempt` (
	`id` varchar(191) NOT NULL,
	`title` varchar(191),
	`period` date,
	`effectiveYear` int NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_leave_exempt_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_leave_weight` (
	`id` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`jobIdentifiers` json,
	`leaveCategoryId` varchar(191),
	`leaveWeight` int NOT NULL DEFAULT 0,
	`staffCategory` enum('JS','SS','SM') NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_leave_weight_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_nss` (
	`nssNo` varchar(191) NOT NULL,
	`titleId` varchar(191),
	`fname` varchar(255) NOT NULL,
	`mname` varchar(350),
	`lname` varchar(255) NOT NULL,
	`gender` varchar(20) NOT NULL,
	`dob` date,
	`maritalId` varchar(191),
	`disabilities` varchar(350),
	`phone` varchar(20),
	`email` varchar(255),
	`hometown` varchar(255),
	`birthplace` varchar(255),
	`district` varchar(255),
	`ssnitNo` varchar(255),
	`ghcardNo` varchar(255),
	`residentAddress` varchar(350),
	`ssoPhone` varchar(15),
	`ssoAddress` varchar(350),
	`qualification` varchar(650),
	`countryId` varchar(191),
	`regionId` varchar(191),
	`religionId` varchar(191),
	`unitId` varchar(191),
	`nssStatus` enum('ACTIVE','RELEASED','COMPLETED') NOT NULL DEFAULT 'ACTIVE',
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_nss_nssNo` PRIMARY KEY(`nssNo`),
	CONSTRAINT `hrs_nss_email_key` UNIQUE(`email`),
	CONSTRAINT `hrs_nss_ghcardNo_key` UNIQUE(`ghcardNo`),
	CONSTRAINT `hrs_nss_nssNo_key` UNIQUE(`nssNo`),
	CONSTRAINT `hrs_nss_phone_key` UNIQUE(`phone`),
	CONSTRAINT `hrs_nss_ssnitNo_key` UNIQUE(`ssnitNo`)
);
--> statement-breakpoint
CREATE TABLE `hrs_option` (
	`id` varchar(191) NOT NULL,
	`questionId` varchar(191),
	`atttachId` varchar(191),
	`title` text,
	`tag` varchar(350),
	`orderNum` int,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_option_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_paper` (
	`id` varchar(191) NOT NULL,
	CONSTRAINT `hrs_paper_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_position` (
	`id` varchar(191) NOT NULL,
	`staffNo` varchar(191),
	`scaleId` varchar(191),
	`staffCategory` enum('JS','SS','SM') NOT NULL,
	`letterAt` datetime(3) NOT NULL,
	`startAt` datetime(3) NOT NULL,
	`endAt` datetime(3) NOT NULL,
	`duration` int,
	`type` enum('APPOINTMENT','RENEWAL') NOT NULL DEFAULT 'APPOINTMENT',
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`positionInfoId` varchar(191),
	CONSTRAINT `hrs_position_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_position_info` (
	`id` varchar(191) NOT NULL,
	`unitId` varchar(191),
	`title` varchar(255) NOT NULL,
	`description` text,
	`duties` text,
	`allowances` json,
	`durationInYears` int,
	`renewalInYears` int,
	`staffCategory` enum('JS','SS','SM') NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_position_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_promotion` (
	`id` varchar(191) NOT NULL,
	`staffNo` varchar(191),
	`jobId` varchar(191),
	`scaleId` varchar(191),
	`staffCategory` enum('JS','SS','SM') NOT NULL,
	`probation` int,
	`type` enum('APPOINTMENT','PROMOTION','UPGRADE') NOT NULL DEFAULT 'APPOINTMENT',
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`assumeDate` date,
	`confirmDate` date,
	`letterDate` date,
	`effectiveDate` date,
	CONSTRAINT `hrs_promotion_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_qualification` (
	`id` varchar(191) NOT NULL,
	CONSTRAINT `hrs_qualification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_question` (
	`id` varchar(191) NOT NULL,
	`formId` varchar(191),
	`sectionId` varchar(191),
	`code` varchar(191),
	`title` text,
	`orderNum` int,
	`preview` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_question_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_relative` (
	`id` varchar(191) NOT NULL,
	`relationId` varchar(191) NOT NULL,
	`titleId` varchar(191),
	`code` varchar(191) NOT NULL,
	`fname` varchar(255) NOT NULL,
	`mname` varchar(350),
	`lname` varchar(255) NOT NULL,
	`gender` varchar(20) NOT NULL,
	`dob` datetime(3) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`address` varchar(350),
	`hometown` varchar(255),
	`isKin` tinyint(1) NOT NULL DEFAULT 1,
	`isAlive` tinyint(1) NOT NULL DEFAULT 1,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`staffId` varchar(191) NOT NULL,
	CONSTRAINT `hrs_relative_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_respondent` (
	`id` varchar(191) NOT NULL,
	`formId` varchar(191),
	`staffId` varchar(191),
	`supervisorId` varchar(191),
	`tag` varchar(191),
	`responseMeta` json,
	`status` enum('HEAD_PENDING','HEAD_REQUIRES_UPDATE','DEAN_PENDING','DEAN_REQUIRES_UPDATE','PROVOST_PENDING','PROVOST_REQUIRES_UPDATE','AMP_FORWARDED','AMP_APPROVED','GRANTED','DECLINED','CANCELLED') DEFAULT 'HEAD_PENDING',
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`nssId` varchar(191),
	CONSTRAINT `hrs_respondent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_response` (
	`id` varchar(191) NOT NULL,
	`questionId` varchar(191),
	`content` text,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`attachId` varchar(191),
	`respondentId` varchar(191),
	CONSTRAINT `hrs_response_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_scale` (
	`id` varchar(191) NOT NULL,
	`grade` varchar(350),
	`gradeNum` int,
	`notch` int,
	`notchAmount` double,
	`level` enum('L','H','AH') NOT NULL,
	`staffCategory` enum('JS','SS','SM') NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_scale_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_section` (
	`id` varchar(191) NOT NULL,
	`title` varchar(191) NOT NULL,
	`type` varchar(191),
	`formType` varchar(191),
	`path` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `hrs_section_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_specialization` (
	`id` varchar(191) NOT NULL,
	CONSTRAINT `hrs_specialization_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_staff` (
	`staffNo` varchar(191) NOT NULL,
	`titleId` varchar(191),
	`fname` varchar(255) NOT NULL,
	`mname` varchar(350),
	`lname` varchar(255) NOT NULL,
	`gender` varchar(20) NOT NULL,
	`dob` date,
	`maritalId` varchar(191),
	`disabilities` varchar(350),
	`phone` varchar(20),
	`email` varchar(255),
	`hometown` varchar(255),
	`birthplace` varchar(255),
	`district` varchar(255),
	`ssnitNo` varchar(255),
	`ghcardNo` varchar(255),
	`residentAddress` varchar(350),
	`occupation` varchar(350),
	`qualification` varchar(650),
	`instituteEmail` varchar(350),
	`countryId` varchar(191),
	`regionId` varchar(191),
	`religionId` varchar(191),
	`unitId` varchar(191),
	`jobId` varchar(191),
	`jobMode` varchar(350),
	`promotionId` varchar(191),
	`positionId` varchar(191),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`staffStatus` enum('TEMPORAL','PERMANENT','DEAD','RETIRED','ABSENCE','EXITED') NOT NULL DEFAULT 'PERMANENT',
	`exitDate` date,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`exitRemark` text,
	`firstOfferId` varchar(191),
	`ssoAddress` varchar(350),
	`ssoPhone` varchar(15),
	CONSTRAINT `hrs_staff_staffNo` PRIMARY KEY(`staffNo`),
	CONSTRAINT `hrs_staff_email_key` UNIQUE(`email`),
	CONSTRAINT `hrs_staff_ghcardNo_key` UNIQUE(`ghcardNo`),
	CONSTRAINT `hrs_staff_phone_key` UNIQUE(`phone`),
	CONSTRAINT `hrs_staff_ssnitNo_key` UNIQUE(`ssnitNo`),
	CONSTRAINT `hrs_staff_staffNo_key` UNIQUE(`staffNo`)
);
--> statement-breakpoint
CREATE TABLE `hrs_transfer` (
	`id` varchar(191) NOT NULL,
	`fromUnitId` varchar(191),
	`toUnitId` varchar(191),
	`reason` varchar(350),
	`status` enum('HEAD_PENDING','HR_PENDING','GRANTED','ENDED','APPROVED','DECLINED','CANCELLED') NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`letterDate` datetime(3) NOT NULL,
	`applyType` enum('DHR','SELF') NOT NULL,
	`approvedOn` datetime(3),
	`approverId` varchar(191),
	`creatorId` varchar(191),
	`effectiveDate` datetime(3) NOT NULL,
	`staffId` varchar(191),
	CONSTRAINT `hrs_transfer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hrs_upload` (
	`id` varchar(191) NOT NULL,
	`title` varchar(191) NOT NULL,
	`uploadType` varchar(191),
	`path` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`mime` varchar(191),
	CONSTRAINT `hrs_upload_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `informer` (
	`id` varchar(191) NOT NULL,
	`reference` varchar(191),
	`title` varchar(350) NOT NULL,
	`content` text,
	`smsContent` text,
	`receiver` enum('APPLICANT','FRESHER','FINAL','STUDENT','UNDERGRAD','POSTGRAD','ALUMNI','STAFF','HOD','DEAN','ASSESSOR','DEBTOR') NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `informer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `log` (
	`id` varchar(191) NOT NULL,
	`action` varchar(255) NOT NULL,
	`user` varchar(255),
	`student` varchar(255),
	`meta` json NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	CONSTRAINT `log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marital` (
	`id` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `marital_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mode` (
	`id` varchar(191) NOT NULL,
	`code` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `mode_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `region` (
	`id` varchar(191) NOT NULL,
	`tag` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `region_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `relation` (
	`id` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `relation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `religion` (
	`id` varchar(191) NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `religion_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sso_app` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(300) NOT NULL,
	`tag` varchar(50) NOT NULL,
	`description` varchar(300) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `sso_app_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sso_arole` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appId` int NOT NULL,
	`title` varchar(300) NOT NULL,
	`description` varchar(300) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `sso_arole_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sso_group` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(300) NOT NULL,
	`description` varchar(300) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `sso_group_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sso_provider` (
	`providerId` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`accountType` enum('LINKEDIN','GOOGLE','CREDENTIAL','PIN') NOT NULL,
	`accountId` varchar(191),
	`accountSecret` varchar(191),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	CONSTRAINT `sso_provider_providerId` PRIMARY KEY(`providerId`)
);
--> statement-breakpoint
CREATE TABLE `sso_support` (
	`supportNo` int AUTO_INCREMENT NOT NULL,
	`fname` varchar(255) NOT NULL,
	`mname` varchar(350),
	`lname` varchar(255) NOT NULL,
	`gender` varchar(20) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(255),
	`address` varchar(350),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `sso_support_supportNo` PRIMARY KEY(`supportNo`)
);
--> statement-breakpoint
CREATE TABLE `sso_urole` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`appRoleId` int NOT NULL,
	`roleMeta` varchar(255) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `sso_urole_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sso_user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`tag` varchar(50) NOT NULL,
	`username` varchar(50) NOT NULL,
	`password` varchar(50) NOT NULL,
	`unlockPin` varchar(4),
	`locked` tinyint(1) NOT NULL DEFAULT 0,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `sso_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `sso_user_tag_key` UNIQUE(`tag`)
);
--> statement-breakpoint
CREATE TABLE `title` (
	`id` varchar(191) NOT NULL,
	`tag` varchar(50) NOT NULL,
	`label` varchar(50) NOT NULL,
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `title_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `unit` (
	`id` varchar(191) NOT NULL,
	`code` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` enum('ACADEMIC','NON_ACADEMIC') NOT NULL,
	`levelNum` int NOT NULL,
	`level1Id` varchar(191),
	`level2Id` varchar(191),
	`location` varchar(191),
	`headStaffNo` varchar(191),
	`subheadStaffNo` varchar(191),
	`status` tinyint(1) NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`level3Id` varchar(191),
	CONSTRAINT `unit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `_appToprovider` ADD CONSTRAINT `_appToprovider_A_fkey` FOREIGN KEY (`A`) REFERENCES `sso_app`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_appToprovider` ADD CONSTRAINT `_appToprovider_B_fkey` FOREIGN KEY (`B`) REFERENCES `sso_provider`(`providerId`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_backlog` ADD CONSTRAINT `ais_activity_backlog_approvedBy_fkey` FOREIGN KEY (`approvedBy`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_backlog` ADD CONSTRAINT `ais_activity_backlog_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_backlog` ADD CONSTRAINT `ais_activity_backlog_schemeId_fkey` FOREIGN KEY (`schemeId`) REFERENCES `ais_scheme`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_backlog` ADD CONSTRAINT `ais_activity_backlog_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_defer` ADD CONSTRAINT `ais_activity_defer_indexno_fkey` FOREIGN KEY (`indexno`) REFERENCES `ais_student`(`indexno`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_defer` ADD CONSTRAINT `ais_activity_defer_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_progchange` ADD CONSTRAINT `ais_activity_progchange_newProgramId_fkey` FOREIGN KEY (`newProgramId`) REFERENCES `ais_program`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_progchange` ADD CONSTRAINT `ais_activity_progchange_oldProgramId_fkey` FOREIGN KEY (`oldProgramId`) REFERENCES `ais_program`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_progchange` ADD CONSTRAINT `ais_activity_progchange_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_progchange` ADD CONSTRAINT `ais_activity_progchange_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `ais_student`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_progress` ADD CONSTRAINT `ais_activity_progress_indexno_fkey` FOREIGN KEY (`indexno`) REFERENCES `ais_student`(`indexno`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_progress` ADD CONSTRAINT `ais_activity_progress_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_register` ADD CONSTRAINT `ais_activity_register_indexno_fkey` FOREIGN KEY (`indexno`) REFERENCES `ais_student`(`indexno`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_activity_register` ADD CONSTRAINT `ais_activity_register_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_assessment` ADD CONSTRAINT `ais_assessment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `ais_course`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_assessment` ADD CONSTRAINT `ais_assessment_indexno_fkey` FOREIGN KEY (`indexno`) REFERENCES `ais_student`(`indexno`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_assessment` ADD CONSTRAINT `ais_assessment_schemeId_fkey` FOREIGN KEY (`schemeId`) REFERENCES `ais_scheme`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_assessment` ADD CONSTRAINT `ais_assessment_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_graduate` ADD CONSTRAINT `ais_graduate_indexno_fkey` FOREIGN KEY (`indexno`) REFERENCES `ais_student`(`indexno`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_graduate` ADD CONSTRAINT `ais_graduate_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_graduate_session`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_major` ADD CONSTRAINT `ais_major_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `ais_program`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_program` ADD CONSTRAINT `ais_program_modeId_fkey` FOREIGN KEY (`modeId`) REFERENCES `mode`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_program` ADD CONSTRAINT `ais_program_schemeId_fkey` FOREIGN KEY (`schemeId`) REFERENCES `ais_scheme`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_program` ADD CONSTRAINT `ais_program_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_resit` ADD CONSTRAINT `ais_resit_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `ais_course`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_resit` ADD CONSTRAINT `ais_resit_indexno_fkey` FOREIGN KEY (`indexno`) REFERENCES `ais_student`(`indexno`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_resit` ADD CONSTRAINT `ais_resit_registerSessionId_fkey` FOREIGN KEY (`registerSessionId`) REFERENCES `ais_session`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_resit` ADD CONSTRAINT `ais_resit_schemeId_fkey` FOREIGN KEY (`schemeId`) REFERENCES `ais_scheme`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_resit` ADD CONSTRAINT `ais_resit_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_resit_session`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_resit` ADD CONSTRAINT `ais_resit_trailSessionId_fkey` FOREIGN KEY (`trailSessionId`) REFERENCES `ais_session`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_sheet` ADD CONSTRAINT `ais_sheet_assessorId_fkey` FOREIGN KEY (`assessorId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_sheet` ADD CONSTRAINT `ais_sheet_assignStaffId_fkey` FOREIGN KEY (`assignStaffId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_sheet` ADD CONSTRAINT `ais_sheet_certifierId_fkey` FOREIGN KEY (`certifierId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_sheet` ADD CONSTRAINT `ais_sheet_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `ais_course`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_sheet` ADD CONSTRAINT `ais_sheet_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `ais_major`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_sheet` ADD CONSTRAINT `ais_sheet_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `ais_program`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_sheet` ADD CONSTRAINT `ais_sheet_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_sheet` ADD CONSTRAINT `ais_sheet_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_structmeta` ADD CONSTRAINT `ais_structmeta_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `ais_major`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_structmeta` ADD CONSTRAINT `ais_structmeta_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `ais_program`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_structure` ADD CONSTRAINT `ais_structure_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `ais_course`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_structure` ADD CONSTRAINT `ais_structure_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `ais_major`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_structure` ADD CONSTRAINT `ais_structure_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `ais_program`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_structure` ADD CONSTRAINT `ais_structure_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_student` ADD CONSTRAINT `ais_student_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_student` ADD CONSTRAINT `ais_student_disabilityId_fkey` FOREIGN KEY (`disabilityId`) REFERENCES `disability`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_student` ADD CONSTRAINT `ais_student_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `ais_major`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_student` ADD CONSTRAINT `ais_student_maritalId_fkey` FOREIGN KEY (`maritalId`) REFERENCES `marital`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_student` ADD CONSTRAINT `ais_student_nationalityId_fkey` FOREIGN KEY (`nationalityId`) REFERENCES `country`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_student` ADD CONSTRAINT `ais_student_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `ais_program`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_student` ADD CONSTRAINT `ais_student_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_student` ADD CONSTRAINT `ais_student_religionId_fkey` FOREIGN KEY (`religionId`) REFERENCES `religion`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_student` ADD CONSTRAINT `ais_student_titleId_fkey` FOREIGN KEY (`titleId`) REFERENCES `title`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_transwift` ADD CONSTRAINT `ais_transwift_issuerId_fkey` FOREIGN KEY (`issuerId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_transwift` ADD CONSTRAINT `ais_transwift_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `ais_student`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ais_transwift` ADD CONSTRAINT `ais_transwift_transactId_fkey` FOREIGN KEY (`transactId`) REFERENCES `fms_transaction`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_admission` ADD CONSTRAINT `ams_admission_cpletterId_fkey` FOREIGN KEY (`cpletterId`) REFERENCES `ams_letter`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_admission` ADD CONSTRAINT `ams_admission_dpletterId_fkey` FOREIGN KEY (`dpletterId`) REFERENCES `ams_letter`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_admission` ADD CONSTRAINT `ams_admission_pgletterId_fkey` FOREIGN KEY (`pgletterId`) REFERENCES `ams_letter`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_admission` ADD CONSTRAINT `ams_admission_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_admission` ADD CONSTRAINT `ams_admission_ugletterId_fkey` FOREIGN KEY (`ugletterId`) REFERENCES `ams_letter`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_applicant` ADD CONSTRAINT `ams_applicant_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `ams_admission`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_applicant` ADD CONSTRAINT `ams_applicant_applyTypeId_fkey` FOREIGN KEY (`applyTypeId`) REFERENCES `ams_applytype`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_applicant` ADD CONSTRAINT `ams_applicant_choiceId_fkey` FOREIGN KEY (`choiceId`) REFERENCES `ams_step_choice`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_applicant` ADD CONSTRAINT `ams_applicant_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `ams_step_profile`(`serial`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_applicant` ADD CONSTRAINT `ams_applicant_stageId_fkey` FOREIGN KEY (`stageId`) REFERENCES `ams_stage`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_cert_category` ADD CONSTRAINT `ams_cert_category_instituteCategoryId_fkey` FOREIGN KEY (`instituteCategoryId`) REFERENCES `ams_institute_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_form` ADD CONSTRAINT `ams_form_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ams_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_fresher` ADD CONSTRAINT `ams_fresher_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `ams_admission`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_fresher` ADD CONSTRAINT `ams_fresher_billId_fkey` FOREIGN KEY (`billId`) REFERENCES `fms_bill`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_fresher` ADD CONSTRAINT `ams_fresher_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ams_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_fresher` ADD CONSTRAINT `ams_fresher_letterId_fkey` FOREIGN KEY (`letterId`) REFERENCES `ams_letter`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_fresher` ADD CONSTRAINT `ams_fresher_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `ais_major`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_fresher` ADD CONSTRAINT `ams_fresher_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `ais_program`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_fresher` ADD CONSTRAINT `ams_fresher_serial_fkey` FOREIGN KEY (`serial`) REFERENCES `ais_student`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_fresher` ADD CONSTRAINT `ams_fresher_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_grade_weight` ADD CONSTRAINT `ams_grade_weight_certCategoryId_fkey` FOREIGN KEY (`certCategoryId`) REFERENCES `ams_cert_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_letter` ADD CONSTRAINT `ams_letter_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ams_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_price` ADD CONSTRAINT `ams_price_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ams_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_sorted` ADD CONSTRAINT `ams_sorted_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `ams_admission`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_sorted` ADD CONSTRAINT `ams_sorted_applyTypeId_fkey` FOREIGN KEY (`applyTypeId`) REFERENCES `ams_applytype`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_sorted` ADD CONSTRAINT `ams_sorted_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ams_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_sorted` ADD CONSTRAINT `ams_sorted_choice1Id_fkey` FOREIGN KEY (`choice1Id`) REFERENCES `ams_step_choice`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_sorted` ADD CONSTRAINT `ams_sorted_choice2Id_fkey` FOREIGN KEY (`choice2Id`) REFERENCES `ams_step_choice`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_sorted` ADD CONSTRAINT `ams_sorted_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `ams_step_profile`(`serial`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_sorted` ADD CONSTRAINT `ams_sorted_stageId_fkey` FOREIGN KEY (`stageId`) REFERENCES `ams_stage`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_stage` ADD CONSTRAINT `ams_stage_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ams_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_stage` ADD CONSTRAINT `ams_stage_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `ams_form`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_choice` ADD CONSTRAINT `ams_step_choice_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `ais_major`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_choice` ADD CONSTRAINT `ams_step_choice_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `ais_program`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_document` ADD CONSTRAINT `ams_step_document_documentCategoryId_fkey` FOREIGN KEY (`documentCategoryId`) REFERENCES `ams_document_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_education` ADD CONSTRAINT `ams_step_education_certCategoryId_fkey` FOREIGN KEY (`certCategoryId`) REFERENCES `ams_cert_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_education` ADD CONSTRAINT `ams_step_education_instituteCategoryId_fkey` FOREIGN KEY (`instituteCategoryId`) REFERENCES `ams_institute_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_grade` ADD CONSTRAINT `ams_step_grade_gradeWeightId_fkey` FOREIGN KEY (`gradeWeightId`) REFERENCES `ams_grade_weight`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_grade` ADD CONSTRAINT `ams_step_grade_resultId_fkey` FOREIGN KEY (`resultId`) REFERENCES `ams_step_result`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_grade` ADD CONSTRAINT `ams_step_grade_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `ams_subject`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_guardian` ADD CONSTRAINT `ams_step_guardian_relationId_fkey` FOREIGN KEY (`relationId`) REFERENCES `relation`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_guardian` ADD CONSTRAINT `ams_step_guardian_titleId_fkey` FOREIGN KEY (`titleId`) REFERENCES `title`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_profile` ADD CONSTRAINT `ams_step_profile_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_profile` ADD CONSTRAINT `ams_step_profile_disabilityId_fkey` FOREIGN KEY (`disabilityId`) REFERENCES `disability`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_profile` ADD CONSTRAINT `ams_step_profile_maritalId_fkey` FOREIGN KEY (`maritalId`) REFERENCES `marital`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_profile` ADD CONSTRAINT `ams_step_profile_nationalityId_fkey` FOREIGN KEY (`nationalityId`) REFERENCES `country`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_profile` ADD CONSTRAINT `ams_step_profile_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_profile` ADD CONSTRAINT `ams_step_profile_religionId_fkey` FOREIGN KEY (`religionId`) REFERENCES `religion`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_profile` ADD CONSTRAINT `ams_step_profile_titleId_fkey` FOREIGN KEY (`titleId`) REFERENCES `title`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_referee` ADD CONSTRAINT `ams_step_referee_titleId_fkey` FOREIGN KEY (`titleId`) REFERENCES `title`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_step_result` ADD CONSTRAINT `ams_step_result_certCategoryId_fkey` FOREIGN KEY (`certCategoryId`) REFERENCES `ams_cert_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_voucher` ADD CONSTRAINT `ams_voucher_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `ams_admission`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_voucher` ADD CONSTRAINT `ams_voucher_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ams_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ams_voucher` ADD CONSTRAINT `ams_voucher_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `ams_vendor`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evaluation` ADD CONSTRAINT `evaluation_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `ais_course`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evaluation` ADD CONSTRAINT `evaluation_indexno_fkey` FOREIGN KEY (`indexno`) REFERENCES `ais_student`(`indexno`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evaluation` ADD CONSTRAINT `evaluation_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evaluation` ADD CONSTRAINT `evaluation_staffNo_fkey` FOREIGN KEY (`staffNo`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evaluation_response` ADD CONSTRAINT `evaluation_response_evaluationId_fkey` FOREIGN KEY (`evaluationId`) REFERENCES `evaluation`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evaluation_response` ADD CONSTRAINT `evaluation_response_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `evaluation_option`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evaluation_response` ADD CONSTRAINT `evaluation_response_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `evaluation_question`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evs_attack` ADD CONSTRAINT `evs_attack_electionId_fkey` FOREIGN KEY (`electionId`) REFERENCES `evs_election`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evs_candidate` ADD CONSTRAINT `evs_candidate_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `evs_portfolio`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evs_election` ADD CONSTRAINT `evs_election_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `sso_group`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evs_elector` ADD CONSTRAINT `evs_elector_electionId_fkey` FOREIGN KEY (`electionId`) REFERENCES `evs_election`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `evs_portfolio` ADD CONSTRAINT `evs_portfolio_electionId_fkey` FOREIGN KEY (`electionId`) REFERENCES `evs_election`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_activity_bill` ADD CONSTRAINT `fms_activity_bill_billId_fkey` FOREIGN KEY (`billId`) REFERENCES `fms_bill`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_activity_bill` ADD CONSTRAINT `fms_activity_bill_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `sso_user`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_activity_voucher` ADD CONSTRAINT `fms_activity_voucher_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `ams_admission`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_activity_voucher` ADD CONSTRAINT `fms_activity_voucher_transactId_fkey` FOREIGN KEY (`transactId`) REFERENCES `fms_transaction`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_bankacc` ADD CONSTRAINT `fms_bankacc_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_bill` ADD CONSTRAINT `fms_bill_bankaccId_fkey` FOREIGN KEY (`bankaccId`) REFERENCES `fms_bankacc`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_bill` ADD CONSTRAINT `fms_bill_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `ais_program`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_bill` ADD CONSTRAINT `fms_bill_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_charge` ADD CONSTRAINT `fms_charge_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `ais_student`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_studaccount` ADD CONSTRAINT `fms_studaccount_billId_fkey` FOREIGN KEY (`billId`) REFERENCES `fms_bill`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_studaccount` ADD CONSTRAINT `fms_studaccount_chargeId_fkey` FOREIGN KEY (`chargeId`) REFERENCES `fms_charge`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_studaccount` ADD CONSTRAINT `fms_studaccount_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ais_session`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_studaccount` ADD CONSTRAINT `fms_studaccount_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `ais_student`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_studaccount` ADD CONSTRAINT `fms_studaccount_transactId_fkey` FOREIGN KEY (`transactId`) REFERENCES `fms_transaction`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_transaction` ADD CONSTRAINT `fms_transaction_bankaccId_fkey` FOREIGN KEY (`bankaccId`) REFERENCES `fms_bankacc`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_transaction` ADD CONSTRAINT `fms_transaction_collectorId_fkey` FOREIGN KEY (`collectorId`) REFERENCES `fms_collector`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_transaction` ADD CONSTRAINT `fms_transaction_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `ais_student`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_transaction` ADD CONSTRAINT `fms_transaction_transtypeId_fkey` FOREIGN KEY (`transtypeId`) REFERENCES `fms_transtype`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fms_transtype` ADD CONSTRAINT `fms_transtype_bankaccId_fkey` FOREIGN KEY (`bankaccId`) REFERENCES `fms_bankacc`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_circular` ADD CONSTRAINT `hrs_circular_uploadId_fkey` FOREIGN KEY (`uploadId`) REFERENCES `hrs_upload`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_form` ADD CONSTRAINT `hrs_form_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `hrs_form_type`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_leave` ADD CONSTRAINT `hrs_leave_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_leave` ADD CONSTRAINT `hrs_leave_leaveCategoryId_fkey` FOREIGN KEY (`leaveCategoryId`) REFERENCES `hrs_leave_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_leave` ADD CONSTRAINT `hrs_leave_relieverId_fkey` FOREIGN KEY (`relieverId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_leave` ADD CONSTRAINT `hrs_leave_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_leave` ADD CONSTRAINT `hrs_leave_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_leave_approver` ADD CONSTRAINT `hrs_leave_approver_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_leave_balance` ADD CONSTRAINT `hrs_leave_balance_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_leave_defer` ADD CONSTRAINT `hrs_leave_defer_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_leave_defer` ADD CONSTRAINT `hrs_leave_defer_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_leave_defer` ADD CONSTRAINT `hrs_leave_defer_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_leave_weight` ADD CONSTRAINT `hrs_leave_weight_leaveCategoryId_fkey` FOREIGN KEY (`leaveCategoryId`) REFERENCES `hrs_leave_category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_nss` ADD CONSTRAINT `hrs_nss_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_nss` ADD CONSTRAINT `hrs_nss_maritalId_fkey` FOREIGN KEY (`maritalId`) REFERENCES `marital`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_nss` ADD CONSTRAINT `hrs_nss_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_nss` ADD CONSTRAINT `hrs_nss_religionId_fkey` FOREIGN KEY (`religionId`) REFERENCES `religion`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_nss` ADD CONSTRAINT `hrs_nss_titleId_fkey` FOREIGN KEY (`titleId`) REFERENCES `title`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_nss` ADD CONSTRAINT `hrs_nss_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_option` ADD CONSTRAINT `hrs_option_atttachId_fkey` FOREIGN KEY (`atttachId`) REFERENCES `hrs_upload`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_option` ADD CONSTRAINT `hrs_option_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `hrs_question`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_position` ADD CONSTRAINT `hrs_position_positionInfoId_fkey` FOREIGN KEY (`positionInfoId`) REFERENCES `hrs_position_info`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_position` ADD CONSTRAINT `hrs_position_scaleId_fkey` FOREIGN KEY (`scaleId`) REFERENCES `hrs_scale`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_position` ADD CONSTRAINT `hrs_position_staffNo_fkey` FOREIGN KEY (`staffNo`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_position_info` ADD CONSTRAINT `hrs_position_info_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_promotion` ADD CONSTRAINT `hrs_promotion_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `hrs_job`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_promotion` ADD CONSTRAINT `hrs_promotion_scaleId_fkey` FOREIGN KEY (`scaleId`) REFERENCES `hrs_scale`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_promotion` ADD CONSTRAINT `hrs_promotion_staffNo_fkey` FOREIGN KEY (`staffNo`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_question` ADD CONSTRAINT `hrs_question_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `hrs_form`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_question` ADD CONSTRAINT `hrs_question_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `hrs_section`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_relative` ADD CONSTRAINT `hrs_relative_relationId_fkey` FOREIGN KEY (`relationId`) REFERENCES `relation`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_relative` ADD CONSTRAINT `hrs_relative_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_relative` ADD CONSTRAINT `hrs_relative_titleId_fkey` FOREIGN KEY (`titleId`) REFERENCES `title`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_respondent` ADD CONSTRAINT `hrs_respondent_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_respondent` ADD CONSTRAINT `hrs_respondent_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_response` ADD CONSTRAINT `hrs_response_attachId_fkey` FOREIGN KEY (`attachId`) REFERENCES `hrs_upload`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_response` ADD CONSTRAINT `hrs_response_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `hrs_question`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_response` ADD CONSTRAINT `hrs_response_respondentId_fkey` FOREIGN KEY (`respondentId`) REFERENCES `hrs_respondent`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_staff` ADD CONSTRAINT `hrs_staff_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_staff` ADD CONSTRAINT `hrs_staff_firstOfferId_fkey` FOREIGN KEY (`firstOfferId`) REFERENCES `hrs_promotion`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_staff` ADD CONSTRAINT `hrs_staff_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `hrs_job`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_staff` ADD CONSTRAINT `hrs_staff_maritalId_fkey` FOREIGN KEY (`maritalId`) REFERENCES `marital`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_staff` ADD CONSTRAINT `hrs_staff_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `hrs_position`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_staff` ADD CONSTRAINT `hrs_staff_promotionId_fkey` FOREIGN KEY (`promotionId`) REFERENCES `hrs_promotion`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_staff` ADD CONSTRAINT `hrs_staff_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_staff` ADD CONSTRAINT `hrs_staff_religionId_fkey` FOREIGN KEY (`religionId`) REFERENCES `religion`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_staff` ADD CONSTRAINT `hrs_staff_titleId_fkey` FOREIGN KEY (`titleId`) REFERENCES `title`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_staff` ADD CONSTRAINT `hrs_staff_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_transfer` ADD CONSTRAINT `hrs_transfer_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_transfer` ADD CONSTRAINT `hrs_transfer_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_transfer` ADD CONSTRAINT `hrs_transfer_fromUnitId_fkey` FOREIGN KEY (`fromUnitId`) REFERENCES `unit`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_transfer` ADD CONSTRAINT `hrs_transfer_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `hrs_staff`(`staffNo`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `hrs_transfer` ADD CONSTRAINT `hrs_transfer_toUnitId_fkey` FOREIGN KEY (`toUnitId`) REFERENCES `unit`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sso_arole` ADD CONSTRAINT `sso_arole_appId_fkey` FOREIGN KEY (`appId`) REFERENCES `sso_app`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sso_provider` ADD CONSTRAINT `sso_provider_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `sso_user`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sso_urole` ADD CONSTRAINT `sso_urole_appRoleId_fkey` FOREIGN KEY (`appRoleId`) REFERENCES `sso_arole`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sso_urole` ADD CONSTRAINT `sso_urole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `sso_user`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sso_user` ADD CONSTRAINT `sso_user_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `sso_group`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `unit` ADD CONSTRAINT `unit_level1Id_fkey` FOREIGN KEY (`level1Id`) REFERENCES `unit`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `unit` ADD CONSTRAINT `unit_level2Id_fkey` FOREIGN KEY (`level2Id`) REFERENCES `unit`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `unit` ADD CONSTRAINT `unit_level3Id_fkey` FOREIGN KEY (`level3Id`) REFERENCES `unit`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `_appToprovider_B_index` ON `_appToprovider` (`B`);--> statement-breakpoint
CREATE INDEX `ais_assessment_sessionId_courseId_indexno_idx` ON `ais_assessment` (`sessionId`,`courseId`,`indexno`);--> statement-breakpoint
CREATE INDEX `ais_assessment_sessionId_courseId_semesterNum_idx` ON `ais_assessment` (`sessionId`,`courseId`,`semesterNum`);--> statement-breakpoint
CREATE INDEX `ais_sheet_sessionId_programId_courseId_semesterNum_majorId_idx` ON `ais_sheet` (`sessionId`,`programId`,`courseId`,`semesterNum`,`majorId`);--> statement-breakpoint
CREATE INDEX `fms_studaccount_billId_idx` ON `fms_studaccount` (`billId`);--> statement-breakpoint
CREATE INDEX `fms_studaccount_chargeId_idx` ON `fms_studaccount` (`chargeId`);--> statement-breakpoint
CREATE INDEX `fms_studaccount_narrative_idx` ON `fms_studaccount` (`narrative`);--> statement-breakpoint
CREATE INDEX `fms_studaccount_sessionId_idx` ON `fms_studaccount` (`sessionId`);--> statement-breakpoint
CREATE INDEX `fms_studaccount_studentId_idx` ON `fms_studaccount` (`studentId`);--> statement-breakpoint
CREATE INDEX `fms_transaction_reference_idx` ON `fms_transaction` (`reference`);--> statement-breakpoint
CREATE INDEX `fms_transaction_studentId_idx` ON `fms_transaction` (`studentId`);--> statement-breakpoint
CREATE INDEX `fms_transaction_transtag_idx` ON `fms_transaction` (`transtag`);--> statement-breakpoint
CREATE ALGORITHM = undefined
SQL SECURITY definer
VIEW `broadsheet` AS (select `x`.`id` AS `id`,`x`.`sessionId` AS `sessionId`,`x`.`schemeId` AS `schemeId`,`x`.`courseId` AS `courseId`,`x`.`indexno` AS `indexno`,`x`.`credit` AS `credit`,`x`.`semesterNum` AS `semesterNum`,`x`.`classScore` AS `classScore`,`x`.`examScore` AS `examScore`,`x`.`totalScore` AS `totalScore`,`x`.`type` AS `type`,`x`.`scoreA` AS `scoreA`,`x`.`scoreB` AS `scoreB`,`x`.`scoreC` AS `scoreC`,`x`.`status` AS `status`,`x`.`createdAt` AS `createdAt`,`x`.`updatedAt` AS `updatedAt`,`c`.`title` AS `courseTitle`,upper(`s`.`fname`) AS `fname`,upper(`s`.`mname`) AS `mname`,upper(`s`.`lname`) AS `lname`,`p`.`longName` AS `program`,`s`.`semesterNum` AS `curSemesterNum`,`s`.`completeStatus` AS `completeStatus`,`s`.`deferStatus` AS `deferStatus`,`s`.`programId` AS `programId` from (((`aucc`.`ais_assessment` `x` left join `aucc`.`ais_course` `c` on((`x`.`courseId` = `c`.`id`))) left join `aucc`.`ais_student` `s` on((`s`.`indexno` = `x`.`indexno`))) left join `aucc`.`ais_program` `p` on((`s`.`programId` = `p`.`id`))) where `x`.`indexno` in (select `s`.`indexno` from (`aucc`.`ais_student` `s` left join `aucc`.`ais_program` `p` on((`s`.`programId` = `p`.`id`))) where (`s`.`semesterNum` = `p`.`semesterTotal`) order by `s`.`programId`,`s`.`indexno`,`x`.`semesterNum`));
*/