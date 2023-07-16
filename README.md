# brickhack.io

![Build](https://github.com/BrickHack/brickhack.io/workflows/Build/badge.svg)

The public facing website for BrickHack.

**Registration + management site: [hackathon_manager](https://github.com/codeRIT/hackathon_manager)**

# Getting Started

## Code environment

Ensure you have Git set up and [SSH access to GitHub](https://help.github.com/articles/connecting-to-github-with-ssh/). If you have Git but not SSH, you can clone using the HTTPS url, but you'll have to type in your GitHub credentials every time.

We use [ParcelJS](https://parceljs.org/) and [SASS](https://sass-lang.com/) (the SCSS variant) to build the mostly-static site. Where needed, FontAwesome and possibly React are peppered in.

### Cloning the directory

```bash
$ git clone https://github.com/BrickHack/brickhack.io.git
$ cd brickhack.io
```

### Installing dependencies

```
$ npm install
```

### Running the application

```
$ npm run dev
```

You should then be able to access the site at `localhost:1234`.

### Environment variables

The images in the [gallery](https://brickhack.io/gallery) are hosted on our AWS S3 instance.

GitHub Actions (our CI/CD) uses a repository secret to store the environment variable.

For local development on the gallery:
- Create a `.env` file in the root of the project
- Add `IDENTITY_POOL_ID="key"` to the top, where `key` is the AWS IAM key.

# Development & Deployment

All development work should be done locally in a new branch and/or fork. Then, make a pull request to have the code merged into the develop branch. Once the develop branch gets to a good state, it gets merged into the master branch for a production deployment.

Any PRs sent to Develop will build in Netlify to allow for previews before deploying to the production enviornment which is hosted on Github Pages thru a build process that occurs on Github Actions. Any PR to master will build the page and do final tests before the merge will occur