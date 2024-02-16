# Releasing

To release a new version of the Action, tag the latest commit of the `main`
branch with the version number:
```shell
git tag vx.y.z
git push origin vx.y.z
```

> [!NOTE]
> The version number should follow semantic versioning conventions, and begin
> with the letter `v` (e.g. `v1.0.13`)

Pushing the tag will trigger the ['Create release' workflow], which will create
a new draft release in the [Releases section] of the repo.

Select the draft release, review and amend (if necessary) the release notes,
then click the "Publish release" button at the bottom of the page.


['Create release' workflow]: https://github.com/crederauk/slack-workflow-summary/actions/workflows/release.yml
[Releases section]: https://github.com/crederauk/slack-workflow-summary/releases
