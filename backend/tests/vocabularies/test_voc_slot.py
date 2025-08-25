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


class TestRoomVocab(BaseVocab):
    name: str = "collective.techevent.vocabularies.slot_rooms"

    @pytest.mark.parametrize(
        "token,title",
        [
            ("3bc34856166b45199360f6699bb102f4", "Main Room"),
            ("145bd2eda2ba493e857734c02fcda68d", "Beta Room"),
            ("a4ce8fd1773f4e61af1731db1012b4d5", "Training room"),
        ],
    )
    def test_vocab_terms(self, token: str, title: str):
        term = self.vocab.getTermByToken(token)
        assert term.title == title

    def test_vocab_order(self):
        content_titles = [x.title for x in self.portal.about.venue.objectValues()]
        vocab_titles = [x.title for x in self.vocab]
        assert content_titles != reversed(vocab_titles)
        assert content_titles == vocab_titles
        assert [x.token for x in self.vocab] == [
            "3bc34856166b45199360f6699bb102f4",
            "145bd2eda2ba493e857734c02fcda68d",
            "a4ce8fd1773f4e61af1731db1012b4d5",
        ]
