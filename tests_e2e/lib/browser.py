# Functionality related to browser handling

from os import environ, path, getcwd


DEBUGS_LOCATION = "debugs"


def get_page_in_browser_open_site(
    playwright_object,
    path: str,
    host: str = None,
    proto: str = None,
    traces=True,
    screenshots=True,
):
    page, context = get_page_in_browser(playwright_object, screenshots, traces)
    url = get_complete_url(path, host, proto)
    page.goto(url)
    return page, context


def get_browser(playwright_object):
    browsername = environ.get("browser", "chromium").lower()
    browsobj = getattr(playwright_object, browsername)
    return browsobj.launch(headless=True)


def get_browser_context(browser):
    return browser.new_context()


def get_page_in_browser(playwright_object, screenshots=True, traces=True):
    browser_object = get_browser(playwright_object)
    context = get_browser_context(browser_object)
    context.tracing.start(screenshots=screenshots, snapshots=traces)
    return context.new_page(), context


def get_complete_url(path: str, host: str = None, proto: str = None):
    host = host or environ.get("httphost", "localhost:8080")
    proto = proto or "http"

    return f"{proto}://{host}{path}"


def stop_context(context, debugs_path=None):
    debugs_location = debugs_path or DEBUGS_LOCATION
    context.tracing.stop(path=path.join(debugs_location, "traces.zip"))
    with open(path.join(debugs_location, "somefile"), "w") as fh:
        fh.write("Hallo")
    print(f"{getcwd()}")
