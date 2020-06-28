# twitchtv-channel-notifier

![Run](https://github.com/micalevisk/twitchtv-channel-notifier/workflows/Run/badge.svg?event=schedule)

## Development

```bash
npm ci
cp .env.example .env ## and setup your env. vars
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
