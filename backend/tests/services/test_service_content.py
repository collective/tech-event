"""Content added inside sessions, over HTTP."""

from plone import api

import pytest
import transaction


IMAGE_DATA = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj"
    "CDO+/R8ABKsCZD++CcMAAAAASUVORK5CYII="
)


class TestAddInsideTalk:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        """Bind the first Talk of the demo content, with empty audience and level.

        :param portal: The Plone site with the demo content.
        """
        with api.env.adopt_roles(["Manager"]):
            brains = api.content.find(portal_type="Talk")
            self.talk = brains[0].getObject()
        self.talk.session_audience = set()
        self.talk.session_level = set()
        transaction.commit()

    def test_add_image(self, api_manager_request):
        """An Image added inside a Talk with empty sets is created.

        :param api_manager_request: Manager REST session.
        """
        path = api.content.get_path(self.talk, relative=True)
        response = api_manager_request.post(
            f"/{path}",
            json={
                "@type": "Image",
                "title": "A picture",
                "image": {
                    "data": IMAGE_DATA,
                    "encoding": "base64",
                    "filename": "picture.png",
                    "content-type": "image/png",
                },
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["parent"]["session_audience"] == []
        assert data["parent"]["session_level"] == []
