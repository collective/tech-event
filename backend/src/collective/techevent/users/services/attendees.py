"""The ``@attendees`` service: the registrations of an event, for its organizers."""

from AccessControl import Unauthorized
from collective.techevent.users import registration
from collective.techevent.users.utils import find_attendees
from collective.techevent.users.utils import is_organizer
from plone import api
from plone.restapi.services import Service
from typing import Any


STATES = ("pending", "registered", "attended", "cancelled")


class GetAttendees(Service):
    """List the registrations of an Attendees container.

    Unlike ``@search``, this includes the email addresses, which the catalog
    keeps out of its metadata. The container is public while registration is
    open, so only its organizers can call this service.
    """

    def reply(self) -> dict[str, Any]:
        """List the registrations, optionally of one state.

        :returns: The registration status of the container, the number of
            registrations per state, and the registrations sorted by name.
        :raises Unauthorized: When the user does not organize the container.
        """
        container = self.context
        if not is_organizer(container):
            raise Unauthorized("Only organizers can list the registrations.")
        review_state = self.request.form.get("review_state")
        query = {"review_state": review_state} if review_state in STATES else {}
        items = []
        for brain in find_attendees(container, sort_on="sortable_title", **query):
            attendee = brain._unrestrictedGetObject()
            item = registration.serialize_registration(attendee)
            item["title"] = attendee.title
            item["UID"] = brain.UID
            items.append(item)
        counts = dict.fromkeys(STATES, 0)
        for brain in find_attendees(container):
            if brain.review_state in counts:
                counts[brain.review_state] += 1
        data = registration.registration_status(container)
        data.update({
            "@id": f"{container.absolute_url()}/@attendees",
            "items": items,
            "items_total": len(items),
            "counts": counts,
            "can_review": api.user.has_permission(
                "Review portal content", obj=container
            ),
        })
        return data
