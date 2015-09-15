hubot-changelog
====

It shows the release note for the latest, or given release or range of releases.


# Commands

* `hubot changelog`: shows the release note of the latest release in default user's default repo
* `hubot ch`: shortcut for hubot changelog, you can use it everywhere
* `hubot changelog in jquery`: shows the release note of latest release in default user's jquery repo
* `hubot changelog in johnsmith/jquery`: shows the release notes of the latest release in user named johnsmith's jquery repository
* `hubot changelog v2.3.4`: shows the release note of release v2.3.4 in default user's default repo (you can use 2.3.4 and v2.3.4 as well)
* `hubot changelog 2.3.4 in jquery`: shows the release note of release v2.3.4 in default user's jquery repo
* `hubot changelog v2.3.4 in johnsmith/jquery`: shows the release note of release v2.3.4 in johnsmith's jquery repo
* `hubot changelog v2.3.4...v2.3.9`: shows the release notes between v2.3.4 and v2.3.9 using semver (>=2.3.4 <=2.3.9) in default user's default repo
* `hubot changelog v2.3.4...v2.3.9 in jquery`: shows the release notes between v2.3.4 and v2.3.9 using semver (>=2.3.4 <=2.3.9) in default user's jquery repo
* `hubot changelog v2.3.4...v2.3.9 in johnsmith/jquery`: shows the release notes between v2.3.4 and v2.3.9 using semver (>=2.3.4 <=2.3.9) in johnsmith's jquery repo
* `hubot changelog on yesterday`: shows the release notes for release which were released yesterday in default user's default repo, you can use relative date (today, last wednesday) or exact date`: 2015-09-15 or 2015.09.15
* `hubot changelog on yesterday in jquery`: shows the release notes for release which were released yesterday in default user's jquery repo
* `hubot changelog on yesterday in johnsmith/jquery`: shows the release notes for release which were released yesterday in johnsmith's jquery repo
* `hubot changelog since yesterday`: shows the release notes for release which were released since yesterday in default user's default repo, you can use relative date (today, last wednesday) or exact date`: 2015-09-15 or 2015.09.15
* `hubot changelog since yesterday in jquery`: shows the release notes for release which were released since yesterday in default user's jquery repo
* `hubot changelog since yesterday in johnsmith/jquery`: shows the release notes for release which were released since yesterday in johnsmith's jquery repo

# Environment variables

All variables are optional.

* `HUBOT_CHANGELOG_GITHUB_TOKEN`: GitHub token to be used for querying github api, for private projects you need to set it.
* `HUBOT_CHANGELOG_GITHUB_USER`: Default user
* `HUBOT_CHANGELOG_GITHUB_REPO`: Default repo
* `HUBOT_CHANGELOG_SLACK`: If you enable this, the plugin wont output plain text rather it'll use [slack's attachment api](https://api.slack.com/docs/attachments)

# Installing

```
npm i --save hubot-changelog
```

Add `hubot-changelog` to `external-scripts.json` in hubot's directory, for more help check hubot's readme: https://github.com/github/hubot/blob/master/docs/scripting.md#script-loading
# License

MIT
