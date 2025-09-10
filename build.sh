#!/bin/bash
# build.sh

echo "Installing backend dependencies..."
cd backend
pip install poetry
poetry install --only=main

echo "Installing frontend dependencies..."
cd ../frontend
npm install -g pnpm
pnpm install

echo "Building frontend..."
pnpm build

echo "Build complete!"