import { v4 as uuidv4 } from "uuid";

describe("payment", () => {
  it("user make payment successfully", () => {
    // login
    cy.visit("/");
    cy.get("#username").type("Katharina_Bernier");
    cy.get("#password").type("s3cret");
    cy.get(".PrivateSwitchBase-input-14").click();
    cy.get(".MuiButton-label").click();

    // check account balance
    let oldBalance: string;
    cy.get('[data-test="sidenav-user-balance"]').then((balence) => (oldBalance = balence.text()));

    // click on "new" button
    cy.get(".MuiButton-label").click();

    // search for user
    cy.get('[data-test="user-list-search-input"]').type("Arely Kertzmann");
    cy.contains("Arely Kertzmann").click();

    // add amount and note and click pay
    const paymentAmount = "10";
    cy.get("#amount").type(paymentAmount);
    const paymentNote = uuidv4();
    cy.get("#transaction-create-description-input").type("fake payment: " + paymentNote);
    cy.get('[data-test="transaction-create-submit-payment"]').click();

    // return transcation
    cy.get('[data-test="new-transaction-return-to-transactions"]').click();

    // go to mine
    cy.get('[data-test="nav-personal-tab"]').click();

    // find the payment and click
    cy.contains(paymentNote).click({ force: true });

    // verrify if the payment was made
    cy.contains(`-$${paymentAmount}`).should("be.visible");
    cy.contains(paymentNote).should("be.visible");

    // verify if payment amount was deducted
    cy.get('[data-test="sidenav-user-balance"]').then((newBalence) => {
      const oldBalanceNum = Number(oldBalance.replace(/\$|,/g, ""));
      const newBalenceNum = Number(newBalence.text().replace(/\$|,/g, ""));
      expect(oldBalanceNum - newBalenceNum).to.equal(Number(paymentAmount));
    });
  });
});
