"""Upgrade to profile version 1001: attendee registration without Membrane.

Attendees are no longer Membrane users. The step imports the new workflows,
types, indexes and navigation setting, closes the existing Attendees
containers (each site decides when to open them), gives them the
registration prefix that is now required and the blocks of a registration
page, and reindexes the Attendees.
Existing Attendees keep their state, ``registered`` or ``cancelled``, which
the new workflow still has.
"""

from collective.techevent import logger
from collective.techevent.users.code import prefix_from_id
from collective.techevent.users.content.blocks import add_default_blocks
from collective.techevent.utils import find_event_root
from collective.techevent.utils import setup_tech_event
from DateTime import DateTime
from plone import api
from Products.GenericSetup.tool import SetupTool
from typing import Any


PROFILE = "profile-collective.techevent.users:default"

IMPORT_STEPS = ("typeinfo", "workflow", "catalog", "rolemap", "plone.app.registry")


def _close(container: Any) -> None:
    """Put an Attendees container in the ``closed`` state of its new workflow.

    :param container: The Attendees container.
    """
    # plone-stubs types the tool as IWorkflowTool, without getWorkflowById
    wf_tool: Any = api.portal.get_tool("portal_workflow")
    wf_tool.setStatusOf(
        "attendees_workflow",
        container,
        {
            "action": None,
            "actor": api.user.get_current().getId(),
            "comments": "Closed by the upgrade to attendee registration.",
            "review_state": "closed",
            "time": DateTime(),
        },
    )
    wf_tool.getWorkflowById("attendees_workflow").updateRoleMappingsFor(container)
    container.reindexObject()


def upgrade(setup_tool: SetupTool) -> None:
    """Upgrade the attendee registration to profile version 1001.

    :param setup_tool: The ``portal_setup`` tool.
    """
    for step in IMPORT_STEPS:
        setup_tool.runImportStepFromProfile(PROFILE, step, run_dependencies=False)
    if "membrane_tool" in api.portal.get().objectIds():
        logger.warning(
            "membrane_tool is still installed. Uninstall Products.membrane "
            "before removing the package."
        )
    for brain in api.content.find(portal_type="Attendees", unrestricted=True):
        container = brain._unrestrictedGetObject()
        if not getattr(container, "registration_prefix", None):
            event_root = find_event_root(container)
            container.registration_prefix = prefix_from_id(event_root.getId())
            logger.info(
                f"{container.absolute_url()}: registration prefix set to "
                f"{container.registration_prefix}"
            )
        if add_default_blocks(container):
            logger.info(f"{container.absolute_url()}: registration page blocks added")
        _close(container)
    wf_tool: Any = api.portal.get_tool("portal_workflow")
    attendee_wf = wf_tool.getWorkflowById("attendee_workflow")
    for brain in api.content.find(portal_type="Attendee", unrestricted=True):
        attendee = brain._unrestrictedGetObject()
        attendee_wf.updateRoleMappingsFor(attendee)
        attendee.reindexObject()
    # Grant, or revoke, the permission to add an Attendees container
    setup_tech_event(api.portal.get())
    logger.info("Upgraded the attendee registration.")
