import unittest
import time
from lib.browser import get_page_in_browser_open_site, stop_context
from lib.pages import appointment as appointment_page
from dataclasses import dataclass
from playwright.sync_api import sync_playwright, expect


@dataclass
class Appointment:
    date: str
    duration_start: str
    duration_end: str
    tec_first_name: str
    tec_last_name: str
    tec_age: int
    tec_gender: str


class TestChangeAppointment(unittest.TestCase):
    expect.set_options(timeout=10_000)

    def setUp(self):
        self.appointments = [
            Appointment("2024-09-18", "10:00", "11:00", "John", "Doe", 35, "Male"),
            Appointment("2024-09-19", "14:00", "15:00", "Jane", "Smith", 30, "Female"),
            Appointment(
                "2024-09-20", "09:00", "10:00", "Alex", "Johnson", 28, "Non-binary"
            ),
        ]

        # Adding the first entry again as the last, as it should be selected at last time and checked once more
        self.appointments.append(self.appointments[0])

        self.appointment_buttons = [
            f"{appointment.date} {appointment.duration_start} - {appointment.duration_end} Techniker: {appointment.tec_first_name} {appointment.tec_last_name} ({appointment.tec_age} Jahre alt, {appointment.tec_gender})"
            for appointment in self.appointments
        ]
        self.playwright = sync_playwright()

    def test_ChangeAppointment(self):
        page, self.context = get_page_in_browser_open_site(
            self.playwright, path=appointment_page.path
        )
        page.wait_for_load_state()
        page.wait_for_load_state("load")
        page.wait_for_load_state("networkidle")

        for index, curr_appointment in enumerate(self.appointments):
            all_options_clicked = index == len(self.appointments) - 1
            print(f"Current Appointment: {curr_appointment}")
            expect(page.locator("h3")).to_contain_text(curr_appointment.date)
            expect(page.get_by_role("listitem")).to_contain_text(
                f"Zeitraum: {curr_appointment.duration_start} - {curr_appointment.duration_end}"
            )
            expect(page.get_by_role("listitem")).to_contain_text(
                "Durchzuführende Arbeit: Austauch der Rauchwarnmelder"
            )
            expect(page.get_by_role("listitem")).to_contain_text(
                f"Name: {curr_appointment.tec_first_name} {curr_appointment.tec_last_name}"
            )
            expect(page.get_by_role("listitem")).to_contain_text(
                f"Alter: {curr_appointment.tec_age}"
            )
            expect(page.get_by_role("listitem")).to_contain_text(
                f"Geschlecht: {curr_appointment.tec_gender}"
            )

            # Further investigation needed. Page reports to be loaded, but without the sleep it before clicking the button it does not load the
            # appointments
            time.sleep(10)
            page.get_by_role("button", name="Verschieben").click()

            page.wait_for_load_state()
            page.wait_for_load_state("load")
            page.wait_for_load_state("networkidle")
            # Make sure buttons for all possible appointments are displayed
            for button, appointment in zip(self.appointment_buttons, self.appointments):
                button_locator = page.get_by_role(
                    "button",
                    name=f"{appointment.date} {appointment.duration_start} - {appointment.duration_end}",
                )
                button_locator.wait_for(state="attached", timeout=20000)
                expect(
                    page.get_by_role(
                        "button",
                        name=f"{appointment.date} {appointment.duration_start} - {appointment.duration_end}",
                    ),
                ).to_contain_text(button, timeout=15000)

            # If all options have been clicked there will be no "next_appointment"
            if not all_options_clicked:
                next_appointment = self.appointments[index + 1]
                print(f"Next appointment: {next_appointment}")
                page.get_by_role(
                    "button",
                    name=f"{next_appointment.date} {next_appointment.duration_start} - {next_appointment.duration_end}",
                ).click()

    def tearDown(self):
        stop_context(self.context)


if __name__ == "__main__":
    unittest.main()
