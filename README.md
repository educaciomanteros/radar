# Top Manta · Radar d’oportunitats

Repositori privat amb el projecte complet a l’arrel: festivals, finançament, matriu de subvencions i universitats.

## Contingut

| Secció | Fitxers |
| --- | --- |
| Portada unificada | `dist/index.html`, `dist/hub.mjs`, `dist/hub.css` |
| Festivals | `dist/festivals/` · 16 fitxes inicials |
| Finançament | `dist/economia/` · 32 línies amb fonts i criteris |
| Matriu de subvencions | `dist/matriu/` · pressupostos, candidatures, cobraments i imputacions |
| Universitats i escoles | `dist/universitats/` · 46 unitats de 45 institucions |
| Proves | `tests/` |
| Funcionament i limitacions | [docs/FUNCIONAMENT.md](docs/FUNCIONAMENT.md) |
| Generació de la base universitària | `tools/build-universities.py` |
| Configuració del web existent | `.openai/hosting.json` |
| Materials de l’actualització parcial del plugin | `plugin-update/` |

La versió vigent és la de l’arrel del repositori. El projecte abans ubicat a `ajuts/` s’ha traslladat aquí. L’historial de Git conserva les versions anteriors. No cal cap compilació per consultar el web: tots els recursos són dins `dist/`.

## Executar el projecte

Amb Python 3, des de l’arrel:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Obre `http://127.0.0.1:8000`. Cal un servidor HTTP; obrir directament els HTML no permet carregar correctament els mòduls i JSON.

Amb Node.js 20 o posterior, comprova la lògica:

```sh
npm test
```

El projecte no necessita dependències externes per executar aquestes proves.

## Accés i dades de gestió

Aquest repositori és privat i l’accés el gestiona GitHub amb comptes autoritzats. No té una contrasenya compartida pròpia. La privacitat del repositori no configura l’accés d’un web publicat: GitHub Pages no s’ha activat amb aquest trasllat.

El codi, les dades base i les fonts són al repositori. Les anotacions, pressupostos i contactes que cada persona hagi introduït al navegador es desen en localStorage: no estan sincronitzats amb GitHub. Exporta una còpia JSON des de cada secció per conservar-los o traslladar-los. No s’han incorporat dades locals que no s’hagin facilitat.

No hi ha publicació automàtica des de GitHub. El web privat existent continua disponible a [Radar de Top Manta](https://top-manta-radar-ajuts-m8q2.stollenart.chatgpt.site). La configuració de Sites es conserva per donar continuïtat a aquest desplegament.

## Verificació documental

Les bases econòmica i universitària tenen les dates de consulta i les limitacions indicades a les seves fitxes. Les oportunitats, els contactes i els terminis necessiten revisió abans d’actuar. La base universitària és una selecció prioritzada internacional, no un cens exhaustiu. Les puntuacions i les propostes són valoracions editorials.

## Accés Google sol·licitat

Llista de dos comptes amb rol de consulta a `access/google-access.json`. **Pendent d’activació**: no és un mecanisme d’autenticació operatiu. Vegeu [requisits i estat real](docs/ACCES_GOOGLE.md). El web continua privat amb l’accés existent fins que Google estigui configurat i verificat.
