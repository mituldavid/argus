![argus](https://github.com/mituldavid/argus/assets/49085834/4789626e-d771-4679-b956-4ae014b51a75)

# About

Argus monitors the [Market Mood Index](https://www.tickertape.in/market-mood-index) and notifies you
when the index falls below set thresholds. It also collects the index metrics and stores them in a database for future analysis.

# Getting Started

### Install dependencies

```bash
npm install

```

### Setup [ntfy](https://ntfy.sh)

This application uses ntfy to send push notifications to your phone or desktop.

- Pick a ntfy topic (the topic is essentially a password, so pick something that's not easily
  guessable)
- Subscribe to your ntfy topic (see [here](https://docs.ntfy.sh/#step-1-get-the-app) for
  instructions)

### Configure the application

Create a .env file with the following:

```bash
MONGODB_URI="<your-mongo-db-uri>"
NTFY_URL="https://ntfy.sh"
NTFY_TOPIC="<your-ntfy-topic>"
```

### Build the application

```bash
npm run build

```

### Run the application

```bash
npm start

```
