"""The sponsorship level and benefit vocabularies."""

from collective.techevent.utils import event
from collective.techevent.vocabularies import sponsorship
from plone import api


class TestSponsorshipLevels:
    def test_terms_are_the_sponsor_levels(self, portal, get_vocabulary):
        """Each sponsorship level is a term, with its id as token and title.

        :param portal: The Plone site with the demo content.
        :param get_vocabulary: Pytest fixture returning a vocabulary by name.
        """
        vocab = get_vocabulary(
            "collective.techevent.vocabularies.sponsorship_levels", portal
        )

        levels = api.content.find(portal_type="SponsorLevel")
        assert levels
        for brain in levels:
            term = vocab.getTerm(brain.getId)
            assert term.title == brain.Title

    def test_no_levels_without_a_sponsors_database(self, portal, monkeypatch):
        """Without a sponsors database there are no levels to offer.

        :param portal: The Plone site.
        :param monkeypatch: Pytest fixture to hide the sponsors database.
        """
        monkeypatch.setattr(event, "find_sponsors_db", lambda context: None)

        assert event.sponsor_levels(portal) == []
        assert event.get_sponsorship_benefits(portal) == []


class TestSponsorshipBenefits:
    def test_terms_are_the_defined_benefits(self, portal, get_vocabulary):
        """Each benefit of the sponsors database is a term.

        :param portal: The Plone site with the demo content.
        :param get_vocabulary: Pytest fixture returning a vocabulary by name.
        """
        vocab = get_vocabulary(
            "collective.techevent.vocabularies.sponsorship_benefits", portal
        )
        benefits = event.get_sponsorship_benefits(portal)

        assert len(vocab) == len(benefits) > 0
        for benefit in benefits:
            assert vocab.getTerm(benefit["id"]).title == benefit["title"]

    def test_benefits_without_title_or_id_are_skipped(self, portal, monkeypatch):
        """A benefit missing its id or title is not offered as a term.

        :param portal: The Plone site.
        :param monkeypatch: Pytest fixture to replace the benefit list.
        """
        monkeypatch.setattr(
            sponsorship,
            "get_sponsorship_benefits",
            lambda context: [
                {"id": "complete", "title": "Complete"},
                {"id": "", "title": "No id"},
                {"id": "no-title", "title": ""},
            ],
        )

        vocab = sponsorship.sponsorship_benefits(portal)

        assert [term.token for term in vocab] == ["complete"]
