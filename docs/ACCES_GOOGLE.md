# Accés restringit amb Google · pendent d’activació

Política sol·licitada: només `laracostafreda@gmail.com` i `educaciomanteros@gmail.com`, amb rol de consulta. Qualsevol altre compte s’ha de denegar. La llista és a `access/google-access.json`, en aquest repositori privat.

**Estat real:** la llista està documentada, però l’inici de sessió amb Google no està activat. El web existent conserva el control d’accés privat de Sites / ChatGPT. No s’han enviat invitacions ni s’ha ampliat l’audiència del web. El fitxer JSON no protegeix cap ruta per si sol.

## Requisits per activar-ho

1. Un proveïdor o servidor d’allotjament que pugui autenticar amb Google i autoritzar cada petició abans de lliurar HTML, JavaScript, JSON i fitxers descarregables. No servir `dist/` públicament en paral·lel.
2. Si s’utilitza OAuth propi: un projecte de Google Cloud i un client OAuth de tipus aplicació web per al domini final. Registrar la URL de retorn exacta del servidor. Configurar el Client ID i el Client Secret al gestor de secrets de l’allotjament, mai en codi, navegador, GitHub ni missatges del xat. Si la pantalla de consentiment és en proves, cal autoritzar els dos comptes també com a usuaris de prova; això no substitueix l’autorització al servidor.
3. El servidor ha de validar la identitat emesa per Google, incloent emissor, destinatari, expiració i correu verificat, i comparar el correu amb la llista exacta. No acceptar un correu escrit al formulari com a prova d’identitat.
4. Provar els dos comptes autoritzats, un tercer compte denegat, una sessió anònima, l’accés directe a fitxers JSON i el tancament de sessió. Només després canviar l’accés públic al domini de l’autenticació.

Les eines de Sites disponibles en aquesta sessió permeten accés amb ChatGPT i llistes de correus de Sites, però no ofereixen una configuració nativa del proveïdor Google. No s’ha substituït la petició per invitacions a ChatGPT.

## Referències oficials

- https://developers.google.com/identity/openid-connect/openid-connect
- https://developers.google.com/identity/protocols/oauth2/web-server
- Consola per gestionar el client: https://console.cloud.google.com/auth/clients

La publicació amb Google continua pendent de disposar de l’allotjament/proveïdor i la seva configuració. No hi ha una URL nova amb Google operatiu.
