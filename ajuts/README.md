# Top Manta · Radar d’oportunitats

Festivals i finançament en un únic Site privat.

- `/`: visió general i resum del seguiment local.
- `/festivals/`: 16 festivals, fitxes editables, comparació i còpia del pla.
- `/economia/`: 32 línies de finançament, comparació, seguiment i simulador.
- `/matriu/`: candidatures, pressupostos de projectes, despeses, imputacions, cobraments, calendari i avisos.

Es manté l’origen del Site econòmic i la seva clau de localStorage, per conservar-ne les notes en el mateix navegador. Per traslladar les notes del radar antic de festivals cal exportar-hi la còpia JSON i importar-la a la nova secció de festivals. El Site antic continua accessible. No hi ha sincronització entre dispositius.

El codi de dades i lògica dels dos radars es conserva; només s’adapten navegació i rutes dels recursos. Les dades no s’han revalidat amb aquesta unificació.

Proves: `node tests/model.test.mjs` i `node --test tests/festivals.test.mjs`. També es comproven rutes dels recursos i conservació de dades. Sense revisió visual de navegador en aquesta sessió.

## Fonts i actualització

`dist/data.json` conserva URLs, data de consulta i límits de verificació. No hi ha actualització automàtica ni presentació de sol·licituds. Revalidar bases i quanties abans de presentar. Les dates d’execució futures no impliquen terminis futurs. Les dades internes de Top Manta no s’han verificat.

## Publicació

Projecte de Sites privat declarat a `.openai/hosting.json`. El repositori de Sites és la font de desplegament. La còpia de GitHub és per a revisió i continuïtat del codi; no activa publicacions automàtiques. Mantenir identitat i audiència. No incloure credencials ni anotacions personals.


## Matriu de subvencions

Base inicial buida, sense concessions ni pressupostos ficticis. Crea un projecte i partides de despesa; afegeix candidatures pròpies o incorpora subvencions del radar sense copiar imports com si fossin sol·licitats/concedits. Les fitxes del radar enllacen directament amb la matriu.

Imports acumulats: sol·licitat, concedit vigent i cobrat són diferents; previst, real i pagat també. La cobertura del projecte suma subvencions concedides actives, aportació pròpia compromesa i altres ingressos compromesos. Les necessitats es calculen projecte a projecte, perquè l’excedent d’un no amagui el dèficit d’un altre. Els ajuts sense projecte no cobreixen pressupostos. Les candidatures denegades, desistides i descartades no sumen al finançament disponible. Els cobraments ja registrats continuen visibles i es marca la incoherència si escau.

Cada despesa pot repartir-se entre ajuts. Els avisos detecten excés d’imputació prevista o real sobre el cost, sobre el finançament de la candidatura, cobrat superior al concedit, intensitat i topall registrats, dates passades i elegibilitat pendent. No substitueixen la revisió de bases i compatibilitats ni detecten dades o ajuts que no s’hagin registrat.

Còpia completa JSON validada abans de substituir dades locals; quatre CSV (matriu, projectes, despeses, imputacions), en UTF-8 amb BOM, separador punt i coma i protecció de fórmules. La còpia de la matriu és independent de les còpies dels radars. Les dades es desen només en localStorage, sense servidor ni sincronització. El saldo calculat és cobraments registrats menys pagaments, no saldo bancari. Any de gestió, sense distribució automàtica per anualitats. Les beques personals no s’han de registrar com a ingressos de l’entitat.

Verificació: `npm test` inclou 10 proves financeres i d’importació/exportació de la matriu i les proves dels radars. Comprovació de sintaxi, camps i rutes de navegació. Sense prova visual de navegador en aquesta sessió.
