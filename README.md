# twitchtv-channel-notifier

```bash
npm ci
npm run wt init ## you must have a webtask.io account

cp .env.example .env ## and setup your secrets
```

## Development

```bash
npm run wt:serve
```

## Deploy

To avoid the issue https://github.com/auth0/wt-cli/issues/157 we can't simple run the npm-script `wt:cron` but

```bash
npm run wt:create
```

and now the task is available on your account at webtask.io  
Go to https://webtask.io/make to manually update the Scheduler on GUI. You can use the cron (_an advanced schedule_): [`2 * * * *`](https://crontab.guru/#2_*_*_*_*)
