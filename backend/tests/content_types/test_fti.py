from collective.techevent.content.location.room import Room
from collective.techevent.content.location.venue import Venue
from plone.dexterity.fti import DexterityFTI
from zope.component import createObject

import pytest


@pytest.fixture(scope="class")
def portal(portal_class):
    yield portal_class


class TestContentTypeFTI:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    @pytest.mark.parametrize(
        "portal_type,attr,expected",
        [
            ("Venue", "title", "Venue"),
            ("Venue", "global_allow", True),
            ("Venue", "filter_content_types", True),
            ("Venue", "allowed_content_types", ("Document", "File", "Image", "Room")),
            ("Room", "title", "Room"),
            ("Room", "global_allow", False),
            ("Room", "filter_content_types", True),
            ("Room", "allowed_content_types", ("Document", "File", "Image")),
            ("Presenter", "title", "Presenter"),
            ("Presenter", "global_allow", True),
            ("Presenter", "filter_content_types", True),
            ("Presenter", "allowed_content_types", ("File", "Image")),
            ("Schedule", "title", "Schedule"),
            ("Schedule", "global_allow", True),
            ("Schedule", "filter_content_types", True),
            (
                "Schedule",
                "allowed_content_types",
                (
                    "Document",
                    "File",
                    "Image",
                    "Break",
                    "Keynote",
                    "LightningTalks",
                    "Meeting",
                    "OpenSpace",
                    "Slot",
                    "Talk",
                    "Training",
                ),
            ),
            ("Break", "title", "Break"),
            ("Break", "global_allow", False),
            ("Break", "filter_content_types", True),
            ("Break", "allowed_content_types", ()),
            ("Keynote", "title", "Keynote"),
            ("Keynote", "global_allow", False),
            ("Keynote", "filter_content_types", True),
            ("Keynote", "allowed_content_types", ("File", "Image")),
            ("LightningTalks", "title", "Lightning Talks"),
            ("LightningTalks", "global_allow", False),
            ("LightningTalks", "filter_content_types", True),
            ("LightningTalks", "allowed_content_types", ("File", "Image")),
            ("Meeting", "title", "Meeting"),
            ("Meeting", "global_allow", False),
            ("Meeting", "filter_content_types", True),
            ("Meeting", "allowed_content_types", ("File", "Image")),
            ("OpenSpace", "title", "Open Space"),
            ("OpenSpace", "global_allow", False),
            ("OpenSpace", "filter_content_types", True),
            ("OpenSpace", "allowed_content_types", ("File", "Image")),
            ("Slot", "title", "Slot"),
            ("Slot", "global_allow", False),
            ("Slot", "filter_content_types", True),
            ("Slot", "allowed_content_types", ()),
            ("Talk", "title", "Talk"),
            ("Talk", "global_allow", False),
            ("Talk", "filter_content_types", True),
            ("Talk", "allowed_content_types", ("File", "Image")),
            ("Training", "title", "Training"),
            ("Training", "global_allow", False),
            ("Training", "filter_content_types", True),
            ("Training", "allowed_content_types", ("File", "Image")),
            ("SponsorsDB", "title", "Sponsors Database"),
            ("SponsorsDB", "global_allow", True),
            ("SponsorsDB", "filter_content_types", True),
            (
                "SponsorsDB",
                "allowed_content_types",
                ("Document", "File", "Image", "SponsorLevel"),
            ),
            ("SponsorLevel", "title", "Sponsorship Level"),
            ("SponsorLevel", "global_allow", False),
            ("SponsorLevel", "filter_content_types", True),
            ("SponsorLevel", "allowed_content_types", ("File", "Image", "Sponsor")),
            ("Sponsor", "title", "Sponsor"),
            ("Sponsor", "global_allow", False),
            ("Sponsor", "filter_content_types", True),
            ("Sponsor", "allowed_content_types", ()),
        ],
    )
    def test_fti(self, get_fti, portal_type: str, attr: str, expected):
        """Test FTI values."""
        fti: DexterityFTI = get_fti(portal_type)

        assert isinstance(fti, DexterityFTI)
        assert getattr(fti, attr) == expected

    @pytest.mark.parametrize(
        "portal_type,klass",
        [
            ("Venue", Venue),
            ("Room", Room),
        ],
    )
    def test_factory(self, get_fti, portal_type: str, klass):
        factory = get_fti(portal_type).factory
        obj = createObject(factory)
        assert obj is not None
        assert isinstance(obj, klass)
        assert obj.portal_type == portal_type
