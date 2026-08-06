// pb_hooks/main.pb.js
//
// Chaque jour à 8h00 (heure du serveur), il regarde les réservations prévues
// le lendemain et envoie un email de rappel au client (et une copie à vous),
// puis marque la réservation pour ne pas envoyer le rappel deux fois.

cronAdd("rappels_quotidiens", "0 8 * * *", () => {
  const demain = new Date();
  demain.setDate(demain.getDate() + 1);
  const demainStr = demain.toISOString().slice(0, 10);

  const reservations = $app.dao().findRecordsByFilter(
    "reservations",
    `date = "${demainStr}" && rappel_envoye = false && statut != "annulee"` 
  );

  const parametresList = $app.dao().findRecordsByFilter("parametres", "");
  const adminEmail = parametresList.length ? parametresList[0].get("email") : "contact@serviceschablais.fr";

  reservations.forEach((r) => {
    const nom = r.get("nom");
    const service = r.get("service");
    const heure = r.get("heure");
    const email = r.get("email");

    if (email) {
      const message = new MailerMessage({
        from: { address: adminEmail, name: "Services Chablais" },
        to: [{ address: email }],
        cc: [{ address: adminEmail }],
        subject: "Rappel : votre intervention demain — Services Chablais",
        text:
          "Bonjour " + nom + ",\n\n" +
          "Petit rappel : votre rendez-vous " + service + " est prévu demain à " + heure + ".\n\n" +
          "À demain,\nServices Chablais",
      });
      $app.newMailClient().send(message);
    }

    r.set("rappel_envoye", true);
    $app.dao().saveRecord(r);
  });
});

onRecordAfterCreateRequest((e) => {
  const r = e.record;

  const parametresList = $app.dao().findRecordsByFilter("parametres", "");
  const adminEmail = parametresList.length ? parametresList[0].get("email") : "contact@serviceschablais.fr";
  const adminPhone = parametresList.length ? parametresList[0].get("telephone") : "04 56 35 92 40";

  const nom = r.get("nom");
  const telephone = r.get("telephone");
  const email = r.get("email");
  const adresse = r.get("adresse");
  const service = r.get("service");
  const date = r.get("date");
  const heure = r.get("heure");
  const message = r.get("message");

  // Email de confirmation au client
  if (email) {
    const confirmation = new MailerMessage({
      from: { address: adminEmail, name: "Services Chablais" },
      to: [{ address: email }],
      subject: "Confirmation de votre demande — Services Chablais",
      text:
        "Bonjour " + nom + ",\n\n" +
        "Votre demande pour le service " + service + " a bien été enregistrée.\n" +
        "Date souhaitée : " + date + " à " + heure + "\n" +
        "Adresse : " + (adresse || "non renseignée") + "\n\n" +
        "Nous vous rappelons sous 24h pour confirmer le créneau exact.\n\n" +
        "À bientôt,\n" +
        "Services Chablais\n" +
        "Tél. " + adminPhone + "\n" +
        "Email : " + adminEmail,
    });
    $app.newMailClient().send(confirmation);
  }

  // Notification à l'admin
  const notification = new MailerMessage({
    from: { address: adminEmail, name: "Services Chablais" },
    to: [{ address: adminEmail }],
    subject: "Nouvelle réservation — " + nom,
    text:
      "Nouvelle demande reçue depuis le site.\n\n" +
      "Nom : " + nom + "\n" +
      "Téléphone : " + telephone + "\n" +
      "Email : " + (email || "non renseigné") + "\n" +
      "Adresse : " + (adresse || "non renseignée") + "\n" +
      "Service : " + service + "\n" +
      "Date : " + date + " à " + heure + "\n" +
      "Message : " + (message || "aucun") + "\n\n" +
      "Connectez-vous à l'admin pour la traiter : https://serviceschablais-pb.fly.dev/_/",
  });
  $app.newMailClient().send(notification);
}, "reservations");
