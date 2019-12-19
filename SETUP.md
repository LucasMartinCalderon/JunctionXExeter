# Prerequisites

**Be warned:** this guide was written by someone who uses Macos for development, and while most if not all steps are likely the same even if you are working on Linux or Windows, be aware that some steps might not work exactly the same on your system.

Okay, first of all you'll need to have the following installed on your system:

- Node.js 10.x or higher - [install with Homebrew](https://www.dyclassroom.com/howto-mac/how-to-install-nodejs-and-npm-on-mac-using-homebrew) if using a Mac, or [download the installer for your system](https://nodejs.org/en/download/current/) if not


- MongoDB 3.6.x - [install with Homebrew](https://treehouse.github.io/installation-guides/mac/mongo-mac.html) if using a Mac, or follow the [installation instructions here](https://docs.mongodb.com/manual/installation/)

If you already have these installed, verify they are the correct versions:

```
Juusos-MacBook-Pro:~ juuso$ node -v
v10.7.0
Juusos-MacBook-Pro:~ juuso$ mongod --version
db version v3.6.1
...
```

In case you need to have different versions of node for different project, I would recommend you install [Node Version Manager](https://github.com/creationix/nvm) to be able to use different versions depending on the project directory.

# Setup

### Clone the repository and set it up

First, clone the repository. You'll probably want to rename it from `website-template` to something else - we'll use `awesome-site` in this readme.

First, clone the repository:

```
git clone https://github.com/hackjunction/website-template.git awesome-site
```

Next, let's clear the link to this git repository and create your own git project:

```
cd awesome-site
rm -rf .git
git init
```

Also, the example repository comes packaged with a few uploaded images (for demo purposes) so we've removed the `uploads` folder from `.gitignore`, but you'll want to add that back so your uploads don't get checked into your git repository. 

Edit `backend/.gitignore` and remove the hashtags in front of the two `public/uploads/...` lines

```
############################
# Misc.
############################

*#
ssl
.idea
nbproject
# public/uploads/*
# !public/uploads/.gitkeep

```

### Change the project name

Our project is called `awesome-site` (you can name yours whatever you wish) so let's edit the project name in a few places to reflect that. This is not strictly necessary but would make a lot of sense for you to do as well. 

1) In the root directory package.json, change the project name to describe your project (`awesome-site`)

```
{
  "name": "react-strapi-starter", // Change this to your project name
  "version": "1.0.0",
  "main": "index.js",
  ...
```

2) In `backend/config/environments/development/database.json` edit the `database` field from `react-strapi-starter` to your project name (`awesome-site`)

```
{
  "defaultConnection": "default",
  "connections": {
    "default": {
      "connector": "strapi-hook-mongoose",
      "settings": {
        "client": "mongo",
        "host": "127.0.0.1",
        "port": 27017,
        "database": "react-strapi-starter", // Change this to your project name
        "username": "",
        "password": ""
      },
      "options": {}
    }
  }
}
```

3) In `frontend/app/src/redux/configureStore.js` edit `persistConfig` and change the `key` field from `react-strapi-starter` to your app name (`awesome-site`)

```
const persistConfig = {
	key: 'react-strapi-starter', // Change this to your project name
	storage,
	stateReconciler: autoMergeLevel2,
}
```


### Spin up the project

First, let's install the dependencies for both the backend and frontend.

First of all, make sure you have a local MongoDB server running. In a new terminal window, run `mongod` to start the server. If this fails with a "permission denied" error, you might need to run:

```
sudo mkdir -p /data/db
sudo chown -R $USER /data/db 
mongod
```

Then, in the project root, run: 

```
npm install strapi@alpha -g
npm run setup
```

Once the dependencies are installed, let's start the app in development mode by running (in the root of the project):

```
npm run dev
```

This will spin up the frontend at `localhost:3000` and the backend at `localhost:1337`. Both will automatically reload if any code changes are made. You'll notice that the frontend of the site isn't really showing any content, but we'll fix that in the next steps.

### Log in to the admin panel

Open `localhost:1337/admin` in a browser, and it will prompt you to create your first user. Once you've created your first admin user, let's make a few changes in the admin panel:

- Go to `Roles & Permission`, choose `Public` and under permissions check `find`, `findone` and `count` under all content types - then click Save in the top right corner.

1) Go to Roles & Permission in the sidebar
2) Choose Public
3) Under Permissions, check `find`, `findone` and `count` under all of the content types
4) Click Save in the top right corner

### Import sample content 

Okay, the final step: let's import some sample content so you can see the site in action. You'll find some database dumps in `database-dumps`,let's import those into the database with `mongoimport`. In the following `mongoimport` commands you should note that I am using `awesome-site` as the database name, but change that to whatever you named your database to.

```
cd database-dumps
mongoimport --db awesome-site --collection mediafield --file mediafield.json
mongoimport --db awesome-site --collection textfield --file textfield.json
mongoimport --db awesome-site --collection page --file page.json
mongoimport --db awesome-site --collection upload_file --file upload_file.json
mongoimport --db awesome-site --collection technology --file technology.json
```

If the import was successful, you should now see some content on the site running at `localhost:3000` (make sure to refresh the page). You can now go ahead and delete the `database-dumps` folder from the project. 

### Play around with it 

Editing content in the admin panel is pretty simple, and the example content contains some instructions on how to edit the site. Play around with it a bit and see how it works! :) 

### Setting up Cloudinary

By default any images uploaded to the admin panel will go into `/backend/public/uploads` but you might want to change that to use something like Cloudinary. Cloudinary is an online image hosting service where you can serve any images on your site via their CDN in various formats and sizes depending on where you want to show them. This will dramatically speed up your site and I would recommend setting it up from the get-go.

- Create a [Cloudinary account](https://cloudinary.com/users/register/free) (they have a very generous free tier which will be more than enough for one site)
- Open the Admin panel at `localhost:1337`
- Click Plugins under General in the sidebar
- Click the cog icon next to Files Upload
- Under the development tab, choose Cloudinary from the Providers dropdown, fill in your Cloudinary keys, and Save

Now any images uploaded via the admin panel will go to your Cloudinary account, from where you can serve them in various sizes and formats just by making small edits to the url of the image. The project has [`cloudinary-react`](https://github.com/cloudinary/cloudinary-react) already set up for use, but you should look further into it yourself to learn how to unleash the full power of Cloudinary.

The project also includes the `<Image />` component, which you can use to automatically fetch an image as a given size (thumbnail, full image, etc.) just by supplying it a `width` and `height` prop.

