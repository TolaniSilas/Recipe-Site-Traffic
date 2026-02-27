"""
end-to-end tests for the Tasty Bytes web app using playwright.

these tests assume:
- the react frontend is running at http://127.0.0.1:3000
- the fastapi backend is running and reachable by the frontend.

to run (after installing playwright and its browsers):
    pytest app/api_dev/tests/test_app_e2e_playwright.py --headed
"""

from playwright.sync_api import Page, expect



def test_recipe_prediction_flow(page: Page) -> None:
    """Eend-to-end: fill prediction form, submit, and see a prediction result."""

    # navigate to running React app.
    page.goto("http://localhost:3000/", wait_until="domcontentloaded")

    # jump to the prediction section.
    page.get_by_role("link", name="Run Prediction").click()

    # fill numeric fields.
    page.fill("#calories", "250")
    page.fill("#carbohydrate", "40")
    page.fill("#sugar", "15")
    page.fill("#protein", "12")

    # select category and servings.
    page.select_option("#category", "Dessert")
    page.fill("#servings", "4")

    # submit the form.
    page.get_by_role("button", name="Predict").click()

    # expect prediction results section to appear.
    expect(page.get_by_text("Prediction Results")).to_be_visible()

    # check that a percentage appears in the confidence text.
    body_text = page.inner_text("body")

    # verify that the confidence text contains a percentage sign, indicating a confidence value is shown.
    assert "%" in body_text

