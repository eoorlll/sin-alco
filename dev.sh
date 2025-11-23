#!/bin/bash

echo "Stopping and removing previous containers..."
docker compose down

echo "Building images..."
docker compose build

echo "Starting containers..."
docker compose up -d

echo "Containers started."
echo "Logs:"
docker compose logs -f bot backend