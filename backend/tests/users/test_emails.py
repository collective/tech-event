"""Links in the emails sent to registrants."""

from collective.techevent.users import emails
from plone import api

import pytest


class TestFrontendUrl:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, content_factory, monkeypatch):
        self.portal = portal
        self.document = content_factory(
            portal, {"type": "Document", "id": "attendee-guide"}
        )
        monkeypatch.delenv("VOLTO_FRONTEND_DOMAIN", raising=False)
        self.monkeypatch = monkeypatch

    def test_backend_url_without_domain(self):
        registry = api.portal.get_tool("portal_registry")
        registry["volto.frontend_domain"] = None
        assert emails.frontend_url(self.document) == self.document.absolute_url()

    def test_registry_domain(self):
        api.portal.set_registry_record("volto.frontend_domain", "https://example.org/")
        assert (
            emails.frontend_url(self.document) == "https://example.org/attendee-guide"
        )
        assert emails.frontend_url(self.portal) == "https://example.org"

    def test_environment_wins(self):
        api.portal.set_registry_record("volto.frontend_domain", "https://example.org")
        self.monkeypatch.setenv("VOLTO_FRONTEND_DOMAIN", "https://event.example.org")
        assert (
            emails.frontend_url(self.document)
            == "https://event.example.org/attendee-guide"
        )


class TestVerificationUrl:
    def test_url(self, portal, attendees_factory, attendee_factory, monkeypatch):
        monkeypatch.setenv("VOLTO_FRONTEND_DOMAIN", "https://example.org")
        container = attendees_factory(portal, registration_confirmation="manual")
        attendee = attendee_factory(container)
        url = emails.verification_url(attendee)
        assert url.startswith("https://example.org/registration/verify?token=")


class TestNoMailHost:
    def test_logged_not_raised(self, portal, attendees_factory, attendee_factory):
        """Without a configured mail host, the email is logged, not raised."""
        container = attendees_factory(portal, registration_confirmation="manual")
        attendee = attendee_factory(container)
        api.portal.set_registry_record("plone.email_from_address", "")
        assert emails.send_verification(attendee) is False
