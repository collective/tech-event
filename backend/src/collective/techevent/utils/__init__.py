from collective.techevent import logger
from collective.techevent.utils.event import find_event_root
from collective.techevent.utils.event import find_sponsors_db
from collective.techevent.utils.event import get_sponsorship_benefits
from collective.techevent.utils.event import sponsor_levels
from plone import api
from plone.dexterity.content import DexterityContent
from plone.dexterity.fti import DexterityFTI
from plone.dexterity.interfaces import IDexterityFTI
from zope.component import queryUtility


PERMISSIONS = [
    "collective.techevent: Add Presenter",
    "collective.techevent: Add Venue",
]

DEFAULT_ROLES = [
    "Manager",
    "Site Administrator",
    "Owner",
    "Contributor",
]


def _get_fti(portal_type: str) -> DexterityFTI:
    """Return the Dexterity FTI registered for a portal type.

    :param portal_type: Name of the portal type.
    :returns: The Dexterity FTI of the portal type.
    """
    # queryUtility returns None when the FTI does not exist, as before.
    return queryUtility(IDexterityFTI, name=portal_type)  # type: ignore[return-value, arg-type]  # plone-stubs types queryUtility with DexterityFTI as the interface


def modify_permission(
    context: DexterityContent, permission_id: str, roles: list[str]
) -> None:
    """Set the roles of a permission on an object and log the change.

    :param context: Object whose permission is changed.
    :param permission_id: Permission title.
    :param roles: Roles granted the permission, acquisition disabled.
    """
    path = context.absolute_url()
    context.manage_permission(permission_id, roles=roles, acquire=False)
    roles_label = ", ".join(roles)
    logger.info(f"{path}: Set {permission_id} to roles {roles_label}")


def _modify_tech_event_ct(portal_type: str, enable: bool) -> None:
    """Enable or disable the global_allow flag of the TechEvent type.

    :param portal_type: Name of the portal type.
    :param enable: True to allow the type globally, False to disallow it.
    """
    fti = _get_fti(portal_type)
    if enable and not fti.global_allow:
        fti.global_allow = True
        logger.info(f"Enabled {portal_type}")
    elif fti.global_allow and not enable:
        fti.global_allow = False
        logger.info(f"Disabled {portal_type}")


def _modify_conference_behavior(portal_type: str, enable: bool) -> None:
    """Add or remove the conference behavior from a portal type.

    :param portal_type: Name of the portal type.
    :param enable: True to add the behavior, False to remove it.
    """
    behavior = "collective.techevent.event_settings"
    fti = _get_fti(portal_type)
    behaviors = list(fti.behaviors)
    if enable and behavior not in behaviors:
        behaviors.append(behavior)
        logger.info(f"Added `{behavior}` to {portal_type}")
    elif behavior in behaviors and not enable:
        behaviors.remove(behavior)
        logger.info(f"Removed `{behavior}` from {portal_type}")
    fti.behaviors = tuple(behaviors)


def _modify_permissions(context: DexterityContent, enable: bool) -> None:
    """Grant or remove the TechEvent add permissions on a context.

    :param context: Object whose permissions are changed.
    :param enable: True to grant the default roles, False to remove them.
    """
    roles = DEFAULT_ROLES if enable else []
    for permission_id in PERMISSIONS:
        modify_permission(context, permission_id, roles)
    # Handle SponsorDB
    permission_id = "collective.techevent: Add SponsorsDB"
    brains = api.content.find(context, portal_type="SponsorsDB")
    if not brains:
        modify_permission(context, permission_id, roles)
    # Handle Attendees, only where the attendee registration is installed
    if _get_fti("Attendees") is not None:
        permission_id = "collective.techevent: Add Attendees Database"
        # The container is public only while open, so search unrestricted
        brains = api.content.find(context, portal_type="Attendees", unrestricted=True)
        modify_permission(context, permission_id, [] if brains else roles)


def setup_tech_event_permissions(tech_event: DexterityContent) -> None:
    """Grant the TechEvent add permissions on a Tech Event.

    With multiple events on, the Plone Site loses these permissions, so each
    Tech Event must grant them for its own content.

    :param tech_event: The Tech Event whose permissions are granted.
    """
    _modify_permissions(tech_event, True)


def _setup_existing_tech_events() -> None:
    """Grant the TechEvent add permissions on every existing Tech Event."""
    # Tech Events are private when created, so search unrestricted.
    for brain in api.content.find(portal_type="Tech Event", unrestricted=True):
        setup_tech_event_permissions(brain._unrestrictedGetObject())


def setup_tech_event(portal: DexterityContent) -> None:
    """Configure the TechEvent content type and behavior for the site.

    :param portal: The Plone site (replaced by the portal from the API).
    """
    multiple_events = api.portal.get_registry_record(
        "collective.techevent.settings.support_multiple_events"
    )
    portal = api.portal.get()
    if multiple_events:
        # Remove behavior from Plone Site
        _modify_conference_behavior("Plone Site", False)
        # Enable TechEvent content type
        _modify_tech_event_ct("Tech Event", True)
        # Remove permissions from Plone Site
        _modify_permissions(portal, False)
        # Setup permissions on existing TechEvent instances
        _setup_existing_tech_events()
    else:
        # Enable behavior for Plone Site
        _modify_conference_behavior("Plone Site", True)
        # Disable TechEvent content type
        _modify_tech_event_ct("Tech Event", False)
        # Add permissions on Plone Site
        _modify_permissions(portal, True)


__all__ = [
    "find_event_root",
    "find_sponsors_db",
    "get_sponsorship_benefits",
    "modify_permission",
    "setup_tech_event",
    "setup_tech_event_permissions",
    "sponsor_levels",
]
