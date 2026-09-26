@login
Feature: Login and access control
  As a shopper
  I want valid users admitted and invalid ones rejected
  So that the store stays secure and usable

  Background:
    Given I open the login page

  @smoke @regression
  Scenario: Standard user can log in
    When I log in as "standard"
    Then I should be on the inventory page

  @regression
  Scenario: Locked-out user is rejected
    When I log in as "locked"
    Then I should see the login error "lockedOut"

  @regression @negative
  Scenario Outline: Invalid or missing credentials are rejected
    When I enter username "<username>"
    And I enter password "<password>"
    And I submit the login form
    Then I should see the login error "<errorKey>"

    Examples:
      | username      | password       | errorKey           |
      | standard_user | wrong_password | invalidCredentials |
      |               | secret_sauce   | usernameRequired   |
      | standard_user |                | passwordRequired   |