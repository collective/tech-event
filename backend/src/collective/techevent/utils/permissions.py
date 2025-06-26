from collective.techevent.content.schedule.schedule import Schedule


def modify_schedule_permissions(content: Schedule):
    """Modify permissions inside the Schedule object to allow adding activities
    inside subfolders.
    """
    default_roles = ["Manager", "Site Administrator", "Owner", "Contributor"]
    permissions = [
        "collective.techevent: Add Training",
        "collective.techevent: Add Slot",
        "collective.techevent: Add Talk",
        "collective.techevent: Add Keynote",
    ]
    for permission in permissions:
        content.manage_permission(
            permission,
            roles=default_roles,
            acquire=False,
        )
