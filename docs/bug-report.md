**Summary:**
[SAUCEDEMO][CHECKOUT] Last Name field does not accept input for problem_user on Checkout: Your Information page

**Preconditions:**
1. Open https://www.saucedemo.com/.
2. Log in as problem_user / secret_sauce.
3. Add any product to the cart.
4. Open the cart and click Checkout.

**Steps to reproduce:**
1. Enter a valid First Name — Maryna.
2. Enter a valid Last Name — Mykhailova.
3. Enter a valid Postal Code — 08001.
4. Click Continue.

**Actual result:**
The Last Name field does not retain the entered value. The application displays "Error: Last Name is required", and the user cannot continue checkout.

![alt text](<Screenshot 2026-09-27 121417.png>)


**Expected result:**
The Last Name field should accept and retain the entered value. After all required fields are completed, the user should be redirected to /checkout-step-two.html and be able to complete the order.

**Evidence:**
Network tab shows no request tied to form submission at the moment of failure — confirms this is a client-side input-binding/state bug, not a backend or API issue.

**Severity:** S2 – Major
**Priority:** P1
**Environment:** SauceDemo, https://www.saucedemo.com/, user: problem_user, Browser: Chrome/Chromium
**Related test case:** TC-D06 – Verify checkout form behavior for problem_user
**Status:** Confirmed (intentional demo seed)
