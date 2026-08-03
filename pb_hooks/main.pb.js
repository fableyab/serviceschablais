// pb_hooks/main.pb.js
//
// INSTALLATION :
// 1. Sur le serveur où tourne PocketBase, créez (si elle n'existe pas déjà)
//    un dossier "pb_hooks" au même niveau que l'exécutable PocketBase.
// 2. Placez ce fichier dedans, exactement sous ce nom : main.pb.js
// 3. Redémarrez PocketBase (il recharge automatiquement les hooks au démarrage).
//
// CE QUE FAIT CE FICHIER :
// Chaque jour à 8h00 (heure du serveur), il regarde les réservations prévues
// le lendemain et envoie un email de rappel au client (et une copie à vous),
// puis marque la réservation pour ne pas envoyer le rappel deux fois.

cronAdd("rappels_quotidiens", "0 8 * * *", () => {
  const demain = new Date();
  demain.setDate(demain.getDate() + 1);
  const demainStr = demain.toISOString().slice(0, 10);

  const reservations = $app.findRecordsByFilter(
    "reservations",
    `date = "${demainStr}" && rappel_envoye = false && statut != "annulee"` 
  );

  const parametresList = $app.findRecordsByFilter("parametres", "");
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
    $app.save(r);
  });
});
