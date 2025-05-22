from collective.techevent import _
from plone.app.registry.browser.controlpanel import ControlPanelFormWrapper
from plone.app.registry.browser.controlpanel import RegistryEditForm
from plone.restapi.controlpanels import RegistryConfigletPanel
from zope import schema
from zope.component import adapter
from zope.interface import Interface


class ITechEventSettings(Interface):
    """TechEvent settings stored in the backend."""

    support_multiple_events = schema.Bool(
        title=_("Should we support multiple events"),
        description=_("When selected, we will add a content type TechEvent."),
        default=False,
        required=False,
    )


class TechEventSettingsEditForm(RegistryEditForm):
    schema = ITechEventSettings
    label = _("TechEvent Settings")
    schema_prefix = "collective.techevent.settings"

    def updateFields(self):
        super().updateFields()

    def updateWidgets(self):
        super().updateWidgets()


class TechEventSettingsControlPanel(ControlPanelFormWrapper):
    form = TechEventSettingsEditForm


@adapter(Interface, Interface)
class TechEventControlpanel(RegistryConfigletPanel):
    schema = ITechEventSettings
    configlet_id = "TechEventSettings"
    configlet_category_id = "plone-general"
    schema_prefix = "collective.techevent.settings"
