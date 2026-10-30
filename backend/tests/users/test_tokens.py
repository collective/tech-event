"""Signed tokens for the email verification link."""

from collective.techevent.users import tokens
from datetime import datetime
from datetime import timedelta
from datetime import UTC

import pytest


NOW = datetime(2026, 10, 29, 12, 0, tzinfo=UTC)


class TestTokens:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.token = tokens.create_token("abc123", now=NOW)

    def test_roundtrip(self):
        assert tokens.read_token(self.token, now=NOW) == "abc123"

    def test_valid_until_expiry(self):
        later = NOW + tokens.TOKEN_LIFETIME - timedelta(seconds=1)
        assert tokens.read_token(self.token, now=later) == "abc123"

    def test_expired(self):
        with pytest.raises(tokens.InvalidToken):
            tokens.read_token(self.token, now=NOW + tokens.TOKEN_LIFETIME)

    def test_tampered_payload(self):
        payload, signature = self.token.split(".")
        other = tokens.create_token("other", now=NOW).split(".")[0]
        with pytest.raises(tokens.InvalidToken):
            tokens.read_token(f"{other}.{signature}", now=NOW)
        assert payload != other

    def test_tampered_signature(self):
        payload, signature = self.token.split(".")
        forged = ("A" if signature[0] != "A" else "B") + signature[1:]
        with pytest.raises(tokens.InvalidToken):
            tokens.read_token(f"{payload}.{forged}", now=NOW)

    @pytest.mark.parametrize("value", ["", "nodot", ".", "abc.", ".abc"])
    def test_malformed(self, value):
        with pytest.raises(tokens.InvalidToken):
            tokens.read_token(value, now=NOW)

    def test_signed_garbage(self):
        """A payload that is not JSON is refused even with a valid signature."""
        payload = tokens._encode(b"not json")
        token = f"{payload}.{tokens._signature(payload)}"
        with pytest.raises(tokens.InvalidToken):
            tokens.read_token(token, now=NOW)
