from collective.techevent import _
from collective.techevent.users.utils import create_totp_code
from collective.techevent.users.utils import get_membrane_user
from plone.base.interfaces import IPasswordResetToolView
from plone.base.utils import safe_text
from Products.CMFPlone.browser.login.password_reset import (
    PasswordResetToolView as BasePasswordResetToolView,
)
from zope.i18n import translate
from zope.interface import implementer


@implementer(IPasswordResetToolView)
class PasswordResetToolView(BasePasswordResetToolView):
    def __call__(self, member, **kwargs):
        user = get_membrane_user(
            self.context, member.getUserId(), get_object=True, unrestricted=True
        )
        if user is None:
            return self.index(member=member, **kwargs)
        return f"""\
From: {self.encoded_mail_sender()}
To: {member.getProperty("email")}
Subject: {self.mail_totp_subject()}
Content-Type: text/plain
Precedence: bulk


Your one-time password is: {create_totp_code(user.totp_seed)}

This password is valid for 10 minutes.

If you did not request this, please ignore this email.
"""

    def mail_totp_subject(self):
        portal_name = self.portal_state().portal_title()
        return translate(
            _(
                "mailtemplate_subject_totp",
                default="Your one time password for ${portal_name}",
                mapping={"portal_name": safe_text(portal_name)},
            ),
            context=self.request,
        )
