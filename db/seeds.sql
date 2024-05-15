-- Inserting Data into the Department Table
INSERT INTO departments (department_id, department_name) VALUES
(1, 'Engineering'),
(2, 'Finance'),
(3, 'Legal');

-- Inserting Data into the Role Table
INSERT INTO roles (role_id, role_title, role_salary, department_id) VALUES
(1, 'Lead Engineer', 98000, 1),
(2, 'Account Manager', 85000, 2),
(3, 'Lawyer', 90000, 3);

-- Inserting Data into the Employee Table
INSERT INTO employees (employee_id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Brown', 1, NULL), -- Lead Engineer with no manager
(2, 'Sarah', 'Green', 2, NULL), -- Account Manager with no manager
(3, 'Amanda', 'White', 3, 2); -- Lawyer managed by Jane Smith