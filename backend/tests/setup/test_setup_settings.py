"""The support_multiple_events setting makes the Tech Event type addable."""

from collective.techevent.subscribers.settings import SUPPORT_MULTIPLE_EVENTS
from plone import api

import pytest


TECH_EVENT = "Tech Event"


@pytest.fixture(scope="class")
def portal(portal_class):
    yield portal_class


def _set_support(value: bool) -> None:
    """Write the registry record as a Manager would from the control panel.

    :param value: The new value of ``support_multiple_events``.
    """
    with api.env.adopt_roles(["Manager"]):
        api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, value)


def _addable_in_portal(portal) -> bool:
    """Return whether the Tech Event type can be added to the portal.

    :param portal: The Plone site.
    :returns: ``True`` when the type is in the portal's allowed content types.
    """
    with api.env.adopt_roles(["Manager"]):
        return TECH_EVENT in [fti.getId() for fti in portal.allowedContentTypes()]


class TestSupportMultipleEvents:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        """Start each test from the default, and restore it afterwards.

        :param portal: The Plone site.
        """
        self.portal = portal
        self.fti = api.portal.get_tool("portal_types")[TECH_EVENT]
        _set_support(False)
        yield
        _set_support(False)

    def test_disabled_by_default(self):
        """The default is off, and the type is not addable."""
        assert api.portal.get_registry_record(SUPPORT_MULTIPLE_EVENTS) is False
        assert self.fti.global_allow is False
        assert _addable_in_portal(self.portal) is False

    def test_enabling_makes_the_type_addable(self):
        """Saving the setting as on, through the registry, allows the type."""
        _set_support(True)

        assert self.fti.global_allow is True
        assert _addable_in_portal(self.portal) is True

    def test_disabling_again_removes_it(self):
        """Turning the setting back off takes the type out of the portal."""
        _set_support(True)
        _set_support(False)

        assert self.fti.global_allow is False
        assert _addable_in_portal(self.portal) is False

    def test_other_records_do_not_reapply_the_setup(self, monkeypatch):
        """Only a change to support_multiple_events runs the event setup.

        :param monkeypatch: Pytest fixture to replace the setup function.
        """
        from collective.techevent.subscribers import settings

        calls: list[object] = []

        def spy(portal) -> None:
            calls.append(portal)

        monkeypatch.setattr(settings, "setup_tech_event", spy)
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record("plone.site_title", "Something else")

        assert calls == []
