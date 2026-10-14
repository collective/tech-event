from collective.techevent.content.schedule.keynote import IKeynote
from collective.techevent.content.schedule.keynote import Keynote
from plone import api
from plone.dexterity.utils import iterSchemataForType
from zope.schema import getFieldNames

import pytest


@pytest.fixture
def portal_type() -> str:
    return "Keynote"


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, container):
        self.container = container

    def test_create(self, content_factory, payload, portal_type):
        content = content_factory(self.container, payload)
        assert content.portal_type == portal_type
        assert isinstance(content, Keynote)

    @pytest.mark.parametrize(
        "role,path,expected",
        [
            ["Anonymous", "/", False],
            ["Anonymous", "/schedule", False],
            ["Contributor", "/", False],
            ["Contributor", "/schedule", True],
            ["Manager", "/", False],
            ["Manager", "/schedule", True],
            ["Owner", "/", False],
            ["Owner", "/schedule", True],
            ["Reader", "/", False],
            ["Reader", "/schedule", False],
            ["Site Administrator", "/", False],
            ["Site Administrator", "/schedule", True],
        ],
    )
    def test_create_permission(
        self, roles_permission_on, path, permission, role: str, expected: bool
    ):
        container = api.content.get(path)
        roles = roles_permission_on(permission, container)
        assert (role in roles) is expected

    def test_slot_indexed(self, search_slot_event_dates, portal_type, content_instance):
        results = search_slot_event_dates(portal_type)
        assert len(results) > 0
        uids = [brain.UID for brain in results]
        assert content_instance.UID() in uids


class TestDuration:
    """``duration`` is a schema field of ``IKeynote``, not a class attribute."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal, container, content_factory, payloads):
        self.portal = portal
        self.container = container
        self.content_factory = content_factory
        self.payloads = payloads

    def _keynote(self, **kw) -> Keynote:
        """Create a Keynote from the first payload, without a duration.

        :param kw: Values overriding the payload.
        :returns: The new Keynote.
        """
        payload = {**self.payloads["Keynote"][0], **kw}
        payload.pop("duration", None)
        return self.content_factory(self.container, payload)

    def test_in_interface(self):
        assert "duration" in IKeynote

    def test_in_type_schema(self, portal_type):
        fields = [
            name
            for schema in iterSchemataForType(portal_type)
            for name in getFieldNames(schema)
        ]
        assert "duration" in fields

    def test_unset_is_none(self):
        content = self._keynote()
        assert content.duration is None

    def test_reindex_with_duration_index(self):
        """A Keynote without duration indexes beside Talks that have one.

        Sites may add a ``duration`` index. Before ``duration`` moved to
        ``IKeynote``, the field object itself reached that index, and comparing
        it with the string keys of the Talks raised a ``TypeError``.
        """
        catalog = self.portal.portal_catalog
        catalog.addIndex("duration", "FieldIndex")
        catalog.manage_reindexIndex(ids=["duration"])
        talk = self.content_factory(self.container, self.payloads["Talk"][0])
        content = self._keynote()

        content.reindexObject()

        brains = catalog.unrestrictedSearchResults(duration="long")
        assert [brain.UID for brain in brains] == [talk.UID()]
        assert len(catalog.unrestrictedSearchResults(UID=content.UID())) == 1


class TestVersioning:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    def test_versionable(self, portal_type, versionable_content_types):
        assert portal_type in versionable_content_types

    def test_create_initial_version_after_adding(self, last_version, content_instance):
        version = last_version(content_instance)
        assert version.comment.default == "Initial version"
        assert version.version_id == 0

    def test_create_version_on_save(
        self, notify_mofified, history, last_version, content_instance
    ):
        content_instance.title = "New Title"
        notify_mofified(content_instance)
        history_data = history(content_instance)
        assert len(history_data) == 2  # Initial + modified version
        version = last_version(content_instance)
        assert version.comment is None
        assert version.version_id == 1
