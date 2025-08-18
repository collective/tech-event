from collective.techevent.testing import FIXTURE as TECH_EVENT_FIXTURE
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PloneSandboxLayer
from plone.testing import zope as zope_testing
from plone.testing.zope import WSGI_SERVER_FIXTURE

import Products.membrane


class Layer(PloneSandboxLayer):
    defaultBases = (TECH_EVENT_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load any other ZCML that is required for your tests.
        # The z3c.autoinclude feature is disabled in the Plone fixture base
        # layer.
        self.loadZCML(package=Products.membrane)
        zope_testing.installProduct(app, "Products.membrane")

    def setUpPloneSite(self, portal):
        applyProfile(portal, "collective.techevent.users:default")


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
