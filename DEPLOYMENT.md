# Deployment
This guide will cover how to deploy the site on Digitalocean. The end result will be

- A single, self-contained Digitalocean Dokku-droplet
- With two separate apps for the client and cms, and a database
- Which you can deploy with a simple `git push`, similar to services like Heroku
- With a pricetag of $10/mo

The frontend will be set up to run at subdomain.domain.tld (www.mydomain.com), and the backend at cms.subdomain.domain.tld (cms.www.mydomain.com). For us this has made a lot of sense, but feel free to customize your setup process if you want to have a different kind of setup.

Okay, let's get started

### Setting up your Droplet

1) Create a Digitalocean account (verify email, add credit card, etc.)
2) Create a new Project on your account
2) In your project, create a new Droplet with the pre-configured Dokku image (Create new Droplet > Marketplace > Dokku > Configure Dokku Droplet). As of writing this, the exact name is Dokku 0.14.6 on 18.04, but just choose the latest version.

You will be shown a configuration screen with various options, where you should choose:

- **Standard** under Choose a plan
- Choose the $10/mo plan for the Droplet ($5/mo should do as well, if you are on a tight budget)
- Choose a datacenter region nearest to you (the default is usually fine)
- Under Select additional options, just tick them all except for User data (they're free, so why not)
- If you don't yet have an SSH key added on your Digitalocean account, click New SSH Key and add one. Instructions for creating an SSH key [here](https://help.github.com/en/enterprise/2.14/user/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent). Once you've added your key to Digitalocean, remember to tick the box next to your SSH key. 

Finally, set the hostname to something to something you'll recognise (by default it will be something like dokku-s-1vcpu-2gb-fra1-01), and select the project you created earlier, then click Create.

Now you'll need to wait a few minutes for the server to spin up, but once that's done we can move on to configuring the server.

### Configuring the server

Under your project, you should now see your droplet and be able to copy the IP address of the droplet. Copy and paste that into a browser window, and you should be presented with a Dokku setup screen. If the page errors out (502 Bad Gateway etc.), the server has not yet completed it's internal setup processes and you should just wait a minute or two. 

On the Dokku setup page:

- Make sure the SSH key displayed is your SSH key
- Check `use virtualhost naming for apps`
- Click Finish Setup

Now you'll want to SSH into your server, so open up a command line and type:

```
ssh root@<your-droplet-ip>
```

The server will have the dokku command line tool pre-installed, so we'll create two apps with the `dokku apps:create` command. In order for this setup to work, you should create two apps with these exact names:

```
dokku apps:create 00-frontend
dokku apps:create 01-backend
```

I won't go into detail why you should call your apps this, but it has to do with making it easier to setup the domain in the way I outlined above (your client app should be first alphabetically).

Next, if you're using a `.env` file for managing environment variables, you'll want to set
those up on the server. If you're using this template, you'll want to make sure all variables defined in `frontend/.env` are also defined on the server. You can add environment variables with the following command:

```
dokku config:set app-name SOME_ENV_VARIABLE=value-of-the-variable
```

Last, we'll install the `dokku-monorepo` plugin on our droplet to be able to deploy multiple different apps from a single repository easily:

```
dokku plugin:install https://gitlab.com/notpushkin/dokku-monorepo
```

### Create a MongoDB database

Let's install the `dokku-mongo` plugin on your droplet so that we can setup a new MongoDB database for our Strapi app. Follow the install instructions [here](https://github.com/dokku/dokku-mongo), and then run:

```
dokku mongo:create cms
dokku mongo:link cms 01-backend
```

Next, run `dokku config:get 01-backend MONGO_URL` to verify that the database was correctly linked. On your local machine, in the project directory, open `backend/config/environments/production/database.json` and verify that it looks like this:

```
{
  "defaultConnection": "default",
  "connections": {
    "default": {
      "connector": "strapi-hook-mongoose",
      "settings": {
        "client": "mongo",
        "uri": "${process.env.MONGO_URL}",
        "host": "",
        "port": "",
        "database": "",
        "username": "",
        "password": ""
      },
      "options": {}
    }
  }
}

```


### Configuring your app for production

You'll want to have a `Procfile` in the root of your project that tells Dokku how to run your app. This project already has one set up, but just to make sure you should have the following files: 

```
# In frontend/Procfile
web: npm start

# In backend/Procfile
web: npm start
``` 

In addition you should have an `app.json` under both `backend` and `frontend`, with the following contents: 

```
{
	"name": "<name in package.json>",
	"repository": "<url of your repository>",
	"buildpacks": [
		{
			"url": "https://github.com/heroku/heroku-buildpack-nodejs"
		}
	],
	"env": {
		"NPM_CONFIG_PRODUCTION": true
	}
}
``` 

Make sure to substitute the `name` and `repository` fields with the correct values.

You'll also need to make sure that the React app gets built whenever the app is deployed, so go ahead and make sure you have a `heroku-postbuild` script in `frontend/package.json`:

```
/* package.json */
"scripts": {
	
	...other scripts here...

	"heroku-postbuild": "cd app && npm install && npm install --only=dev --no-shrinkwrap && npm run build",
}
```

Finally, make sure you have a `.dokku-monorepo` file at the root of your repository, which tells Dokku the paths from which to build our various apps. For this app setup and naming, ours will look like this:

```
00-frontend=frontend
01-backend=backend
```

If you are setting your apps up in a different way, feel free to read into the [dokku-monorepo docs](https://github.com/notpushkin/dokku-monorepo) for more info.

Alright, that's it - we are now ready to deploy the app to our Droplet!

### Set up git remotes for deployment

To deploy updates to the app, you'll push your code to a git remote exposed by Dokku. Make sure you are now in your project directory on your local machine, and add two new remotes with the following commands: 

```
git remote add dokku-frontend dokku@<ip-of-your-droplet>:00-frontend
git remote add dokku-backend dokku@<ip-of-your-droplet>:01-backend
```

Make sure to substitute your Droplet IP in the commands before running them!

### Your first deployment

If all is working, you should now be able to deploy your app (backend & frontend respectively) by running:

```
git push dokku-backend master
git push dokku-frontend master
```

You'll see the build progress in your terminal window. Wait a few minutes for it to finish, and once it's done it will print something like this:

```
...
-----> Setting config vars
       DOKKU_APP_RESTORE:  1
=====> Renaming container (52447e06b16c) laughing_chaum to test-app.web.1
=====> Application deployed:
       http://dokku-s-1vcpu-2gb-fra1-01:16178
```

Now, if you visit the IP of your droplet in a browser, you should see that your site is indeed live. Congrats!

### Setting up domains

Let's make it so that users can access your site via an actual domain instead of just the IP,and make sure it works over HTTPS as well. 

To make your app accessible under an actual domain, first tell Dokku which domains you want to use with the app. SSH into the droplet, and run (with your preferred domain):

```
dokku domains:add app-name awesomeapp.hackjunction.com
```

Next, you'll need to set up an A record in the DNS settings for your domain. In the previous example, the correct A record would be:

- Type: A Record
- Host: awesomeapp
- Value: IP of your droplet
- TTL: Automatic

If you don't own the domain (for example, you want to use a subdomain of hackjunction.com), contact the owner of the domain and ask them to add the above DNS record.

Once you've done those two things (added the domain to Dokku, and created the DNS record), it'll take up to a few hours for the changes to take effect. If everything is working correctly, you should see your site when visiting the domain you set up for it. 

### Configuring SSL

It's 2019, and you **need** to have SSL enabled for your site or otherwise Google and other search engines (and not to mention browsers) will flag it as dangerous. It's also just a very good idea in general. Luckily it takes literally a minute or two to set up using `dokku-letsencrypt`. There's no point for me to rewrite their excellent guide, so please see here for instructions: https://github.com/dokku/dokku-letsencrypt

If you're too lazy to check it out, ssh into your droplet and run these (make sure to substitute your app name and email in the second and third steps):

```
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku config:set --no-restart myapp DOKKU_LETSENCRYPT_EMAIL=your@email.tld
dokku letsencrypt myapp
dokku letsencrypt:cron-job --add
```

Now, visit the domain of your app and you should see that it automatically redirects all traffic to the https version of your site. In addition, it will automatically renew your SSL certificate for you whenever needed.




