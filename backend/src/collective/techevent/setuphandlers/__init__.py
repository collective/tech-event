from Products.CMFPlone.interfaces import INonInstallable  # type: ignore[attr-defined]  # plone-stubs does not export INonInstallable from this module
from zope.interface import implementer


@implementer(INonInstallable)
class HiddenProfiles:
    """Hide the uninstall profile from site creation and quickinstaller."""

    def getNonInstallableProfiles(self) -> list[str]:
        """Return the profiles that must not be installable.

        :returns: List of profile ids hidden from the site creation form.
        """
        return [
            "collective.techevent:uninstall",
        ]
