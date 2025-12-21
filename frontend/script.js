function generateCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Envoi du code de validation
async function sendCode() {
  const email = document.getElementById("email").value;
  const code = generateCode();

  try {
    const response = await fetch("http://localhost:3000/sendValidationCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    });

    const result = await response.text();
    alert("Résultat serveur : " + result);
  } catch (error) {
    alert("Erreur lors de l'envoi");
  }
}

// Vérification du code
async function verifyCode() {
  const email = document.getElementById("email").value;
  const enteredCode = document.getElementById("enteredCode").value;

  try {
    const response = await fetch("http://localhost:3000/verifyCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, enteredCode })
    });

    const result = await response.text();
    alert(result);
  } catch (error) {
    alert("Erreur lors de la vérification");
  }
}

// Envoi de la demande de suppression
async function sendDelete() {
  const email = document.getElementById("email").value;
  const playerId = document.getElementById("playerId").value;

  try {
    const response = await fetch("http://localhost:3000/sendDeleteConfirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, playerId })
    });

    const result = await response.text();
    alert("Résultat serveur : " + result);
  } catch (error) {
    alert("Erreur lors de la suppression");
  }
}
