param(
  [string]$PbUrl = "https://serviceschablais-pb.fly.dev",
  [string]$AdminEmail = "fabrice.fays@outlook.fr"
)

$ErrorActionPreference = "Stop"

$passFile = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "admin-password.txt"
$adminPass = (Get-Content $passFile -Raw).Trim()

$auth = @{
  identity = $AdminEmail
  password = $adminPass
} | ConvertTo-Json

$authResp = Invoke-RestMethod -Uri "$PbUrl/api/admins/auth-with-password" -Method POST -ContentType "application/json" -Body $auth
$token = $authResp.token

$headers = @{
  Authorization = $token
}

try {
  $existing = Invoke-RestMethod -Uri "$PbUrl/api/collections" -Headers $headers
  $ids = @{}; foreach ($item in $existing.items) { $ids[$item.name] = $item.id }
  if ($ids.ContainsKey("reservations")) { Invoke-RestMethod -Uri "$PbUrl/api/collections/$($ids['reservations'])" -Method DELETE -Headers $headers | Out-Null }
  if ($ids.ContainsKey("clients")) { Invoke-RestMethod -Uri "$PbUrl/api/collections/$($ids['clients'])" -Method DELETE -Headers $headers | Out-Null }
  if ($ids.ContainsKey("parametres")) { Invoke-RestMethod -Uri "$PbUrl/api/collections/$($ids['parametres'])" -Method DELETE -Headers $headers | Out-Null }
} catch { }

$clients = @{
  name = "clients"
  type = "base"
  listRule = "@request.auth.id != ''"
  viewRule = "@request.auth.id != ''"
  createRule = "@request.auth.id != ''"
  updateRule = "@request.auth.id != ''"
  deleteRule = "@request.auth.id != ''"
  schema = @(
    @{ name = "nom"; type = "text"; required = $true; options = @{ min = 0; max = 999; pattern = "" } }
    @{ name = "email"; type = "email"; required = $false; options = @{} }
    @{ name = "telephone"; type = "text"; required = $true; options = @{ min = 0; max = 999; pattern = "" } }
    @{ name = "adresse"; type = "text"; required = $false; options = @{ min = 0; max = 999; pattern = "" } }
    @{ name = "cree_par_admin"; type = "bool"; required = $false; options = @{} }
    @{ name = "notes_internes"; type = "text"; required = $false; options = @{ min = 0; max = 999; pattern = "" } }
  )
} | ConvertTo-Json -Depth 10

$clientsResp = Invoke-RestMethod -Uri "$PbUrl/api/collections" -Method POST -ContentType "application/json" -Headers $headers -Body $clients

$reservations = @{
  name = "reservations"
  type = "base"
  listRule = "@request.auth.id != ''"
  viewRule = "@request.auth.id != ''"
  createRule = ""
  updateRule = "@request.auth.id != ''"
  deleteRule = "@request.auth.id != ''"
  schema = @(
    @{ name = "client"; type = "relation"; required = $false; options = @{ collectionId = $clientsResp.id; maxSelect = 1; cascadeDelete = $false } }
    @{ name = "nom"; type = "text"; required = $true; options = @{ min = 0; max = 999; pattern = "" } }
    @{ name = "telephone"; type = "text"; required = $true; options = @{ min = 0; max = 999; pattern = "" } }
    @{ name = "email"; type = "email"; required = $false; options = @{} }
    @{ name = "adresse"; type = "text"; required = $false; options = @{ min = 0; max = 999; pattern = "" } }
    @{ name = "service"; type = "text"; required = $true; options = @{ min = 0; max = 999; pattern = "" } }
    @{ name = "date"; type = "date"; required = $true; options = @{ min = ""; max = "" } }
    @{ name = "heure"; type = "text"; required = $true; options = @{ min = 0; max = 999; pattern = "" } }
    @{ name = "message"; type = "text"; required = $false; options = @{ min = 0; max = 999; pattern = "" } }
    @{ name = "statut"; type = "select"; required = $false; options = @{ maxSelect = 1; values = @("nouvelle", "confirmee", "terminee", "annulee") } }
    @{ name = "rappel_envoye"; type = "bool"; required = $false; options = @{} }
  )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$PbUrl/api/collections" -Method POST -ContentType "application/json" -Headers $headers -Body $reservations | Out-Null

$parametres = @{
  name = "parametres"
  type = "base"
  listRule = "@request.auth.id != ''"
  viewRule = "@request.auth.id != ''"
  createRule = "@request.auth.id != ''"
  updateRule = "@request.auth.id != ''"
  deleteRule = "@request.auth.id != ''"
  schema = @(
    @{ name = "telephone"; type = "text"; required = $false; options = @{ min = 0; max = 999; pattern = "" } }
    @{ name = "whatsapp"; type = "text"; required = $false; options = @{ min = 0; max = 999; pattern = "" } }
    @{ name = "email"; type = "email"; required = $false; options = @{} }
    @{ name = "rappel_veille"; type = "bool"; required = $false; options = @{} }
    @{ name = "rappel_2h"; type = "bool"; required = $false; options = @{} }
    @{ name = "notif_matin"; type = "bool"; required = $false; options = @{} }
  )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$PbUrl/api/collections" -Method POST -ContentType "application/json" -Headers $headers -Body $parametres | Out-Null

$record = @{
  telephone = "+33456359240"
  whatsapp = "+33615767067"
  email = "contact@serviceschablais.fr"
  rappel_veille = $true
  rappel_2h = $false
  notif_matin = $true
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$PbUrl/api/collections/parametres/records" -Method POST -ContentType "application/json" -Headers $headers -Body $record | Out-Null

Write-Host "Schema initialisé avec succès."
