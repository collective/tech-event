from borg.localrole.interfaces import ILocalRoleProvider
from plone import api
from z3c.relationfield import RelationValue
from zope.component import adapter
from zope.interface import implementer
from zope.interface import Interface


class IPresenterLocalRoles(Interface):
    """Marker interface for the local roles of a presenter."""


@implementer(ILocalRoleProvider)
@adapter(IPresenterLocalRoles)
class PresenterRoleProvider:
    def __init__(self, context):
        self.context = context

    def getRoles(self, user_id):
        """Return the roles assigned to the given user ID in the context
        of presenters for the current event session.
        """
        mtool = api.portal.get_tool("portal_membership")
        user = mtool.getMemberById(user_id)
        if not user:
            return []
        roles = set()
        presenters = getattr(self.context, "presenters", [])
        for presenter_relation in presenters:
            if (
                isinstance(presenter_relation, RelationValue)
                and presenter_relation.to_object
            ):
                presenter = presenter_relation.to_object
                roles.update(user.getRolesInContext(presenter))
        return list(roles)

    def getAllRoles(self):
        """Retrieve all roles assigned to users in the context of presenters for
        the current event session.
        This method merges roles from all presenters for each user. It does not
        consider additional role adapters.
        """
        roles = {}
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
