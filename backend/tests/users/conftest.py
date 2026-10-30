from collective.techevent.users.testing import ACCEPTANCE_TESTING
from collective.techevent.users.testing import FUNCTIONAL_TESTING
from collective.techevent.users.testing import INTEGRATION_TESTING
from datetime import datetime
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import SITE_OWNER_NAME
from plone.app.testing import SITE_OWNER_PASSWORD
from plone.app.testing import TEST_USER_ID
from plone.dexterity.content import DexterityContent
from plone.restapi.testing import RelativeSession
from pytest_plone import fixtures_factory
from zope.component.hooks import setSite
from zope.component.hooks import site

import pytest
import transaction


globals().update(
    fixtures_factory((
        (ACCEPTANCE_TESTING, "acceptance"),
        (FUNCTIONAL_TESTING, "functional"),
        (INTEGRATION_TESTING, "integration"),
    ))
)


USER_PASSWORD = "secret-password-123"  # noqa: S105


@pytest.fixture(scope="class")
def portal_class(integration_class):
    if hasattr(integration_class, "testSetUp"):
        integration_class.testSetUp()
    portal = integration_class["portal"]
    with site(portal):
        yield portal
    if hasattr(integration_class, "testTearDown"):
        integration_class.testTearDown()


@pytest.fixture(scope="session")
def content_factory():
    """Factory to create a content type in a container."""

    def func(container: DexterityContent, payload: dict) -> DexterityContent:
        payload = {k: v for k, v in payload.items() if not k.startswith("_")}
        with api.env.adopt_roles(["Manager"]):
            content = api.content.create(container=container, **payload)
        return content

    return func


@pytest.fixture
def portal(integration) -> DexterityContent:
    portal = integration["portal"]
    return portal


@pytest.fixture
def mailhost(portal):
    """Return the mock mail host, configured and emptied.

    :param portal: The Plone site.
    :returns: The ``MailHost``, whose ``messages`` lists what was sent.
    """
    api.portal.set_registry_record("plone.email_from_address", "event@example.org")
    api.portal.set_registry_record("plone.email_from_name", "Tech Event")
    host = portal.MailHost
    host.reset()
    return host


@pytest.fixture
def run_commit_hooks():
    """Run the before-commit hooks, which integration tests never commit.

    :returns: A callable running the hooks registered so far.
    """

    def func() -> None:
        for hook, args, kws in list(transaction.get().getBeforeCommitHooks()):
            hook(*args, **kws)

    return func


@pytest.fixture
def attendees_factory(content_factory):
    """Create an Attendees container in an event root.

    :param content_factory: Factory creating content in a container.
    :returns: A callable taking the event root, the workflow state to put
        the container in, and its settings.
    """

    def func(
        event_root: DexterityContent,
        state: str = "open",
        registration_prefix: str = "PYC26",
        registration_confirmation: str = "automatic",
        allow_anonymous_registration: bool = False,
        registration_deadline: datetime | None = None,
    ) -> DexterityContent:
        container = content_factory(
            event_root,
            {
                "type": "Attendees",
                "id": "attendees",
                "title": "Attendees",
                "registration_prefix": registration_prefix,
                "registration_confirmation": registration_confirmation,
                "allow_anonymous_registration": allow_anonymous_registration,
                "registration_deadline": registration_deadline,
            },
        )
        transitions = {"open": ["open"], "closed": ["open", "close"]}
        with api.env.adopt_roles(["Manager"]):
            for transition in transitions.get(state, []):
                api.content.transition(obj=container, transition=transition)
        return container

    return func


@pytest.fixture
def ticket_factory(content_factory):
    """Create a Ticket in an Attendees container.

    :param content_factory: Factory creating content in a container.
    :returns: A callable taking the container and the Ticket's fields.
    """

    def func(container: DexterityContent, **fields) -> DexterityContent:
        payload = {"type": "Ticket", "title": "Full conference", **fields}
        return content_factory(container, payload)

    return func


@pytest.fixture
def attendee_factory(content_factory):
    """Create an Attendee in an Attendees container.

    :param content_factory: Factory creating content in a container.
    :returns: A callable taking the container and the Attendee's fields.
    """

    def func(container: DexterityContent, **fields) -> DexterityContent:
        payload = {
            "type": "Attendee",
            "title": "Jane Doe",
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane@example.org",
            **fields,
        }
        return content_factory(container, payload)

    return func


@pytest.fixture
def member_factory():
    """Create members in the current site.

    :returns: A callable taking the user id, email and full name.
    """

    def func(user_id: str, email: str, fullname: str = "Ada Lovelace"):
        with api.env.adopt_roles(["Manager"]):
            return api.user.create(
                username=user_id,
                email=email,
                password=USER_PASSWORD,
                properties={"fullname": fullname},
            )

    return func


@pytest.fixture
def manager(portal):
    """Give the test user the Manager role."""
    setRoles(portal, TEST_USER_ID, ["Manager"])
    yield
    setRoles(portal, TEST_USER_ID, ["Member"])


@pytest.fixture
def functional_portal(functional):
    """Return the portal of the functional layer, as the current site.

    :param functional: The functional layer.
    :returns: The Plone site.
    """
    portal = functional["portal"]
    setSite(portal)
    return portal


@pytest.fixture
def api_session_factory(functional_portal):
    """Create sessions on the REST API of the functional layer.

    :param functional_portal: The Plone site.
    :returns: A callable taking optional ``(user, password)`` credentials.
    """
    sessions = []

    def factory(auth: tuple[str, str] | None = None) -> RelativeSession:
        url = functional_portal.absolute_url()
        session = RelativeSession(f"{url}/++api++")
        session.headers.update({"Accept": "application/json"})
        if auth:
            session.auth = auth
        sessions.append(session)
        return session

    yield factory
    for session in sessions:
        session.close()


@pytest.fixture
def api_anon(api_session_factory):
    return api_session_factory()


@pytest.fixture
def api_manager(api_session_factory):
    return api_session_factory((SITE_OWNER_NAME, SITE_OWNER_PASSWORD))


@pytest.fixture
def api_member(functional_portal, member_factory, api_session_factory):
    """A REST API session logged in as Ada, a site member."""
    member_factory("ada", "ada@example.org", "Ada Lovelace")
    transaction.commit()
    return api_session_factory(("ada", USER_PASSWORD))


@pytest.fixture
def api_local_role_factory(functional_portal, member_factory, api_session_factory):
    """Create REST API sessions for members with a local role on some content.

    :returns: A callable taking the content and the role.
    """

    def func(obj: DexterityContent, role: str) -> RelativeSession:
        user_id = role.lower().replace(" ", "-")
        member_factory(user_id, f"{user_id}@example.org", role)
        api.user.grant_roles(username=user_id, obj=obj, roles=[role])
        transaction.commit()
        return api_session_factory((user_id, USER_PASSWORD))

    return func


@pytest.fixture
def commit():
    """Commit the transaction, so the functional server sees the changes."""

    def func() -> None:
        transaction.commit()

    return func
