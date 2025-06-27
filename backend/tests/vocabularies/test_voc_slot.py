from zope.schema.vocabulary import SimpleVocabulary

import pytest


class BaseVocab:
    name: str = ""

    @pytest.fixture(autouse=True)
    def _setup(self, portal, get_vocabulary):
        self.portal = portal
        self.vocab = get_vocabulary(self.name, portal)

    def test_vocabulary_type(self):
        assert isinstance(self.vocab, SimpleVocabulary)


class TestSlotVocab(BaseVocab):
    name: str = "collective.techevent.vocabularies.slot_categories"

    @pytest.mark.parametrize(
        "token,title",
        [
            ("slot", "Slot"),
            ("registration", "Registration"),
            ("meeting", "Meeting"),
            ("photo", "Conference Photo"),
        ],
    )
    def test_vocab_terms(self, token: str, title: str):
        term = self.vocab.getTermByToken(token)
        assert term.title == title


class TestSessionVocab(BaseVocab):
    name: str = "collective.techevent.vocabularies.session_categories"

    @pytest.mark.parametrize(
        "token,title",
        [
            ("activity", "Activity"),
        ],
    )
    def test_vocab_terms(self, token: str, title: str):
        term = self.vocab.getTermByToken(token)
        assert term.title == title


class TestBreakVocab(BaseVocab):
    name: str = "collective.techevent.vocabularies.break_categories"

    @pytest.mark.parametrize(
        "token,title",
        [
            ("coffee-break", "Coffee-Break"),
            ("lunch", "Lunch"),
        ],
    )
    def test_vocab_terms(self, token: str, title: str):
        term = self.vocab.getTermByToken(token)
        assert term.title == title
