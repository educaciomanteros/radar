# Top Manta · Radar d’ajuts

Radar privat en català amb 32 línies de subvencions, beques i finançament potencialment rellevants a Barcelona, Catalunya, Espanya i Europa. Revisió documental 19/10/2026. No és un cens exhaustiu ni una confirmació d’elegibilitat.

## Funcions

- Priorització ponderada (encaix, impacte, capacitat, càrrega), comparació de tres opcions i filtres.
- Fitxes amb font oficial, incerteses, proposta de projecte, requisits, imports i següents accions.
- Seguiment local (responsable, estat, notes, data interna, requisits revisats). No hi ha sincronització entre dispositius.
- CSV amb BOM i protecció contra fórmules; còpia JSON del seguiment i importació validada.
- Simulador de cofinançament i liquiditat amb dades manuals; quatre projectes de partida.
- Només CreixESS i CCAM trasllat tenen termini obert verificat a la data de tall. L’elegibilitat de Top Manta continua condicionada.

## Verificació

Executar `node tests/model.test.mjs`. Verificats integritat de les fitxes, fus horari i venciment, exclusions, pesos, càlculs, exportació i validació de còpies. Comprovació sintàctica de JS i estructura HTML. No s’ha fet comprovació visual de navegador: el skill control-browser no està disponible en aquesta sessió.

## Fonts i actualització

`dist/data.json` conserva URLs, data de consulta i límits de verificació. No hi ha actualització automàtica ni presentació de sol·licituds. Revalidar bases i quanties abans de presentar. Les dates d’execució futures no impliquen terminis futurs. Les dades internes de Top Manta no s’han verificat.

## Publicació

Projecte de Sites privat declarat a `.openai/hosting.json`. El repositori de Sites és la font de desplegament. La còpia de GitHub és per a revisió i continuïtat del codi; no activa publicacions automàtiques. Mantenir identitat i audiència. No incloure credencials ni anotacions personals.
