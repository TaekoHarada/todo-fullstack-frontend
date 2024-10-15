describe("Case1: E2E Test", () => {
  it("Case 1: ", () => {
    //// LOGIN-001:	Login (Success)
    cy.visit("/login");
    // Type in the username and password
    cy.get('input[placeholder="Username"]').type("taekoharada");
    cy.get('input[placeholder="Password"]').type("taekoharada");

    // Click the login button
    cy.get("button").contains("Login").click();

    // Verify that the URL includes the home page after successful login
    cy.url().should("eq", Cypress.config().baseUrl + "/");

    //// TODO-001:	Display the existing todos
    cy.get('[data-testid="todo-list"] li').should("have.length.greaterThan", 1);

    //// TODO-002:	Add a new todo
    cy.get('input[placeholder="Add a new todo"]').type(
      "1: New task added by Cypress testing."
    );
    // Get the number of todo items
    let todoLength1;

    cy.get('[data-testid="todo-list"] li').then((listItems) => {
      // Store the length in the variable
      todoLength1 = listItems.length;
      // Log the length
      cy.log("Number of todos:", todoLength1);

      // Click the "Add Todo" button
      cy.get("button").contains("Add Todo").click();
      // Log the length
      cy.log("Number of todos after cliking Add Todo:", todoLength1);

      // The number of todo items is incremented by 1
      cy.get('[data-testid="todo-list"] li').should(
        "have.length",
        todoLength1 + 1
      );
    });

    cy.get('input[placeholder="Add a new todo"]').type(
      "2: New task added by Cypress testing."
    );
    // Get the number of todo items
    let todoLength2;

    cy.get('[data-testid="todo-list"] li').then((listItems) => {
      // Store the length in the variable
      todoLength2 = listItems.length;
      // Log the length
      cy.log("Number of todos:", todoLength2);

      // Click the "Add Todo" button
      cy.get("button").contains("Add Todo").click();
      // Log the length
      cy.log("Number of todos after cliking Add Todo:", todoLength2);

      // The number of todo items is incremented by 1
      cy.get('[data-testid="todo-list"] li').should(
        "have.length",
        todoLength2 + 1
      );
    });

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
    // Ensure the todo item is removed from the list
    cy.get('[data-testid="todo-list"] li').should(
      "not.contain",
      "2: New task added by Cypress testing."
    );
    //// LOGOUT-001:	Logout
  });

  // Test for adding a to-do
  // it("allows a user to add a new to-do", () => {
  //   cy.visit("/");
  //   cy.get('input[name="new-todo"]').type("Write E2E test case{enter}");
  //   cy.contains("Write E2E test case").should("exist");
  // });

  // // Test for editing a to-do
  // it("allows a user to edit a to-do item", () => {
  //   cy.visit("/home");
  //   cy.contains("Write E2E test case").parent().find(".edit-button").click();
  //   cy.get('input[name="edit-todo"]')
  //     .clear()
  //     .type("Write E2E test case with Cypress{enter}");
  //   cy.contains("Write E2E test case with Cypress").should("exist");
  // });

  // // Test for deleting a to-do
  // it("allows a user to delete a to-do", () => {
  //   cy.visit("/home");
  //   cy.contains("Write E2E test case with Cypress")
  //     .parent()
  //     .find(".delete-button")
  //     .click();
  //   cy.contains("Write E2E test case with Cypress").should("not.exist");
  // });

  // // Test for logout
  // it("allows a user to log out", () => {
  //   cy.visit("/home");
  //   cy.get(".logout-button").click();
  //   cy.url().should("include", "/login");
  // });
});
