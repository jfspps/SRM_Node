-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema LINQ
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema LINQ
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `LINQ` DEFAULT CHARACTER SET utf8 ;
USE `LINQ` ;

-- -----------------------------------------------------
-- Table `LINQ`.`Students`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Students` (
  `idStudents` INT NOT NULL AUTO_INCREMENT COMMENT 'This table lists the student personal details.\nAn identifying relationship means that the parent is needed to give identity to child. The child solely exists because of parent. This means that the foreign key is a primary key too.\nStudents cannot be enrolled in a school without a legal Guardian, so the relationship is identifying (idStudent embeds idGuardians in its PK).\nSome subject may be availble but are not currently taken up by any student or some subject may be undergoing prep; student-subject relationship it not identifying',
  `Student_fname` VARCHAR(45) NOT NULL,
  `Student_lname` VARCHAR(45) NOT NULL,
  `Student_mid_initials` VARCHAR(10) NULL,
  `Student_email` VARCHAR(45) NULL,
  `Student_phone` VARCHAR(20) NULL COMMENT 'ITU recommendation of 15 digits',
  PRIMARY KEY (`idStudents`),
  UNIQUE INDEX `Student_id_UNIQUE` (`idStudents` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Guardians`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Guardians` (
  `idGuardians` INT NOT NULL AUTO_INCREMENT,
  `Guardian_fname` VARCHAR(45) NOT NULL,
  `Guardian_lname` VARCHAR(45) NOT NULL,
  `Guardian_phone` VARCHAR(15) NOT NULL,
  `Guardian_email` VARCHAR(45) NOT NULL,
  `Guardian_2nd_email` VARCHAR(45) NULL,
  `Student_id` INT NOT NULL,
  PRIMARY KEY (`idGuardians`, `Student_id`),
  UNIQUE INDEX `idGuardians1_UNIQUE` (`idGuardians` ASC) INVISIBLE,
  INDEX `Student_id_idx` (`Student_id` ASC) VISIBLE,
  CONSTRAINT `Student_id`
    FOREIGN KEY (`Student_id`)
    REFERENCES `LINQ`.`Students` (`idStudents`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Subjects`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Subjects` (
  `idSubjects` INT NOT NULL AUTO_INCREMENT,
  `Subject_title` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idSubjects`),
  UNIQUE INDEX `idSubjects_UNIQUE` (`idSubjects` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Teachers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Teachers` (
  `idTeachers` INT NOT NULL AUTO_INCREMENT COMMENT 'Re. assignments\nAt the beginning of the year, there may be zero assignments set. However, the assignment, once submitted, can be accessed (borrowed e.g. year-wide exams) by at least one teacher and possible many more.\nEach assignment set requires only one teacher to set it; in LINQ, it is assumed that multiple teachers do not submit the same assignment.',
  `Teacher_fname` VARCHAR(45) NOT NULL,
  `Teacher_lname` VARCHAR(45) NOT NULL,
  `Form_group_name` VARCHAR(45) NULL COMMENT 'Not all teachers are pastoral tutors; when they are this field names the group e.g. 10SB\nPlacing it in Teachers table instead of Students_JUNC_teachers table minimises repeated entries',
  `Teacher_work_email` VARCHAR(45) NOT NULL,
  `Teacher_phone` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTeachers`),
  UNIQUE INDEX `idTeachers_UNIQUE` (`idTeachers` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Subjects_Teachers_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Subjects_Teachers_group` (
  `idSubjects_Teachers_group` INT NOT NULL AUTO_INCREMENT COMMENT 'Lists the subjects taught by a given teacher with a name for that class e.g. Chem8B etc...',
  `Subject_class_name` VARCHAR(45) NULL,
  `Subject_id` INT NOT NULL,
  `Teacher_id` INT NOT NULL,
  PRIMARY KEY (`idSubjects_Teachers_group`, `Subject_id`, `Teacher_id`),
  UNIQUE INDEX `idSubjects_Teachers_group_UNIQUE` (`idSubjects_Teachers_group` ASC) VISIBLE,
  INDEX `Subject_id_idx` (`Subject_id` ASC) VISIBLE,
  INDEX `Teacher_id_idx` (`Teacher_id` ASC) VISIBLE,
  CONSTRAINT `Subject_id`
    FOREIGN KEY (`Subject_id`)
    REFERENCES `LINQ`.`Subjects` (`idSubjects`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Teacher_id`
    FOREIGN KEY (`Teacher_id`)
    REFERENCES `LINQ`.`Teachers` (`idTeachers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Academic_class`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Academic_class` (
  `Student_id` INT NOT NULL,
  `Subjects_Teachers_group_id` INT NOT NULL COMMENT 'This junction could be used to list the students a subject teacher teaches, or vice versa.',
  INDEX `fk_Subjects_Teachers_group_has_Students_Students1_idx` (`Student_id` ASC) VISIBLE,
  INDEX `fk_Subjects_Teachers_group_has_Students_Subjects_Teachers_g_idx` (`Subjects_Teachers_group_id` ASC) VISIBLE,
  PRIMARY KEY (`Student_id`, `Subjects_Teachers_group_id`),
  CONSTRAINT `fk_Subjects_Teachers_group_has_Students_Subjects_Teachers_gro1`
    FOREIGN KEY (`Subjects_Teachers_group_id`)
    REFERENCES `LINQ`.`Subjects_Teachers_group` (`idSubjects_Teachers_group`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Subjects_Teachers_group_has_Students_Students1`
    FOREIGN KEY (`Student_id`)
    REFERENCES `LINQ`.`Students` (`idStudents`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Form_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Form_group` (
  `Student_id` INT NOT NULL,
  `Teacher_id` INT NOT NULL COMMENT 'This junction could be used to list the students a form tutor is responsible for, or vice versa.',
  INDEX `fk_Teachers_has_Students_Students1_idx` (`Student_id` ASC) VISIBLE,
  INDEX `fk_Teachers_has_Students_Teachers1_idx` (`Teacher_id` ASC) VISIBLE,
  PRIMARY KEY (`Student_id`, `Teacher_id`),
  CONSTRAINT `Teacher_id_form_group`
    FOREIGN KEY (`Teacher_id`)
    REFERENCES `LINQ`.`Teachers` (`idTeachers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Student_id_form_group`
    FOREIGN KEY (`Student_id`)
    REFERENCES `LINQ`.`Students` (`idStudents`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Assignments_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Assignments_info` (
  `idAssignments_info` INT NOT NULL AUTO_INCREMENT COMMENT 'One-to-one relationship with Assignments_sub_by_a_teacher (Assignment_details is the parent and is needed by Assignments_sub_by_a_teacher)\nIf there are assignment details present (or inserted into LINQ), then there must be a record of who submitted it. The details apply to only one submission.\nIf one assignment is submitted by one teacher then the assignment has unique assignment details.\n\nAssignments need not have a threshold set and would normally only have one threshold. Conversely, for a threshold to exist, there must be at least one assignment ready, the same threshold could apply to different assignments.\n\nOnce prepared, there need not be any student scores yet but mutliple scores at best. Conversely, for a student record to exist, there must be at least one assignment with details prepared. It is assumed that the assignment score and comments are unique to the assignment taken. Hence the relationship is identifying.',
  `Assignment_title` VARCHAR(45) NOT NULL,
  `Assignment_info` VARCHAR(100) NULL,
  `Max_raw_score` INT NOT NULL DEFAULT 100,
  `Type_of_assessment` CHAR NOT NULL,
  PRIMARY KEY (`idAssignments_info`),
  UNIQUE INDEX `idAssignments_UNIQUE` (`idAssignments_info` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Assignments_sub_by_a_teacher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Assignments_sub_by_a_teacher` (
  `idAssignments_sub_by_a_teacher` INT NOT NULL AUTO_INCREMENT COMMENT 'This table shows who set the assignment and when. It also indicates if the assignment should contribute to the cumulative average of the end-of-term summary.\n',
  `Assignment_entry_date` DATE NOT NULL,
  `Add_to_average` TINYINT NOT NULL DEFAULT 1 COMMENT 'Set to zero if this assignment should not contribute to the cumulative average.',
  `Assignment_id` INT NOT NULL,
  `Teacher_id` INT NOT NULL COMMENT 'If the teacher leaves then Teacher_id (a FK) is set to NULL',
  PRIMARY KEY (`idAssignments_sub_by_a_teacher`),
  UNIQUE INDEX `idTeacher_assignments_UNIQUE` (`idAssignments_sub_by_a_teacher` ASC) VISIBLE,
  INDEX `Assignment_id_sub_idx` (`Assignment_id` ASC) VISIBLE,
  INDEX `Teacher_id_sub_idx` (`Teacher_id` ASC) VISIBLE,
  CONSTRAINT `Assignment_id_sub`
    FOREIGN KEY (`Assignment_id`)
    REFERENCES `LINQ`.`Assignments_info` (`idAssignments_info`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Teacher_id_sub`
    FOREIGN KEY (`Teacher_id`)
    REFERENCES `LINQ`.`Teachers` (`idTeachers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Student_assignments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Student_assignments` (
  `idStudent_assignments` INT NOT NULL AUTO_INCREMENT,
  `Assignment_id` INT NOT NULL,
  `Comments_for_guardians` VARCHAR(300) NULL,
  `Comments_for_staff` VARCHAR(300) NULL,
  `Raw_score` INT NULL COMMENT 'Allow NULL for students who were absent (ignored when average is tallied)',
  `Student_id` INT NOT NULL,
  PRIMARY KEY (`idStudent_assignments`, `Assignment_id`),
  UNIQUE INDEX `idStudent_assignments_UNIQUE` (`idStudent_assignments` ASC) VISIBLE,
  INDEX `Assignment_id_idx` (`Assignment_id` ASC) VISIBLE,
  INDEX `Student_id_idx` (`Student_id` ASC) VISIBLE,
  CONSTRAINT `Students_Assignment_id`
    FOREIGN KEY (`Assignment_id`)
    REFERENCES `LINQ`.`Assignments_info` (`idAssignments_info`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Student_id_assignments`
    FOREIGN KEY (`Student_id`)
    REFERENCES `LINQ`.`Students` (`idStudents`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Grading_groups`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Grading_groups` (
  `idGrading_groups` INT NOT NULL AUTO_INCREMENT,
  `Assignments_id` INT NOT NULL,
  PRIMARY KEY (`idGrading_groups`, `Assignments_id`),
  UNIQUE INDEX `idLetter_grade_groups_UNIQUE` (`idGrading_groups` ASC) VISIBLE,
  INDEX `Assignment_id_threshold_idx` (`Assignments_id` ASC) VISIBLE,
  CONSTRAINT `Assignment_id_threshold`
    FOREIGN KEY (`Assignments_id`)
    REFERENCES `LINQ`.`Assignments_info` (`idAssignments_info`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Grade_thresholds`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Grade_thresholds` (
  `idGrade_thresholds` INT NOT NULL AUTO_INCREMENT COMMENT 'If grade thresholds exist, then a group must have been instantiated. The thresholds might apply to different assignments (papers of the same type, or, use of Cambridge\'s PUM). If a grading group exists then there must be numerical thresholds in mind. Hence the identifying relationship.',
  `Highest_raw_threshold` INT NOT NULL,
  `High1_raw` INT NULL,
  `High2_raw` INT NULL,
  `High3_raw` INT NULL,
  `High4_raw` INT NULL,
  `High5_raw` INT NULL,
  `High6_raw` INT NULL,
  `High7_raw` INT NULL,
  `High8_raw` INT NULL,
  `High9_raw` INT NULL,
  `High10_raw` INT NULL,
  `High11_raw` INT NULL,
  `High12_raw` INT NULL,
  `High13_raw` INT NULL,
  `High14_raw` INT NULL,
  `High15_raw` INT NULL,
  `High16_raw` INT NULL,
  `High17_raw` INT NULL,
  `High18_raw` INT NULL,
  `Lowest_raw` INT NOT NULL DEFAULT 0,
  `Grading_group_id` INT NOT NULL,
  PRIMARY KEY (`idGrade_thresholds`, `Grading_group_id`),
  UNIQUE INDEX `idLetter_grade_thresholds_UNIQUE` (`idGrade_thresholds` ASC) VISIBLE,
  INDEX `Grading_group_id_threshold_idx` (`Grading_group_id` ASC) VISIBLE,
  CONSTRAINT `Grading_group_id_threshold`
    FOREIGN KEY (`Grading_group_id`)
    REFERENCES `LINQ`.`Grading_groups` (`idGrading_groups`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Letter_grade_chars`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Letter_grade_chars` (
  `idLetter_grade_chars` INT NOT NULL AUTO_INCREMENT COMMENT 'Letter grades (A, B+, D--, A*, MERIT, DISTINCTION, PASS etc.)\n\nIf grading chars is implemented then there must be at least one grading group present. The sequence of cahrs used might apply to multiple gradings with different numerical thresholds. Grading_chars need not exist for grading groups to exist, hence non-identifying.',
  `Highest_char` VARCHAR(11) NOT NULL,
  `High1_char` VARCHAR(11) NULL,
  `High2_char` VARCHAR(11) NULL,
  `High3_char` VARCHAR(11) NULL,
  `High4_char` VARCHAR(11) NULL,
  `High5_char` VARCHAR(11) NULL,
  `High6_char` VARCHAR(11) NULL,
  `High7_char` VARCHAR(11) NULL,
  `High8_char` VARCHAR(11) NULL,
  `High9_char` VARCHAR(11) NULL,
  `High10_char` VARCHAR(11) NULL,
  `High11_char` VARCHAR(11) NULL,
  `High12_char` VARCHAR(11) NULL,
  `High13_char` VARCHAR(11) NULL,
  `High14_char` VARCHAR(11) NULL,
  `High15_char` VARCHAR(11) NULL,
  `High16_char` VARCHAR(11) NULL,
  `High17_char` VARCHAR(11) NULL,
  `High18_char` VARCHAR(11) NULL,
  `Lowest_char` VARCHAR(11) NOT NULL,
  `Grading_group_id` INT NOT NULL,
  PRIMARY KEY (`idLetter_grade_chars`, `Grading_group_id`),
  UNIQUE INDEX `idLetter_grade_chars_UNIQUE` (`idLetter_grade_chars` ASC) VISIBLE,
  INDEX `Grading_group_id_letters_idx` (`Grading_group_id` ASC) VISIBLE,
  CONSTRAINT `Grading_group_id_letters`
    FOREIGN KEY (`Grading_group_id`)
    REFERENCES `LINQ`.`Grading_groups` (`idGrading_groups`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Students_JUNC_Subjects`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Students_JUNC_Subjects` (
  `Student_id` INT NOT NULL COMMENT 'Part of a composite PK\nThe junction is needed to faciliate a direct link between many-to-many relationships.\nThis junction (bridge) could be used to list the subjects that are taken by a particular student, or vice versa.',
  `Subject_id` INT NOT NULL COMMENT 'Part of a composite PK',
  INDEX `fk_Students_has_Subjects_Subjects1_idx` (`Subject_id` ASC) VISIBLE,
  INDEX `fk_Students_has_Subjects_Students1_idx` (`Student_id` ASC) VISIBLE,
  PRIMARY KEY (`Subject_id`, `Student_id`),
  CONSTRAINT `Students_id`
    FOREIGN KEY (`Student_id`)
    REFERENCES `LINQ`.`Students` (`idStudents`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Subjects_id`
    FOREIGN KEY (`Subject_id`)
    REFERENCES `LINQ`.`Subjects` (`idSubjects`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LINQ`.`Guardians_addresses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `LINQ`.`Guardians_addresses` (
  `idGuardians_addresses` INT NOT NULL AUTO_INCREMENT,
  `First_line` VARCHAR(45) NOT NULL,
  `Second_line` VARCHAR(45) NULL,
  `County_State` VARCHAR(45) NULL,
  `Postcode_ZIPcode` VARCHAR(10) NOT NULL,
  `Country` VARCHAR(45) NULL,
  `Guardian_id` INT NULL,
  UNIQUE INDEX `idAddresses_UNIQUE` (`idGuardians_addresses` ASC) VISIBLE,
  PRIMARY KEY (`idGuardians_addresses`),
  INDEX `Guardian1_address_idx` (`Guardian_id` ASC) VISIBLE,
  CONSTRAINT `Guardian1_address`
    FOREIGN KEY (`Guardian_id`)
    REFERENCES `LINQ`.`Guardians` (`idGuardians`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
