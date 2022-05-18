# twitchtv-channel-notifier

[![Maintainability](https://api.codeclimate.com/v1/badges/740f3ecc1a5fad613461/maintainability)](https://codeclimate.com/github/micalevisk/twitchtv-channel-notifier/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/740f3ecc1a5fad613461/test_coverage)](https://codeclimate.com/github/micalevisk/twitchtv-channel-notifier/test_coverage)

![Run](https://github.com/micalevisk/twitchtv-channel-notifier/workflows/Run/badge.svg?event=schedule)

## Usage

```bash
npm ci --prod
cp .env.example .env ## and set up your env. vars
cp storage.json.example storage.json
node . storage
```

## Development

```bash
npm i

npm t ## all tests must be passing
# npm dev:tests ## when writing tests files

cp .env.example .env ## and set up your env. vars
cp storage.json.example storage.json

npm run dev
```

## Deploy

Put the values of your `.env` file as secrets in **Settings > Secrets**  
and enable GitHub Actions feature under **Settings > Actions**

### To upload your repo secrets with `.env` file content

```bash
## generate this value here: https://github.com/settings/tokens/new?scopes=repo,admin:public_key&description=ttv-channel-notifier
GH_PERSONAL_ACCESS_TOKEN=
## your repo name
REPO=micalevisk/twitchtv-channel-notifier

npm run update-repo-secrets --repo="$REPO" --PAT="$GH_PERSONAL_ACCESS_TOKEN"
```
