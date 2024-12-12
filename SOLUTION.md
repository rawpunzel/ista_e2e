# E2E Test-Setup




# Ideales CI/CD für QA

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
