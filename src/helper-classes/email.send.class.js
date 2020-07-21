'use strict';


/**
 * class used to send support emails when things go wrong!
 */
class SendEmail {
    #nodeMailer = require('nodemailer');
    #supportHost;
    #supportRecipients;
    #supportFrom;

    constructor({
                    supportHost,
                    supportRecipients,
                    supportFrom
                }) {
        if (typeof supportHost !== 'string' || typeof supportRecipients !== 'string' || typeof supportFrom !== 'string') {
            throw 'SendEmail.constructor: Cannot send email, invalid supportHost/supportFrom/recipients.';
        }

        this.#supportHost = supportHost;
        this.#supportRecipients = supportRecipients;
        this.#supportFrom = supportFrom;
    }

    /**
     * send email, will log to console if failure
     * @param subject {string} subject of your email
     * @param message {string} html message
     * @param highPriority {boolean}
     */
    sendSupportEmail(subject, message, highPriority = false) {
        console.info(`SendEmail.sendSupportEmail: attempting to send email to [${this.#supportRecipients}] subject "${subject}"`);

        this.#nodeMailer.createTransport({
            host: this.#supportHost,
            port: 25,
            secure: false,
            tls: {
                rejectUnauthorized: false
            }
        }).sendMail({
            from: this.#supportFrom,
            to: this.#supportRecipients,
            subject: subject,
            html: message,
            priority: highPriority ? 'high' : 'normal'
        }).catch(emailErr => {
            console.error(`SendEmail.sendSupportEmail: Error sending support email "${subject}"`, emailErr);
        });
    }
}


module.exports = SendEmail;
