@checkout @regression
Feature: Checkout
  As a shopper
  I want to complete a purchase with validated information
  So that my order is placed correctly

  Background:
    Given I am on the inventory page
    And I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I proceed to checkout

  @smoke
  Scenario: Complete an order end to end
    When I enter checkout information "Maryna" "Mykhailova" "01001"
    And I continue to the overview
    Then the order overview should list "Sauce Labs Backpack"
    And the order total should equal the item total plus tax
    When I finish the order
    Then I should see the order confirmation "Thank you for your order!"

  @negative
  Scenario Outline: Checkout form rejects missing required fields
    When I enter checkout information "<first>" "<last>" "<zip>"
    And I continue to the overview
    Then I should see the checkout error "<error>"

    Examples:
      | first  | last       | zip   | error                          |
      |        | Mykhailova | 01001 | Error: First Name is required  |
      | Maryna |            | 01001 | Error: Last Name is required   |
      | Maryna | Mykhailova |       | Error: Postal Code is required |
