'use strict';


describe('send email function makes call to send', () => {
    const sendEmail = new (require('../../src/helper-classes/email.send.class.js'))({
        supportHost: 'test',
        supportRecipients: 'test',
        supportFrom: 'test'
    });
    const nodeMailer = require('nodemailer');


    const sendMailSpy = jest.fn(() => Promise.resolve());
    const createTransportSpy = jest.spyOn(nodeMailer, 'createTransport').mockImplementation(() => ({
        sendMail: sendMailSpy
    }));

    describe('should try to create email with content passed in', () => {

        const testSendEmail = sendEmail.sendSupportEmail('test subject', 'test message', false);

        it('should call create transport with required params when an email is sent', () => {
            expect(createTransportSpy).toHaveBeenCalled();

            expect(createTransportSpy).toHaveBeenCalledWith({
                host: 'test',
                port: 25,
                secure: false,
                tls: {
                    rejectUnauthorized: false
                }
            });
        });

        it('should call sendMail returned from createTransport with email contacts and contents', () => {
            expect(sendMailSpy).toHaveBeenCalled();

            expect(sendMailSpy).toHaveBeenCalledWith({
                from: 'test',
                to: 'test',
                subject: 'test subject',
                html: 'test message',
                priority: 'normal'
            });
        });
    });

});
