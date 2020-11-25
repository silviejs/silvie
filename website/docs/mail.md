---
id: mail
title: Mail
---

There are some cases that you need to communicate with your users through email. Silvie comes with a helper function to 
send emails as easy as possible. This helper uses the [nodemailer](https://www.npmjs.com/package/nodemailer) package to 
create the mail transporter and send emails from your application. All you need to do is to configure your SMTP server 
and email account credentials in the [mail configuration file](configuration.md#mail) and import the helper function 
from `silvie/utils/mail`.

## Send Mail
The `sendMail()` function will take the email data, the receiver and the sender information. This function returns 
nothing, but you may get error messages in the console as if anything goes wrong.
- **mail** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **aliasName** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **to** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **subject** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **textBody** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **htmlBody?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The `mail` is the email address that you want to send the email from. This email address should be listed in the 
[accounts section of mail configuration](configuration.md#accounts).

The `aliasName` will be shown as the name of the sender in the receiver inbox, set it to `null` if you don't want this
to happen.

The `to` parameter is the receiver email address.

The `htmlBody` is optional, but you can send an HTML email body by passing a string with HTML contents to this 
parameter. It is recommended to send both `text` and `HTML` versions of an email in case a client does not support HTML 
content in email, or HTML content has been disabled for some reason.

```typescript
import sendMail from 'silvie/utils/mail';

sendMail(
    'no-reply@silviejs.org',
    'Silvie JS',
    'john@example.com',
    'Contribution Notes',
    'Hello, John.\nNow, you are one of our great contributors.\nThanks for contributing in the Silvie project.'
);
```

The above code will send an email from `no-reply@silviejs.org` with an alias name `Silvie JS`, to `john@example.com` 
with the provided subject and body.
