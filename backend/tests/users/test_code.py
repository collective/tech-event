"""Registration codes."""

from collective.techevent.users import code

import pytest
import re


CODE_PATTERN = re.compile(r"^PYC26-[0-9A-HJKMNP-TV-Z]{8}$")


class TestGenerateCode:
    def test_format(self):
        assert CODE_PATTERN.match(code.generate_code("PYC26"))

    @pytest.mark.parametrize("letter", ["I", "L", "O", "U"])
    def test_alphabet_has_no_ambiguous_letters(self, letter):
        assert letter not in code.ALPHABET

    def test_alphabet(self):
        assert len(code.ALPHABET) == 32
        assert len(set(code.ALPHABET)) == 32

    def test_codes_differ(self):
        codes = {code.generate_code("PYC26") for _ in range(200)}
        assert len(codes) == 200


class TestGenerateFreeCode:
    def test_skips_taken_codes(self, monkeypatch):
        values = iter(["PYC26-AAAAAAAA", "PYC26-AAAAAAAA", "PYC26-BBBBBBBB"])
        monkeypatch.setattr(code, "generate_code", lambda prefix: next(values))
        assert code.generate_free_code("PYC26", {"PYC26-AAAAAAAA"}) == "PYC26-BBBBBBBB"

    def test_gives_up(self, monkeypatch):
        monkeypatch.setattr(code, "generate_code", lambda prefix: "PYC26-AAAAAAAA")
        with pytest.raises(code.CodeGenerationError):
            code.generate_free_code("PYC26", {"PYC26-AAAAAAAA"})


class TestPrefixFromId:
    @pytest.mark.parametrize(
        "value,expected",
        [
            ("pycerrado-2026", "PYCERRADO202"),
            ("plone", "PLONE"),
            ("a", "AX"),
            ("--", "XX"),
            ("Plone Conf 26", "PLONECONF26"),
        ],
    )
    def test_prefix(self, value, expected):
        prefix = code.prefix_from_id(value)
        assert prefix == expected
        assert code.PREFIX_PATTERN.match(prefix)
