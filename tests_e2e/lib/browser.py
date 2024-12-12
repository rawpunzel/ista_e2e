# Functionality related to browser handling

from os import environ


def get_browser(playwright_object):
    browsername = environ.get("browser", "chromium").lower()
    browsobj = getattr(playwright_object, browsername)
    return browsobj.launch(headless=True)


def get_browser_context(browser):
    return browser.new_context()


def get_page_in_browser(playwright_object):
    browser_object = get_browser(playwright_object)
    context = get_browser_context(browser_object)
    return context.new_page()
