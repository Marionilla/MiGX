@cart @regression
Feature: Shopping cart
  As a shopper
  I want to add and remove products
  So that I buy exactly what I intend to

  Background:
    Given I am on the inventory page

  @smoke
  Scenario: Add a single product to the cart
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show 1

  Scenario: Remove a product from the cart page
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I remove "Sauce Labs Backpack" from the cart
    Then the cart badge should be empty
