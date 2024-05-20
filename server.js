const inquirer = require("inquirer");
const { Pool } = require("pg");

// Connect to database
const pool = new Pool({
  user: "postgres",
  password: "",
  host: "localhost",
  database: "staff_nagivator_db",
});

pool.connect();

// Main function
async function main() {
  while (true) {
    const { choice } = await inquirer.prompt({
      type: "list",
      name: "choice",
      message: "Options:",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Quit",
      ],
    });

    switch (choice) {
      case "View all departments":
        await viewAllDepartments();
        break;
      case "View all roles":
        await viewAllRoles();
        break;
      case "View all employees":
        await viewAllEmployees();
        break;
      case "Add a department":
        await addDepartment();
        break;
      case "Add a role":
        await addRole();
        break;
      case "Add an employee":
        await addEmployee();
        break;
      case "Update an employee role":
        await updateEmployeeRole();
        break;
      case "Quit":
        console.log("Quitting...");
        pool.end();
        return;
    }
  }
}

// Function to view all departments
async function viewAllDepartments() {
  const query = "SELECT * FROM departments";
  const result = await pool.query(query);
  console.table(result.rows);
}

// Function to view all roles
async function viewAllRoles() {
  const query =
    "SELECT roles.role_title, roles.role_id, departments.department_name, roles.role_salary FROM roles INNER JOIN departments ON roles.department_id = departments.department_id";
  const result = await pool.query(query);
  console.table(result.rows);
}

// Function to view all employees
async function viewAllEmployees() {
  const query =
    "SELECT employees.employee_id, employees.first_name, employees.last_name, roles.role_title, departments.department_name, roles.role_salary, employees.manager_id FROM employees INNER JOIN roles ON employees.role_id = roles.role_id INNER JOIN departments ON roles.department_id = departments.department_id";
  const result = await pool.query(query);
  console.table(result.rows);
}

// Function to add a department
async function addDepartment() {
  const { department_name } = await inquirer.prompt({
    type: "input",
    name: "department_name",
    message: "Enter the name of the department:",
    validate: function (input) {
      if (input.trim() === "") {
        return "Department name cannot be empty";
      }
      return true;
    },
  });
  try {
    await pool.query("BEGIN");
    await pool.query("INSERT INTO departments (department_name) VALUES ($1)", [department_name]);
    console.log("Department successfully added.");
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error adding department:", error.message);
  }
}

// Function to add a role
async function addRole() {
  const departments = await pool.query("SELECT * FROM departments");
  const { role_title, role_salary, department_id } = await inquirer.prompt([
    // Your prompts for role details
  ]);

  try {
    await pool.query("BEGIN");
    await pool.query(
      "INSERT INTO roles (role_title, role_salary, department_id) VALUES ($1, $2, $3)",
      [role_title, role_salary, department_id]
    );
    console.log("Role successfully added.");
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error adding role:", error.message);
  }
}

// Function to add an employee
async function addEmployee() {
  const roles = await pool.query("SELECT * FROM roles");
  const employees = await pool.query("SELECT * FROM employees");
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    // Your prompts for employee details
  ]);
  try {
    await pool.query("BEGIN");
    await pool.query(
      "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
      [first_name, last_name, role_id, manager_id]
    );
    console.log("Employee successfully added.");
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error adding employee:", error.message);
  }
}

// Function to update an employee role
async function updateEmployeeRole() {
  try {
    const employees = await pool.query("SELECT * FROM employees");
    const roles = await pool.query("SELECT * FROM roles");
    const { employee_id, role_id } = await inquirer.prompt([
      // Your prompts for updating employee role
    ]);

    const query = "UPDATE employees SET role_id = $1 WHERE employee_id = $2";
    await pool.query(query, [role_id, employee_id]);

    console.log("Employee role successfully updated.");
  } catch (error) {
    console.error("Error updating employee role:", error.message);
  }
}

// Start the application
main();
