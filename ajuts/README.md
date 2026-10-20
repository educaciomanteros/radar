# Top Manta · Radar d’oportunitats

Festivals i finançament en un únic Site privat.

- `/`: visió general i resum del seguiment local.
- `/festivals/`: 16 festivals, fitxes editables, comparació i còpia del pla.
- `/economia/`: 32 línies de finançament, comparació, seguiment i simulador.

Es manté l’origen del Site econòmic i la seva clau de localStorage, per conservar-ne les notes en el mateix navegador. Per traslladar les notes del radar antic de festivals cal exportar-hi la còpia JSON i importar-la a la nova secció de festivals. El Site antic continua accessible. No hi ha sincronització entre dispositius.

El codi de dades i lògica dels dos radars es conserva; només s’adapten navegació i rutes dels recursos. Les dades no s’han revalidat amb aquesta unificació.

Proves: `node tests/model.test.mjs` i `node --test tests/festivals.test.mjs`. També es comproven rutes dels recursos i conservació de dades. Sense revisió visual de navegador en aquesta sessió.

## Fonts i actualització

`dist/data.json` conserva URLs, data de consulta i límits de verificació. No hi ha actualització automàtica ni presentació de sol·licituds. Revalidar bases i quanties abans de presentar. Les dates d’execució futures no impliquen terminis futurs. Les dades internes de Top Manta no s’han verificat.

## Publicació

Projecte de Sites privat declarat a `.openai/hosting.json`. El repositori de Sites és la font de desplegament. La còpia de GitHub és per a revisió i continuïtat del codi; no activa publicacions automàtiques. Mantenir identitat i audiència. No incloure credencials ni anotacions personals.

