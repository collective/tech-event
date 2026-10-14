"""The presenters vocabulary, its membership check, and the presenter labels."""

from collective.techevent.vocabularies.presenter import LABELS
from plone import api
from zope.schema.vocabulary import SimpleTerm

import pytest


@pytest.fixture
def presenter(portal):
    """Return a presenter of the demo content.

    :param portal: The Plone site with the demo content.
    :returns: A Presenter object.
    """
    brains = api.content.find(portal_type="Presenter")
    assert brains, "the demo content has presenters"
    return brains[0].getObject()


@pytest.fixture
def presenters_vocab(portal, get_vocabulary):
    """Return the presenters vocabulary of the portal.

    :param portal: The Plone site.
    :param get_vocabulary: Pytest fixture returning a vocabulary by name.
    :returns: The presenters vocabulary.
    """
    return get_vocabulary("collective.techevent.vocabularies.presenters", portal)


class TestPresentersVocabulary:
    def test_terms_are_presenters_with_their_titles(self, presenters_vocab, portal):
        """Each term is a presenter, with its UID as token and its title.

        :param presenters_vocab: The presenters vocabulary.
        :param portal: The Plone site.
        """
        terms = list(presenters_vocab)

        assert terms
        for term in terms:
            assert isinstance(term, SimpleTerm)
            assert term.title == term.value.Title()
            assert presenters_vocab.getTerm(term.value).token == term.token

    def test_contains_by_uid(self, presenters_vocab, presenter):
        """A presenter UID is a member of the vocabulary.

        :param presenters_vocab: The presenters vocabulary.
        :param presenter: A presenter of the demo content.
        """
        assert api.content.get_uuid(presenter) in presenters_vocab

    def test_contains_by_path(self, presenters_vocab, presenter, portal):
        """A path relative to the site is a member of the vocabulary.

        :param presenters_vocab: The presenters vocabulary.
        :param presenter: A presenter of the demo content.
        :param portal: The Plone site.
        """
        site_depth = len(portal.getPhysicalPath())
        relative = "/" + "/".join(presenter.getPhysicalPath()[site_depth:])

        assert relative in presenters_vocab

    def test_contains_the_object(self, presenters_vocab, presenter):
        """The object itself is a member, as its UID is.

        :param presenters_vocab: The presenters vocabulary.
        :param presenter: A presenter of the demo content.
        """
        assert presenter in presenters_vocab

    def test_unknown_uid_is_not_a_member(self, presenters_vocab):
        """A UID that no object has is not a member.

        :param presenters_vocab: The presenters vocabulary.
        """
        assert "00000000000000000000000000000000" not in presenters_vocab


class TestPresenterLabels:
    @pytest.mark.parametrize("token,title", list(LABELS.items()))
    def test_label_terms(self, token, title, portal, get_vocabulary):
        """Each label is a term with its own token and translatable title.

        :param token: The label token.
        :param title: The label title, a message id.
        :param portal: The Plone site.
        :param get_vocabulary: Pytest fixture returning a vocabulary by name.
        """
        vocab = get_vocabulary(
            "collective.techevent.vocabularies.presenter_labels", portal
        )

        term = vocab.getTerm(token)

        assert term.title == title
        assert len(vocab) == len(LABELS)
