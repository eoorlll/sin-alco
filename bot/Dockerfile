FROM denoland/deno:latest

WORKDIR /app

COPY bot/deno.json ./deno.json
COPY bot/src ./src

# Cache dependencies
RUN deno cache --allow-import src/main.ts

# Launch bot
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--allow-import", "--watch", "src/main.ts"]
