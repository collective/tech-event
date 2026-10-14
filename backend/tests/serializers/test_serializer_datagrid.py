"""Serialization of the benefits datagrid of a sponsorship level."""

from collections.abc import Generator
from collective.techevent.content.sponsors.sponsor_level import ISponsorLevel
from collective.techevent.utils import find_sponsors_db
from plone import api
from plone.restapi.interfaces import IFieldSerializer
from plone.restapi.types.interfaces import IJsonSchemaProvider
from zope.component import getMultiAdapter

import pytest


@pytest.fixture
def sponsors_db(portal):
    """Return the sponsors database of the demo content.

    :param portal: The Plone site with the demo content.
    :returns: The sponsors database.
    """
    return find_sponsors_db(portal)


@pytest.fixture
def benefit_token(get_vocabulary, portal) -> str:
    """Return the token of a benefit defined in the demo sponsors database.

    :param get_vocabulary: Pytest fixture returning a vocabulary by name.
    :param portal: The Plone site.
    :returns: A benefit token from the sponsorship benefits vocabulary.
    """
    vocab = get_vocabulary(
        "collective.techevent.vocabularies.sponsorship_benefits", portal
    )
    return next(iter(vocab)).token


@pytest.fixture
def level(content_factory, sponsors_db, payloads, benefit_token) -> Generator:
    """Create a sponsorship level with two benefits: one known, one unknown.

    :param content_factory: Factory creating content in a container.
    :param sponsors_db: The sponsors database.
    :param payloads: Content payloads, ordered by type.
    :param benefit_token: A valid benefit token.
    :returns: The new sponsorship level.
    """
    payload = dict(payloads["SponsorLevel"][0])
    payload.pop("_container", None)
    payload["id"] = "datagrid-level"
    payload["benefits"] = [
        {"id": "b-known", "code": benefit_token, "value": "Logo on the site"},
        {"id": "b-unknown", "code": "not-a-benefit", "value": "Something else"},
    ]
    with api.env.adopt_roles(["Manager"]):
        content = content_factory(sponsors_db, payload)
    yield content
    # The portal is shared by the class, so remove the level again.
    with api.env.adopt_roles(["Manager"]):
        if payload["id"] in sponsors_db:
            sponsors_db.manage_delObjects([payload["id"]])


class TestBenefitsSerialization:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, http_request, serializer, level):
        """Bind the level and the serializer factory.

        :param portal: The Plone site.
        :param http_request: The integration request.
        :param serializer: Factory returning the REST serializer of a context.
        :param level: The sponsorship level under test.
        """
        self.portal = portal
        self.request = http_request
        self.serializer = serializer
        self.level = level

    def test_known_choice_is_resolved_to_token_and_title(self, benefit_token):
        """A benefit that the vocabulary knows is returned with its title.

        :param benefit_token: The token of a valid benefit.
        """
        rows = self.serializer(self.level)()["benefits"]
        known = next(row for row in rows if row["id"] == "b-known")

        assert known["code"]["token"] == benefit_token
        assert known["code"]["title"]

    def test_alias_title_sets_the_row_title(self, benefit_token):
        """The ``code`` column is the row title, as the field's alias says.

        :param benefit_token: The token of a valid benefit.
        """
        rows = self.serializer(self.level)()["benefits"]
        known = next(row for row in rows if row["id"] == "b-known")

        assert known["title"] == known["code"]["title"]

    def test_unknown_choice_is_kept_as_is(self):
        """A value that is not in the vocabulary is left as the stored value."""
        rows = self.serializer(self.level)()["benefits"]
        unknown = next(row for row in rows if row["id"] == "b-unknown")

        assert unknown["code"] == "not-a-benefit"
        assert unknown["title"] == "not-a-benefit"


class TestBenefitRowSchema:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, http_request, level):
        """Bind the level and the request used for the schema.

        :param portal: The Plone site.
        :param http_request: The integration request.
        :param level: The sponsorship level under test.
        """
        self.request = http_request
        self.level = level

    def test_row_schema_lists_the_columns(self):
        """The row schema has the columns, and marks the required ones."""
        field = ISponsorLevel["benefits"]
        provider = getMultiAdapter(
            (field.value_type, self.level, self.request), IJsonSchemaProvider
        )
        schema = provider.get_schema()

        assert set(schema["properties"]) >= {"id", "code", "value"}
        assert "code" in schema["required"]
        assert schema["fieldsets"][0]["fields"] == list(schema["properties"])


def test_field_serializer_is_the_datagrid_serializer(level, http_request):
    """The datagrid field has a field serializer that returns a list of rows.

    :param level: The sponsorship level under test.
    :param http_request: The integration request.
    """
    field = ISponsorLevel["benefits"].bind(level)
    serializer = getMultiAdapter((field, level, http_request), IFieldSerializer)

    rows = serializer()

    assert isinstance(rows, list)
    assert len(rows) == 2
