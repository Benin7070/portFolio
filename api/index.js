const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const path = require('path');
const dns = require('dns');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

const resend = new Resend(process.env.RESEND_API_KEY);

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.post('/api/mail', async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const isValidDomain = await validateEmailDomain(email);
        if (!isValidDomain) {
            return res.status(400).json({ error: "Email domain does not exist." });
        }

        const responseAdmin = await resend.emails.send({
            from: `"BeninFX Contact" <${process.env.contactEmail}>`,
            to: [`${process.env.adminEmail}`],
            reply_to: email,
            subject: subject,
            html: `<p><strong>From:</strong> ${name} (${String(email)})</p>
                   <p><strong>Subject:</strong> ${subject}</p>
                   <p><strong>Message:</strong> ${message}</p>`,
        });

        const responceUser = await resend.emails.send({
            from: `"BeninFx Contact" <contact@beninfx.site>`,
            to: [`${email}`],
            subject: "Thank you for contacting BeninFx ",
            html: `<h2>BeninFx</h2>
                   <p>Thank you for contacting Beninfx, you will get your responce as soon as possible...</p>
                   <p><strong>Thank you</strong></p>
                   <p>from Beninfx team</p>`
        });

        res.json({ success: "Email sent Successfully!!", responseAdmin, responceUser, status: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to send email", details: error });
    }
});

const validateEmailDomain = (email) => {
    return new Promise((resolve) => {
        if (!email.includes('@') || email.split('@').length !== 2) {
            return resolve(false);
        }

        const domain = email.split('@')[1];

        dns.resolveMx(domain, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                return resolve(false);
            }
            resolve(true);
        });
    });
};

app.get("/api/services", (req, res) => {
     const filePath = path.join(__dirname, 'data', 'services.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read services file" });
        }
        try {
            const services = JSON.parse(data);
            res.json(services);
        } catch (parseErr) {
            res.status(500).json({ error: "Failed to parse services file" });
        }
    });
});

app.listen(3000, () => console.log("Server is Running."));

module.exports = app;

