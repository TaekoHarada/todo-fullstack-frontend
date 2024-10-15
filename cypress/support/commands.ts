/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable<Element>;
    logout(): Chainable<Element>;
    addNew(newTask: string): Chainable<Element>;
  }
}

Cypress.Commands.add("login", (username, password) => {
  cy.visit("/login"); // Visit the login page
  cy.get('input[placeholder="Username"]').type(username); // Type the username
  cy.get('input[placeholder="Password"]').type(password); // Type the password
  cy.get("button").contains("Login").click(); // Click the login button
});

Cypress.Commands.add("logout", () => {
  cy.visit("/");
  cy.getCookie("token").should("exist");
  // Click logout button
  cy.get("button").contains("Logout").click();
  // Ensure
  cy.getCookie("token").should("not.exist");
  // Ensure current URL is login page
  cy.url().should("eq", Cypress.config().baseUrl + "/login");
});

Cypress.Commands.add("addNew", (newTask) => {
  cy.get('input[placeholder="Add a new todo"]').type(newTask);
  // Get the number of todo items
  let todoLength;

  cy.get('[data-testid="todo-list"] li').then((listItems) => {
    // Store the length in the variable
    todoLength = listItems.length;
    // Log the length
    cy.log("Number of todos:", todoLength);

    // Click the "Add Todo" button
    cy.get("button").contains("Add Todo").click();
    // Log the length
    cy.log("Number of todos after cliking Add Todo:", todoLength);

    // The number of todo items is incremented by 1
    cy.get('[data-testid="todo-list"] li').should(
      "have.length",
      todoLength + 1
    );
  });
});
