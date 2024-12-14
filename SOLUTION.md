# E2E Test-Setup

## Pipeline/Workflow

Ich habe keine Trennung nach Build und Test-Job gemacht, da ich mich mit npm genug auskenne um zu wissen welche Dateien (wenn überhaupt) ein Bau-Ergebnis wären.
Der Build-Prozess ist durch einen Buil-Job angedeutet. 
Idealerweise würde dort ein Docker-Image enstehen das wiederum zum testen genutzt werden könnte.

- Tests werden nach Browser parallel ausgeführt
  - weitere Paralelisierung wäre ähnlich über Testcase-Tags möglich
- npm- und pipenv-Daten werden gecached um höhere Ausführungsgeschwindigkeit zu bekommen
- Plawright-Debug-Artefakte werden eingesammelt


## E2E-Test

- befindet sich im Verzeichnis tests_e2e
- tests_e2e/lib/browser.py enthält einige allgemeine Funktionen zum Aufsetzen des Browsers
  - ausgelagert da für mehrere Testcases identisch
- tests_e2e/lib/pages enthält die Daten zur zu Unter-Seiten
  - nur rudimentär angedeutet
  - würde bei mehreren Testcases die Locator-Daten der Elemente und Schablonen für die Texte enthalten
     - hat den Vorteil das bei Änderungen nur eine Stelle für mehrere Testcases geändert werden muss
     - die Informationen sind derzeit direkt im Testcase enthalten


## Einschränkungen

Im E2E-Testcase befindet sich ein fixes sleep von 10 Sekunden vor dem klicken des "Verschieben"-Buttons.
In einer produktiven Umgebung wäre das natürlich inakzeptabel. Man müsste dann das eigentliche Problem beheben.
Der Grund ist das wenn man auf "Verschieben" drückt um den Termin zu verschieben das GET für "http://localhost:3000/api/appointments/appointment-1/available-timeslots" um die alternativen Termine zu laden manchmal mit Connection-Refused beantwortet wird.
Der Grund liegt vermutlich in Neustarts des Entwicklungsservers auf Grund geänderter Dateien.

## Abweichung von Aufgabenstellung

Aus der Aufgabe
> Baue mit Github Actions eine pipeline um das Projekt zu bauen und zu starten und dann die Tests auszuführen, wenn ein Pull Request erstellt wird. (1 Punkt)

Es erschien mir sinnvoll die Pipeline nicht nur beim eröffnen des Pull Requests, sondern auch beim wiederöffnen und wenn weitere Commits hinzugefügt werden (zum Beispiel auf Grund von Code-Review-Kommentaren) auszuführen, da sich der Code ja dann ändert.
Würde man nur beim eröffnen des MR die Pipeline ausführen müsste man, es entsprechend so anspassen:
    pull_request:
      types: [opened]

# Ideales CI/CD für QA

## Abdeckung

### Beim erstellen/modifizieren (neuer Commit) von Pull-Requests
- Ziel schnelles Feedback, Pull-Requests ändern sich ggf. noch ein paar mal, die volle Pipeline durchlaufen zu lassen ist nicht unbedingt sinnvoll
- Subset der E2E-Tests
- Smoke-Tests -> grobes Testen grundlegender Funktionen (Subset Feature-Tests/Integration-Tests)
- eventuell kann anhand von Regeln erkannt werden (Abhängig von Aufbau/Struktur der Software) welche Teile verändert wurden und welche Integrations-Tests Sinn machen


### Beim Mergen in Main
- Alle E2E-Tests
- Integration-Tests/Feature-Tests
- Regression-Tests
- Last-Tests/Performance-Tests
- Scan auf sicherheitslücken /ggf. explizite Sicherheitstests - da se sich um eine öffentlich zugängliche Anwendung handelt
- Scan auf Pakete mit bekannten Sicherheitsproblemen

### Manuelles Ausführen von Tests basierend auf Tags

Möglichkeit einzelne Tests/Sets von Tests gegen einen Branch laufen zu lassen. 
Die Tests könnten in Kategorien per Tags eingeteilt werden (für Teilaspkekte der Software oder/und Testarten) und per Dropdown ausgewählt werden.
Dadurch können Teilaspekte (wo vielleicht Probleme vermutet werden oder wo der Entwickler weiß das er Änderungen vorgenommen hat) vor dem Pull-Request oder dem Merge getestet werden ohne die Notwendigkeit auf den Ablauf der gesamten Pipeline warten zu müssen.

## Eigenes Repository für Tests

Eigenes Repository für die QA-Tests.
Dadurch wird die Wiederverwendbarkeit in verschiedenen Repositories einfach möglich, in dem das QA-Repo beim ausführen von Pipelines per "actions/checkout@v4"-Plugin in Github in ein Unterverzeichnis geladen wird, um dann die Tests auszuführen
Darüber hinaus die Pipelines bei der Test-Erstellung und der Produktentwicklung getrennt werden.
Das ist sinnvoll da ggf. unterschiedliche Sprachen genutzt werden und damit unterschiedliche Tools für Linting, Formatting und ggf. TypeChecking oder auch Build-Prozesse.
Es macht es auch einfacher Unittests für QA-Funktionen zu haben.
Die Trennug erlaubt jeweils eine saubere Git-History für Tests und für die Produktentwicklung.
Und letzten Endes erscheinen die QA-Pull-Requests dann nicht in der gleichen Liste wie die Produktentwicklungs-Pull-Requests - was die Übersicht erleichtert.

## Testing gegen Produktion-Images oder Nutzung produktionsnaher Docker-Images auf den Nodes

Idealerweise erstellt die Build-Prozess ein Docker-Image (oder mehrere) das deployed wird und gegen das die E2E-Tests ausgeführt werden.
Die gleichen Docker-Images werden dann benutzt um in Production deployed zu werden.
Auf diese Weise hat man gegen eine möglichst Produktions-Nahe-Umgebung getestet.

Ist das nicht möglich sollten die Images die auf den Github-Nodes zum Einsatz kommen auf den 
Images für die Production basieren, erweitert um die Dependencies für die Pipeline.

## Alle Dependencies auf den Nodes installiert

Nodes basieren auf Images die möglichst alle Dependencies vorinstalliert haben.
Spart Zeit bei der Ausführung von Pipelines (Dependencies müssen nicht mehr heruntergeladen werden), vereinfacht die Jobs, vermeidet Fehlerquellen (wie zu offen definierte Abhängigkeiten).
Lässt sich das Nachinstallieren nicht vermeiden sollte Caching verwendet werden.

## Tagging

Testcases sollten ein Tagging-System benutzen, so dass einfach einzelne Sets von Testcases ausgeführt werden können.
Möglich wäre auch eine Verzeichnis-Struktur (oder zusätzlich), Verzeichnisse allein sind aber 
auf eine Kategorie beschränkt, was in der Regel nicht ausreichend ist.

Mit Hilfe des Tagging-Systems können einzelne/Gruppen von Testcases lokal (auf dem System des Entwicklers) während der Entwicklung gezielt auf Zwischenergebnisse angewendet werden.
Es ermöglicht des weiteren die Tests in der Pipeline über mehrerer Nodes zu verteilen, in dem jeder Node nur einen Teil der Tags ausführt.

## Verteilung von Tests über mehrere Nodes/Matrix-Tests/Skalierung

Um möglichst schnelle Ergebnisse zu erreichen sollten Tests parallelisiert werden.
Eine Möglichkeit ist für UI-Tests diese abhängig vom Browser oder "Endgerät" zu verteilen, eine weitere
Möglichkeit ist die unterschiedlichen Tests und Kategorien über verschiedene Nodes zu verteilen.

Sollten die Tests immer noch zu lange dauern ist zu überlegen ob Teile der Tests die unwahrscheinlicher sind fehlzuschlagen - zum Beispiel Regression-Tests - erst beim Schließen/Mergen eines Pull-Requests ausgeführt werden, statt beim Öffnen.

