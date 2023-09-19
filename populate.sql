INSERT INTO group_table(name) VALUES ('Dashboard');
INSERT INTO group_table(name) VALUES ('Content');
INSERT INTO group_table(name) VALUES ('Modules');
INSERT INTO group_table(name,parent_id) VALUES ('Modules-test',2);
INSERT INTO group_table(name,parent_id) VALUES ('User Modules',1);
INSERT INTO group_table(name,parent_id) VALUES ('Categories',3);
INSERT INTO group_table(name,parent_id) VALUES ('Test-cat',3);
INSERT INTO group_table(name,parent_id) VALUES ('Dinamo',6);
INSERT INTO group_table(name) VALUES ('Adrians');
INSERT INTO group_table(name,parent_id) VALUES ('Bayern',9);

INSERT INTO person_table(first_name,last_name,job) VALUES ('Josh','Henry','Mecanic');
INSERT INTO person_table(first_name,last_name,job) VALUES ('Radu','Ninel','Bucatar');
INSERT INTO person_table(first_name,last_name,job) VALUES ('Carmen','Florea','Chelnerita');
INSERT INTO person_table(first_name,last_name,job) VALUES ('Adrian','Mihalcea','Mecanic');
INSERT INTO person_table(first_name,last_name,job) VALUES ('Green','Van','Bucatar');

INSERT INTO group_person_table(group_id,person_id) VALUES (1,1);
INSERT INTO group_person_table(group_id,person_id) VALUES (2,3);
INSERT INTO group_person_table(group_id,person_id) VALUES (5,2);
INSERT INTO group_person_table(group_id,person_id) VALUES (5,5);
INSERT INTO group_person_table(group_id,person_id) VALUES (8,5);
INSERT INTO group_person_table(group_id,person_id) VALUES (6,4);
INSERT INTO group_person_table(group_id,person_id) VALUES (4,5);
