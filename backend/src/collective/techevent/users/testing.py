from collective.techevent.testing import FIXTURE as TECH_EVENT_FIXTURE
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PloneSandboxLayer
from plone.app.testing.utils import MockMailHost
from plone.dexterity.content import DexterityContent
from plone.testing.zope import WSGI_SERVER_FIXTURE
from Products.MailHost.interfaces import IMailHost
from typing import Any
from zope.component import getSiteManager


class Layer(PloneSandboxLayer):
    defaultBases = (TECH_EVENT_FIXTURE,)

    def setUpPloneSite(self, portal: DexterityContent) -> None:
        """Apply the attendee registration profile, and mock the mail host.

        :param portal: The Plone site.
        """
        applyProfile(portal, "collective.techevent.users:default")
        # Registrants get emails: keep them in MailHost.messages
        portal.MailHost = mailhost = MockMailHost("MailHost")
        # plone-stubs types the site manager as IComponentLookup, without
        # the registration methods
        sm: Any = getSiteManager(context=portal)
        sm.unregisterUtility(provided=IMailHost)
        sm.registerUtility(mailhost, provided=IMailHost)


FIXTURE = Layer()

INTEGRATION_TESTING = IntegrationTesting(
    bases=(FIXTURE,),
    name="Collective.TechconfLayer.Users:IntegrationTesting",
)


FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(FIXTURE, WSGI_SERVER_FIXTURE),
    name="Collective.TechconfLayer.Users:FunctionalTesting",
)


ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        WSGI_SERVER_FIXTURE,
    ),
    name="Collective.TechconfLayer.Users:AcceptanceTesting",
)
