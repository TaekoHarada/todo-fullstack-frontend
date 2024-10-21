const LOGINID = "test";
const LOGINPASS = "test";

describe("Case1: E2E Test", () => {
  it("Case 1: ", () => {
    //// LOGIN-001:	Login (Success)
    cy.login(LOGINID, LOGINPASS);
    cy.url().should("eq", Cypress.config().baseUrl + "/"); // Verify the URL

    //// TODO-001:	Display the existing todos
    cy.get('[data-testid="todo-list"] li').should("have.length.greaterThan", 1);

    //// TODO-002:	Add a new todo
    const newTodo = "Case 1: New task added by Cypress testing.";
    cy.addNew(newTodo);

    //// TODO-002:	Add a new todo
    const newTodo2 = "Case 1: New task 2 added by Cypress testing.";
    cy.addNew(newTodo2);

    //// TODO-005:	Edit todo as completed
    // Get the last added item
    cy.get('[data-testid="todo-list"] li span').last().as("lastTodo");
    // Assess the item is not completed
    cy.get("@lastTodo").should("not.have.class", "line-through");
    cy.get("@lastTodo").click();
    // Assess the item is completed
    cy.get("@lastTodo").should("have.class", "line-through");

    //// TODO-004:	Delete todo
    // Select the last todo item and alias it
    cy.get('[data-testid="todo-list"] li').last().as("deleteTodo");

    // Ensure there is at least one todo item
    cy.get("@deleteTodo").should("exist");

    // Click the "Delete" button on the last todo item
    cy.get("@deleteTodo")
      .find("button")
      .contains("Delete")
      .should("be.visible")
      .click();

    cy.wait(1000); // Wait
    // Ensure the last todo item is removed from the list
    cy.get('[data-testid="todo-list"] li').should("not.contain", newTodo2);
    //// LOGOUT-001:	Logout
    cy.logout();
  });

  it("Case 2: ", () => {
    //// LOGIN-001:	Login (Success)
    cy.login(LOGINID, LOGINPASS);
    cy.url().should("eq", Cypress.config().baseUrl + "/"); // Verify the URL

    //// TODO-001:	Display the existing todos
    cy.get('[data-testid="todo-list"] li').should("have.length.greaterThan", 1);

    //// TODO-003:	Add with empty fields (Cypress not allowing .type() with "")
    cy.get('input[placeholder="Add a new todo"]').should("be.empty");
    // Click the "Add Todo" button
    cy.get("button").contains("Add Todo").click();
    // Ensure error message is displayed
    cy.get("p").contains("Error: Input todo.").should("be.visible");
  });

  it("Case 3: ", () => {
    //// LOGIN-001:	Login (Success)
    cy.login(LOGINID, LOGINPASS);
    cy.url().should("eq", Cypress.config().baseUrl + "/"); // Verify the URL

    //// TODO-001:	Display the existing todos
    cy.get('[data-testid="todo-list"] li').should("have.length.greaterThan", 1);

    //// TODO-002:	Add a new todo
    const newTodo = "Case 3: New task added by Cypress testing.";
    cy.addNew(newTodo);

    //// TODO-005:	Edit todo as completed
    cy.get('[data-testid="todo-list"] li span').last().as("lastTodo");
    // Assess the item is not completed
    cy.get("@lastTodo").should("not.have.class", "line-through");
    cy.get("@lastTodo").click();
    // Assess the item is completed
    cy.get("@lastTodo").should("have.class", "line-through");

    //// TODO-006:	Edit todo as not-completed
    cy.get("@lastTodo").click();
    // Assess the item is completed
    cy.get("@lastTodo").should("have.class", "line-through");
  });

  it("Case 4: ", () => {
    //// LOGIN-002:	Login with invalid password (Fail)
    cy.login(LOGINID, "invalidpassword");
    // Show error message
    cy.get("p")
      .contains("Login failed. Please check your credentials")
      .should("be.visible");
  });

  it("Case 5: ", () => {
    //// LOGIN-003:	Login with empty Id and Password (Fail)
    cy.visit("/login"); // Visit the login page
    cy.get('input[placeholder="Username"]').should("be.empty");
    cy.get('input[placeholder="Password"]').should("be.empty");
    cy.get("button").contains("Login").click(); // Click the login button

    // Show error message
    cy.get("p")
      .contains("Login failed. Please check your credentials")
      .should("be.visible");
  });
});
