const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lighttony160@gmail.com",     // ton vrai email Gmail
    pass: "peys phjq rxqu dqfk"         // ton mot de passe d’application Google
  }
});

app.post("/sendValidationCode", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).send("Email ou code manquant.");

    codes[email] = code;

    const mailOptions = {
      from: "lighttony160@gmail.com",   // doit être identique à l’adresse du transporter
      to: email,
      subject: "Code de validation — Super Jeu du Dé",
      text: `Voici ton code de validation : ${code}`
    };

    await transporter.sendMail(mailOptions);
    res.send("✅ Email envoyé avec succès !");
  } catch (err) {
    console.error("Erreur Nodemailer:", err);
    res.status(500).send("Erreur envoi email");
  }
});
