#!/bin/bash

echo "Stopping and removing previous containers..."
docker compose down

echo "Building images..."
docker compose build --no-cache

echo "Starting containers..."
docker compose up -d