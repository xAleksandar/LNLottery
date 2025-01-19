const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SERVICE_EMAIL,
    pass: process.env.SERVICE_EMAIL_PASSWORD,
  },
});

type Props = {
  to: string;
  token: string;
};

export const sendMail = (props: Props) => {
  const { to, token } = props;
  const mailOptions = {
    from: 'mailer@lnbets.fun',
    to,
    subject: 'Confirm Your Email',
    text: `Click the link to confirm: https://your-app.com/confirm-email?token=${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    }
  });
};
