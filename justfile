default:
    @just --list

install:
    npm ci

dev:
    npm run dev

build:
    npm run build

start:
    npm run start

lint:
    npm run lint

format:
    npm run format

format-check:
    npm run format:check

typecheck:
    npx tsc --noEmit

# Everything CI checks before it builds.
check: lint format-check typecheck

fix:
    npm run format
    npm run lint:fix

clean:
    rm -rf .next tsconfig.tsbuildinfo

# Convert an image (e.g. a Figma PNG export) to webp: just webp in.png public/projects/x/out.webp
webp input output quality="90":
    node -e "require('sharp')('{{ input }}').webp({ quality: {{ quality }} }).toFile('{{ output }}').then((i) => console.log(i.width + 'x' + i.height, Math.round(i.size / 1024) + 'KB'))"
