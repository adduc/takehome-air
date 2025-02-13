# Use an LTS image to ensure long term support for security updates
# (critical since image and video processing has a long history of
# security issues)

FROM ubuntu:24.04 AS builder

RUN apt-get update \
 && apt-get install -y curl \
 && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

RUN apt-get update \
 && apt-get install -y ffmpeg nodejs \
 && rm -rf /var/lib/apt/lists/*

# Set the working directory for subsequent commands
WORKDIR /app

# Copy the package.json and package-lock.json files
#
# This is being done to take advantage of Docker's build cache, where
# the `npm install` command will only be re-run if the package.json or
# package-lock.json files have changed.

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Prune the dev dependencies
RUN npm prune --production

# NPM install may necessitate pulling in a lot of dependencies, so we'll
# use a second stage to install only the dependencies needed to run the
# app.
FROM ubuntu:24.04

RUN apt-get update \
 && apt-get install -y curl \
 && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

RUN apt-get update \
 && apt-get install -y ffmpeg nodejs \
 && rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code
COPY . /app

COPY --from=builder /app/node_modules /app
COPY --from=builder /app/dist /app/dist

# Expose the port the app runs on
EXPOSE 8000

# Set the working directory for subsequent commands
WORKDIR /app

# On start, run the app
CMD [ "node", "dist/index.js" ]
