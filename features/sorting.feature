@sorting @regression
Feature: Product sorting
  As a shopper
  I want the sort control to actually reorder products
  So that I can browse by name or price reliably

  Background:
    Given I am on the inventory page

  @smoke
  Scenario Outline: Sorting reorders the catalog correctly
    When I sort the products by "<option>"
    Then the products should be sorted by <field> in "<direction>" order

    Examples:
      | option              | field | direction  |
      | Name (A to Z)       | name  | ascending  |
      | Name (Z to A)       | name  | descending |
      | Price (low to high) | price | ascending  |
      | Price (high to low) | price | descending |
