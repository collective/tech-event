from collective.techevent.users.content.attendee import Attendee
from collective.techevent.users.utils import create_totp_code
from plone import api
from plone.api.exc import InvalidParameterError
from Products.membrane.interfaces import IMembraneUserAuth

import datetime
import pytest


@pytest.fixture
def portal_type() -> str:
    return "Attendee"


@pytest.fixture
def container(portal):
    return portal["attendees"]


@pytest.fixture(scope="class")
def content(portal_class, content_factory):
    content = content_factory(
        portal_class["attendees"],
        {
            "type": "Attendee",
            "id": "1234567890",
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "janedoe@example.com",
        },
    )
    yield content


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    def test_create(self, content_factory, container, portal_type):
        content = content_factory(
            container,
            {
                "type": portal_type,
                "id": "1234567890",
                "first_name": "Jane",
                "last_name": "Doe",
                "email": "janedoe@example.com",
            },
        )
        assert content.portal_type == portal_type
        assert isinstance(content, Attendee)
        assert content.id == "1234567890"
        assert content.first_name == "Jane"
        assert content.last_name == "Doe"
        assert content.title == "Jane Doe"


class TestContentTypeSubscriber:
    @pytest.fixture(autouse=True)
    def _setup(self, content):
        self.content = content

    def test_otp_seed(self):
        totp_seed = getattr(self.content, "totp_seed", None)
        assert totp_seed is not None
        assert len(totp_seed) == 32


class TestContentMembraneUser:
    @pytest.fixture(autouse=True)
    def _setup(self, content):
        self.content = content
        self.adapter = IMembraneUserAuth(self.content, None)

    def test_adapter_registration(self):
        assert self.adapter is not None

    def test_verify_credentials(self):
        credentials = {"password": create_totp_code(self.content.totp_seed)}
        result = self.adapter.verifyCredentials(credentials)
        assert result is True

    def test_verify_credentials_invalid(self):
        credentials = {"password": "invalid"}
        result = self.adapter.verifyCredentials(credentials)
        assert result is False

    def test_verify_credentials_expired(self):
        dt_expired = datetime.datetime.now() - datetime.timedelta(minutes=11)
        credentials = {
            "password": create_totp_code(self.content.totp_seed, for_time=dt_expired)
        }
        result = self.adapter.verifyCredentials(credentials)
        assert result is False

    def test_authenticate_credentials(self):
        credentials = {"password": create_totp_code(self.content.totp_seed)}
        user = self.adapter.authenticateCredentials(credentials)
        assert user == (self.content.getUserId(), self.content.getUserName())

    def test_authenticate_credentials_invalid(self):
        credentials = {"password": "invalid"}
        user = self.adapter.authenticateCredentials(credentials)
        assert user is None


class TestContentWorkflow:
    @pytest.fixture(autouse=True)
    def _setup(self, content):
        self.content = content
        self.adapter = IMembraneUserAuth(self.content, None)

    def test_authenticate_credentials_roundtrip(self):
        credentials = {"password": create_totp_code(self.content.totp_seed)}
        user = self.adapter.authenticateCredentials(credentials)
        assert user == (self.content.getUserId(), self.content.getUserName())

        assert api.content.get_state(self.content) == "registered"
        with pytest.raises(InvalidParameterError):
            api.content.transition(self.content, "cancel")
        with api.env.adopt_roles(["Manager"]):
            api.content.transition(self.content, "cancel")
        assert api.content.get_state(self.content) == "cancelled"

        user = self.adapter.authenticateCredentials(credentials)
        assert user is None

        with pytest.raises(InvalidParameterError):
            api.content.transition(self.content, "revert")
        with api.env.adopt_roles(["Manager"]):
            api.content.transition(self.content, "revert")
        assert api.content.get_state(self.content) == "registered"

        user = self.adapter.authenticateCredentials(credentials)
        assert user == (self.content.getUserId(), self.content.getUserName())
