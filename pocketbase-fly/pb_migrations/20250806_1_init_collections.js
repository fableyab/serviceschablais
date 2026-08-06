/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const clients = new Collection({
    name: "clients",
    type: "base",
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
    fields: [
      { name: "nom", type: "text", required: true, options: { min: null, max: null, pattern: "" } },
      { name: "email", type: "email", required: false, options: {} },
      { name: "telephone", type: "text", required: true, options: { min: null, max: null, pattern: "" } },
      { name: "adresse", type: "text", required: false, options: { min: null, max: null, pattern: "" } },
      { name: "cree_par_admin", type: "bool", required: false, options: {} },
      { name: "notes_internes", type: "text", required: false, options: { min: null, max: null, pattern: "" } }
    ]
  });
  app.save(clients);

  const clientsCol = app.findCollectionByNameOrId("clients");

  const reservations = new Collection({
    name: "reservations",
    type: "base",
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
    fields: [
      { name: "client", type: "relation", required: false, options: { collectionId: clientsCol.id, cascadeDelete: false } },
      { name: "nom", type: "text", required: true, options: { min: null, max: null, pattern: "" } },
      { name: "telephone", type: "text", required: true, options: { min: null, max: null, pattern: "" } },
      { name: "email", type: "email", required: false, options: {} },
      { name: "adresse", type: "text", required: false, options: { min: null, max: null, pattern: "" } },
      { name: "service", type: "text", required: true, options: { min: null, max: null, pattern: "" } },
      { name: "date", type: "date", required: true, options: { min: "", max: "" } },
      { name: "heure", type: "text", required: true, options: { min: null, max: null, pattern: "" } },
      { name: "message", type: "text", required: false, options: { min: null, max: null, pattern: "" } },
      { name: "statut", type: "select", required: false, options: { values: ["nouvelle", "confirmee", "terminee", "annulee"], maxSelect: 1 } },
      { name: "rappel_envoye", type: "bool", required: false, options: {} }
    ]
  });
  app.save(reservations);

  const parametres = new Collection({
    name: "parametres",
    type: "base",
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
    fields: [
      { name: "telephone", type: "text", required: false, options: { min: null, max: null, pattern: "" } },
      { name: "whatsapp", type: "text", required: false, options: { min: null, max: null, pattern: "" } },
      { name: "email", type: "email", required: false, options: {} },
      { name: "rappel_veille", type: "bool", required: false, options: {} },
      { name: "rappel_2h", type: "bool", required: false, options: {} },
      { name: "notif_matin", type: "bool", required: false, options: {} }
    ]
  });
  app.save(parametres);

  const p = new Record(parametres);
  p.set("telephone", "+33456359240");
  p.set("whatsapp", "+33615767067");
  p.set("email", "contact@serviceschablais.fr");
  p.set("rappel_veille", true);
  p.set("rappel_2h", false);
  p.set("notif_matin", true);
  app.save(p);
}, (app) => {
  try { app.delete(app.findCollectionByNameOrId("parametres")); } catch (e) {}
  try { app.delete(app.findCollectionByNameOrId("reservations")); } catch (e) {}
  try { app.delete(app.findCollectionByNameOrId("clients")); } catch (e) {}
});
