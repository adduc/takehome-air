# Use an LTS image to ensure long term support for security updates
# (critical since image and video processing has a long history of
# security issues)

FROM ubuntu:24.04

# Install ffmpeg, node, and npm
RUN apt-get update \
 && apt-get install -y ffmpeg nodejs npm \
 && rm -rf /var/lib/apt/lists/*

# Set the working directory for subsequent commands
WORKDIR /app

# Expose the port the app runs on
EXPOSE 8000

# On start, install dependencies and run the app
CMD [ "bash", "-c", "npm install && npm start" ]
