"""The ``@registration`` service, on an event root."""

from collective.techevent import _
from collective.techevent.users import registration
from collective.techevent.users.content.attendees import Attendees
from collective.techevent.users.registration import RegistrationError
from collective.techevent.users.utils import find_attendees_container
from plone import api
from plone.protect.interfaces import IDisableCSRFProtection
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from typing import Any
from zope.i18n import translate
from zope.interface import alsoProvides
from zope.interface import implementer
from zope.publisher.interfaces import IPublishTraverse


class RegistrationService(Service):
    """Shared behaviour of the ``@registration`` services."""

    def _container(self) -> Attendees:
        """Return the Attendees container of this event root.

        :returns: The container.
        :raises RegistrationError: ``404`` when the event takes no
            registrations at all.
        """
        container = find_attendees_container(self.context)
        if container is None:
            raise RegistrationError(
                404, "NotFound", _("This event does not take registrations.")
            )
        return container

    def _error(self, error: RegistrationError) -> dict[str, Any]:
        """Answer with the status and message of a registration error.

        :param error: The error.
        :returns: The error, as plone.restapi reports errors.
        """
        self.request.response.setStatus(error.status)
        message = translate(error.message, context=self.request)
        return {"error": {"type": error.type, "message": message}}


class GetRegistration(RegistrationService):
    """Whether the event takes registrations, and the user's registration."""

    def reply(self) -> dict[str, Any]:
        """Describe the registration for this event and the current user.

        :returns: The registration status, ``registration`` (``None`` when
            the user has none, or is anonymous) and, for a logged-in user
            without a registration, the ``defaults`` to pre-fill a form.
        """
        try:
            container = self._container()
        except RegistrationError as error:
            return self._error(error)
        data = registration.registration_status(container)
        data["@id"] = f"{self.context.absolute_url()}/@registration"
        data["registration"] = None
        if not api.user.is_anonymous():
            user = api.user.get_current()
            if attendee := registration.link_registration(container, user):
                data["registration"] = registration.serialize_registration(attendee)
            else:
                data["defaults"] = registration.account_defaults(user)
        return data


@implementer(IPublishTraverse)
class PostRegistration(RegistrationService):
    """Register, cancel a registration, or verify an email address.

    ``POST @registration`` registers, ``POST @registration/cancel`` cancels
    the current user's registration, and ``POST @registration/verify``
    verifies the email address with the token from the emailed link.
    """

    def __init__(self, context: Any, request: Any) -> None:
        super().__init__(context, request)  # type: ignore[call-arg]  # plone-stubs types Service without the BrowserView constructor
        self.params: list[str] = []

    def publishTraverse(self, request: Any, name: str) -> "PostRegistration":
        """Collect the action from the path.

        :param request: The request.
        :param name: The next path segment.
        :returns: This service.
        """
        self.params.append(name)
        return self

    def reply(self) -> dict[str, Any]:
        """Carry out the action.

        :returns: The registration, or an error.
        """
        alsoProvides(self.request, IDisableCSRFProtection)
        action = "/".join(self.params)
        try:
            container = self._container()
            if action == "":
                attendee = registration.register(container, json_body(self.request))
                self.request.response.setStatus(201)
            elif action == "cancel":
                attendee = registration.cancel(container)
            elif action == "verify":
                token = json_body(self.request).get("token", "")
                attendee = registration.verify(container, token)
            else:
                raise RegistrationError(404, "NotFound", f"Unknown action: {action}")
        except RegistrationError as error:
            return self._error(error)
        return registration.serialize_registration(attendee)
