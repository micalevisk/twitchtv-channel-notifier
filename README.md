# twitchtv-channel-notifier

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
