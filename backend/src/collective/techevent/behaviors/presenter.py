from borg.localrole.interfaces import ILocalRoleProvider
from plone import api
from plone.dexterity.content import DexterityContent
from z3c.relationfield import RelationValue
from zope.component import adapter
from zope.interface import implementer
from zope.interface import Interface


class IPresenterLocalRoles(Interface):
    """Marker interface for the local roles of a presenter."""


@implementer(ILocalRoleProvider)
@adapter(IPresenterLocalRoles)
class PresenterRoleProvider:
    """Local role provider giving presenters the roles on their session."""

    def __init__(self, context: DexterityContent) -> None:
        """Store the adapted context.

        :param context: The session content the presenters are related to.
        """
        self.context = context

    def getRoles(self, user_id: str) -> list[str]:
        """Return the roles assigned to the given user ID in the context
        of presenters for the current event session.

        :param user_id: ID of the user.
        :returns: List of roles of the user in the presenters context.
        """
        mtool = api.portal.get_tool("portal_membership")
        user = mtool.getMemberById(user_id)  # type: ignore[func-returns-value]  # plone-stubs types getMemberById as returning None
        if not user:
            return []
        roles: set[str] = set()
        presenters = getattr(self.context, "presenters", [])
        for presenter_relation in presenters:
            if (
                isinstance(presenter_relation, RelationValue)
                and presenter_relation.to_object
            ):
                presenter = presenter_relation.to_object
                roles.update(user.getRolesInContext(presenter))
        return list(roles)

    def getAllRoles(self) -> list[tuple[str, tuple[str, ...]]]:
        """Retrieve all roles assigned to users in the context of presenters for
        the current event session.
        This method merges roles from all presenters for each user. It does not
        consider additional role adapters.

        :returns: List of (user ID, roles) tuples.
        """
        roles: dict[str, set[str]] = {}
        presenters = getattr(self.context, "presenters", [])
        for presenter_relation in presenters:
            if (
                isinstance(presenter_relation, RelationValue)
                and presenter_relation.to_object
            ):
                presenter = presenter_relation.to_object
                local_roles = presenter.get_local_roles()
                for user_id, user_roles in local_roles:
                    if user_id not in roles:
                        roles[user_id] = set()
                    roles[user_id].update(user_roles)
        return [(user_id, tuple(user_roles)) for user_id, user_roles in roles.items()]
