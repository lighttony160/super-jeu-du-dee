const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// stockage temporaire des codes envoyés
let codes = {};

// Transporter Gmail avec variables d’environnement
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,   // défini dans Render
    pass: process.env.GMAIL_PASS    // défini dans Render
  }
});

// Route GET pour servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route pour envoyer le code de validation
app.post("/sendValidationCode", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).send("Email ou code manquant.");

    codes[email] = code;

    const mailOptions = {
      from: process.env.GMAIL_USER,   // doit être identique à l’adresse du transporter
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

// Route pour vérifier le code
app.post("/verifyCode", (req, res) => {
  const { email, enteredCode } = req.body;
  if (codes[email] && codes[email] == enteredCode) {
    res.send("✅ Compte validé !");
  } else {
    res.status(400).send("❌ Code incorrect !");
  }
});

// Route pour envoyer la confirmation de suppression
app.post("/sendDeleteConfirmation", async (req, res) => {
  try {
    const { email, playerId } = req.body;
    if (!email || !playerId) return res.status(400).send("Email ou playerId manquant.");

    const code = `DELETE-${playerId}`;
    codes[email] = code;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Confirmation de suppression définitive",
      text: `Votre code de suppression est : ${code}`
    };

    await transporter.sendMail(mailOptions);
    res.send("✅ Email de confirmation envoyé !");
  } catch (err) {
    console.error("Erreur Nodemailer:", err);
    res.status(500).send("Erreur envoi email");
  }
});

// ⚠️ Render impose d'utiliser process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur Node.js démarré sur http://localhost:${PORT}`);
});
