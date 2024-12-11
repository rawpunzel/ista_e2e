# QA Automation Coding Challenge

Dieses Repository enthält eine Interview-Challenge für die Position des Senior QA Automation Engineers bei Ista Express.

## Die Challenge

Das Ziel dieser Challenge ist es...

1. deinen Ansatz für eine elegante E2E-Testlösung zu sehen
1. deine Vision einer perfekten CI/CD pipeline zu erfahren
1. deine QA-Automatisierungs-Skills zu testen

## Das Problem

Als Ista Express wollen wir unsere UI Tests automatisieren um unseren Entwicklungsprozess zu beschleunigen und die Qualität gleichbleibend zu gewährleisten.
Diese Tests sollen in unseren Entwicklungsprozess (Github flow) integriert werden.

Dieses Repository enthält eine einfache vue/node web App die stellvertretend für unsere UI's getestet werden soll. In dieser Anwendung können Kunden ihre Termine einsehen und verschieben.

## Akzeptanzkriterien

- Ein Nutzer kann seinen Termin einsehen mit den Daten
  - Aufgabe
  - Tag
  - Startzeit
  - Endzeit
  - Techniker
    - Name
    - Alter
    - Geschlecht
- Wenn der Nutzer auf "Termin verschieben" klickt, dann werden ihm 3 neue Optionen angeboten, von denen er sich eine aussuchen kann.
  Nachdem er seine Option ausgewählt hat, wird ihm von da an nur noch dieser Neue Termin angezeigt.

## Anforderungen (Punkte spiegeln die Priorität wieder)

- Entwickle ein E2E Test setup, mit dem die Akzeptanzkriterien abdeckt werden. (4 Punkte)
- Mache dir Gedanken zu deinem idealen CI/CD Konzept in Hinsicht auf die QA Automation und Dokumentiere sie (in Markdown oder ähnlichem).
  Berücksichtige dabei, dass die Tests auch in die Pipelines der Backendservices integriert werden sollten. (4 Punkte)

**Bonus Punkte**

- Baue mit Github Actions eine pipeline um das Projekt zu bauen und zu starten und dann die Tests auszuführen, wenn ein Pull Request erstellt wird. (1 Punkt)
- Berücksichtige, wie das System skaliert, wenn die Anzahl der Tests sich erhöht. (1 Punkt)

## Getting Started

Um mit der Bearbeitung der Challenge anzufangen, **forke das Repo** in deinen persönlichen Bereich.

## Setup

```
npm run setup
```

## Starte die App lokal

Dieses Kommando startet den Client und den Server gleichzeitig. Dafür wird [concurrently](https://github.com/kimmobrunfeldt/concurrently) benutzt.

```
npm run start
```
