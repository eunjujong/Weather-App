# Weather App

## Description
This application fetches weather data from the National Weather Service API, stores it in a Redis cache, and displays the weather data. It includes functionality to periodically fetch and cache the weather data.

## Features
- Fetch weather data from the National Weather Service API.
- Store weather data in a Redis cache.
- Display weather data from the cache.
- Periodically refresh weather data.

## Setup Instructions

### Prerequisites
- Node.js (>=14.x)
- Docker (for running Redis in a container)

### Installation

1. Find the working directory
```sh
cd weather-app
```

2. Install dependencies
```sh
npm install
```

3. Start Redis using Docker
```sh
docker run --name redis-container -p 6379:6379 -d redis
```

4. Build and run the project
```sh
npm run build
npm start
```

5. Run tests
```sh
npm test
```

6. Build the Docker image
```sh
docker build -t weather-app .
```

7. Run the Docker container
```sh
docker run --name weather-app -p 3000:3000 -d weather-app
```
