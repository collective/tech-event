from collective.techevent import _
from collective.techevent.users.utils import validate_unique_email
from plone import api
from plone.autoform import directives
from plone.dexterity.content import Container
from plone.schema import Email
from plone.supermodel import model
from Products.membrane.interfaces import IMembraneUserObject
from Products.PlonePAS.tools.memberdata import MemberData
from z3c.form.interfaces import IEditForm
from zope import schema
from zope.interface import implementer
from zope.interface import Interface
from zope.interface import Invalid
from zope.interface import invariant


class IBaseUser(Interface):
    id = schema.ASCIILine(title=_("User ID"), required=True)
    directives.order_before(id="*")

    title = schema.TextLine(readonly=True)
    first_name = schema.TextLine(
        title=_("First Name"),
        required=True,
    )
    last_name = schema.TextLine(
        title=_("Last Name"),
        required=True,
    )
    email = Email(
        title=_("E-mail Address"),
        required=True,
    )
    totp_seed = schema.ASCIILine(
        title=_("TOTP Shared Secret"),
        required=False,
    )
    model.fieldset("credentials", label=_("Credentials"), fields=["email", "totp_seed"])

    directives.read_permission(
        id="zope2.View",
        email="zope2.View",
        text="zope2.View",
        totp_seed="zope2.ManageUsers",
    )
    directives.write_permission(
        id="cmf.ReviewPortalContent",
        email="cmf.ReviewPortalContent",
        text="cmf.ModifyPortalContent",
        totp_seed="zope2.ManageUsers",
    )
    directives.omitted("totp_seed")
    directives.no_omit(IEditForm, "totp_seed")

    @invariant
    def email_unique(data):
        """The email must be unique, as it is the login name (user name).

        The tricky thing is to make sure editing a user and keeping
        his email the same actually works.
        """
        user = data.__context__
        if (
            user is not None
            and getattr(user, "email", None)
            and user.email == data.email
        ):
            # No change, fine.
            return
        error = validate_unique_email(data.email)
        if error:
            raise Invalid(error)

    exclude_from_nav = schema.Bool(
        default=True,
        required=False,
    )
    directives.omitted("exclude_from_nav")


@implementer(IBaseUser, IMembraneUserObject)
class BaseUser(Container):
    """A Membrane user."""

    @property
    def title(self) -> str:
        return f"{self.first_name} {self.last_name}"

    @title.setter
    def title(self, value: str):
        # title is not writable
        pass

    def getUserId(self) -> str:
        return self.id

    def getUserName(self) -> str:
        return self.email

    def get_full_name(self) -> str:
        return self.title

    @property
    def user(self) -> MemberData | None:
        user = api.user.get(userid=self.id)
        if user:
            return user
        return None
