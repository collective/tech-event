"""Helpers for attendee lookup, unique e-mail validation and TOTP codes."""

from collective.techevent.users.utils import create_totp_code
from collective.techevent.users.utils import get_brains_for_email
from collective.techevent.users.utils import get_membrane_user
from collective.techevent.users.utils import get_user_id_for_email
from collective.techevent.users.utils import validate_unique_email
from collective.techevent.users.utils import verify_totp_code
from plone import api
from zope.component.hooks import setSite

import datetime
import pytest


SEED = "JBSWY3DPEHPK3PXP"


class TestEmailLookup:
    @pytest.mark.parametrize("email", [None, 42, "", "   ", "no-at-sign"])
    def test_invalid_email_finds_nothing(self, portal, email):
        """Values that are not an address never reach the catalog.

        :param portal: The Plone site.
        :param email: The value looked up.
        """
        assert get_brains_for_email(portal, email) == []

    def test_known_email_is_found(self, portal, attendee_factory):
        """The attendee with the e-mail address is found, and its user id too.

        :param portal: The Plone site.
        :param attendee_factory: Creates attendees for the test.
        """
        attendee_factory("lookup-1", "lookup-1@example.com")

        brains = get_brains_for_email(portal, "  lookup-1@example.com  ")

        assert len(brains) == 1
        assert (
            get_user_id_for_email(portal, "lookup-1@example.com") == brains[0].getUserId
        )
        assert get_user_id_for_email(portal, "unknown@example.com") == ""

    def test_missing_membrane_tool_finds_nothing(self, portal, monkeypatch):
        """Without the membrane tool there is no user to find.

        :param portal: The Plone site.
        :param monkeypatch: Pytest fixture to make the tool missing.
        """
        monkeypatch.setattr(api.portal, "get_tool", lambda name: None)

        assert get_brains_for_email(portal, "someone@example.com") == []


class TestValidateUniqueEmail:
    def test_unused_address_is_valid(self, portal):
        """An address no user has is valid.

        :param portal: The Plone site.
        """
        assert validate_unique_email("unused@example.com", portal) == ""

    def test_address_of_another_user_is_refused(self, portal, attendee_factory):
        """An address another attendee has is refused, with a message.

        :param portal: The Plone site.
        :param attendee_factory: Creates attendees for the test.
        """
        attendee_factory("taken-1", "taken@example.com")

        message = validate_unique_email("taken@example.com", portal)

        assert message is not None
        assert "taken@example.com" in str(message)

    def test_own_address_is_valid(self, portal, attendee_factory):
        """An attendee may keep the address it already has.

        :param portal: The Plone site.
        :param attendee_factory: Creates attendees for the test.
        """
        attendee = attendee_factory("own-1", "own@example.com")

        assert validate_unique_email("own@example.com", attendee) is None

    def test_several_matches_are_refused(self, portal, attendee_factory):
        """When more than one user has the address, the address is refused.

        :param portal: The Plone site.
        :param attendee_factory: Creates attendees for the test.
        """
        attendee_factory("twin-1", "twins@example.com")
        attendee_factory("twin-2", "twins@example.com")

        message = validate_unique_email("twins@example.com", portal)

        assert message is not None
        assert "Multiple matches" in str(message)


class TestMembraneUser:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendee_factory):
        """Create an attendee to look up.

        :param portal: The Plone site.
        :param attendee_factory: Creates attendees for the test.
        """
        self.portal = portal
        self.attendee = attendee_factory("member-1", "member@example.com")
        self.user_id = get_user_id_for_email(portal, "member@example.com")

    def test_brain_for_known_user(self):
        """A known user id returns its membrane brain."""
        brain = get_membrane_user(self.portal, self.user_id)

        assert brain is not None
        assert brain.getUserId == self.user_id

    def test_object_for_known_user(self):
        """With ``get_object`` the content object is returned."""
        obj = get_membrane_user(self.portal, self.user_id, get_object=True)

        assert obj.getId() == "member-1"

    def test_unrestricted_brain_and_object(self):
        """The unrestricted lookup returns the same user, as brain or object."""
        brain = get_membrane_user(self.portal, self.user_id, unrestricted=True)
        obj = get_membrane_user(
            self.portal, self.user_id, get_object=True, unrestricted=True
        )

        assert brain.getUserId == self.user_id
        assert obj.getId() == "member-1"

    def test_unknown_user_is_none(self):
        """An id no membrane user has returns None."""
        assert get_membrane_user(self.portal, "no-such-user") is None

    def test_missing_membrane_tool_is_none(self, monkeypatch):
        """Without the membrane tool no user is found.

        :param monkeypatch: Pytest fixture to make the tool missing.
        """
        monkeypatch.setattr(api.portal, "get_tool", lambda name: None)

        assert get_membrane_user(self.portal, self.user_id) is None


class TestTotp:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        """Install the key manager the TOTP secret is derived from.

        A Plone site has it from its creation; the test layer does not, so the
        plone.keyring profile that registers it is applied here.

        :param portal: The Plone site.
        """
        setSite(portal)
        portal.portal_setup.runAllImportStepsFromProfile(
            "profile-plone.keyring:default"
        )

    def test_code_is_six_digits(self):
        """The current code is a string of six digits."""
        code = create_totp_code(SEED)

        assert len(code) == 6
        assert code.isdigit()

    def test_current_code_verifies(self):
        """A code made now verifies, and a wrong code does not."""
        code = create_totp_code(SEED)

        assert verify_totp_code(SEED, code) is True
        assert (
            verify_totp_code(SEED, "000000" if code != "000000" else "111111") is False
        )

    def test_code_for_a_past_time_verifies_within_the_window(self):
        """A code from five minutes ago is accepted within ten minutes only."""
        past = datetime.datetime.now() - datetime.timedelta(minutes=5)
        code = create_totp_code(SEED, for_time=past)

        assert verify_totp_code(SEED, code, minutes=10) is True
        assert verify_totp_code(SEED, code, minutes=1) is False

    def test_code_for_an_integer_timestamp(self):
        """The time may be given as an integer timestamp as well."""
        timestamp = int(datetime.datetime.now().timestamp())

        code = create_totp_code(SEED, for_time=timestamp)

        assert len(code) == 6
        assert verify_totp_code(SEED, code) is True
