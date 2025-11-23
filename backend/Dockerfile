FROM denoland/deno:latest

WORKDIR /app

# Backend files
COPY backend/deno.json ./deno.json
COPY backend/src ./src

# Cache dependencies
RUN deno cache src/main.ts

# Launch server
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--watch", "src/main.ts"]
