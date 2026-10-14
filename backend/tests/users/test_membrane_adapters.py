"""Membrane adapters of an attendee: properties, roles and the BaseUser API."""

from collective.techevent.users.content.adapters import MembraneRoleProvider
from collective.techevent.users.content.adapters import MembraneUserProperties
from plone import api
from plone.app.textfield.value import RichTextValue
from Products.PlonePAS.sheet import MutablePropertySheet

import pytest


@pytest.fixture
def attendee(attendee_factory):
    """Create the attendee the adapters are tested with.

    :param attendee_factory: Creates attendees for the test.
    :returns: The attendee.
    """
    return attendee_factory("adapter-1", "adapter@example.com")


class TestMembraneUserProperties:
    @pytest.fixture(autouse=True)
    def _setup(self, attendee):
        """Adapt the attendee.

        :param attendee: The attendee under test.
        """
        self.attendee = attendee
        self.adapter = MembraneUserProperties(attendee)

    def test_fullname_category_and_uuid(self):
        """The adapter reports the title, portal type and UUID of the user."""
        assert self.adapter.fullname == self.attendee.title
        assert self.adapter.category == "Attendee"
        assert self.adapter.uuid == api.content.get_uuid(self.attendee)

    def test_property_sheet_has_the_user_properties(self):
        """The sheet carries the e-mail, and empty values for unset fields."""
        sheet = self.adapter.getPropertiesForUser(None)

        assert sheet.getProperty("email") == "adapter@example.com"
        assert sheet.getProperty("category") == "Attendee"
        assert sheet.getProperty("home_page") == ""

    def test_rich_text_is_read_as_output(self):
        """A rich text description is returned as its rendered output."""
        self.attendee.text = RichTextValue("Speaks Plone", "text/plain", "text/html")

        sheet = self.adapter.getPropertiesForUser(None)

        assert "Speaks Plone" in sheet.getProperty("description")

    def test_properties_are_written_stripped(self):
        """Setting the sheet writes the e-mail stripped and the description as rich text."""
        sheet = MutablePropertySheet(
            self.attendee.id,
            email="  new@example.com  ",
            description="New bio",
            home_page="https://example.org",
        )

        self.adapter.setPropertiesForUser(None, sheet)

        assert self.attendee.email == "new@example.com"
        assert self.attendee.text.raw == "New bio"
        assert self.attendee.remoteUrl == "https://example.org"

    def test_delete_user_does_nothing(self):
        """Membrane has nothing to remove: the properties live on the content."""
        assert self.adapter.deleteUser(self.attendee.id) is None
        assert self.attendee.email == "adapter@example.com"


class TestMembraneRoleProvider:
    @pytest.fixture(autouse=True)
    def _setup(self, attendee):
        """Adapt the attendee to the role provider.

        :param attendee: The attendee under test.
        """
        self.attendee = attendee
        self.provider = MembraneRoleProvider(attendee)

    def test_roles_on_self(self):
        """The user is Reader and Owner on itself."""
        assert self.provider.getRoles(self.attendee.getUserId()) == ("Reader", "Owner")

    def test_no_roles_for_another_user(self):
        """Another user id gets no roles from this provider."""
        assert self.provider.getRoles("someone-else") == ()

    def test_all_roles_lists_the_user(self):
        """The role enumeration yields the user with its roles."""
        assert list(self.provider.getAllRoles()) == [
            (self.attendee.getUserId(), ("Reader", "Owner"))
        ]


class TestBaseUser:
    @pytest.fixture(autouse=True)
    def _setup(self, attendee):
        """Bind the attendee, which is a BaseUser.

        :param attendee: The attendee under test.
        """
        self.attendee = attendee

    def test_title_is_read_only(self):
        """Assigning the title leaves it as the first and last name."""
        self.attendee.title = "Something else"

        assert self.attendee.title == "Jane Doe"

    def test_user_identity(self):
        """The user id is the id, the login name the e-mail address."""
        assert self.attendee.getUserId() == "adapter-1"
        assert self.attendee.getUserName() == "adapter@example.com"
        assert self.attendee.get_full_name() == "Jane Doe"

    def test_user_is_the_member_data_of_the_attendee(self):
        """The membrane user of an attendee is found through the PAS."""
        assert self.attendee.user.getId() == "adapter-1"

    def test_user_for_unknown_id_is_none(self, monkeypatch):
        """A user that the PAS does not know gives no member data.

        :param monkeypatch: Pytest fixture to make the PAS lookup empty.
        """
        monkeypatch.setattr(api.user, "get", lambda userid: None)

        assert self.attendee.user is None
