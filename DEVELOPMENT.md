# Development

This is a general guide to working with the project. You'll mostly be making code changes to the `frontend` directory, but at the end we will also briefly cover some cases where you might need to edit files in `backend`.

## Frontend overview

So the frontend for this app is a React app generated with `create-react-app`, and it has the following folder structure under `src`: (we'll cover each folder in detail below)

- `utils` - general purpose utility functions
- `services` - any API calls the app needs to make are defined here
- `styles` - base styles for the app, as well as Scss variables to use elsewhere. The styles that relate only to a specific component should be defined in a `style.scss` file that lives next to the component
- `pages` - any component that exists at a unique url, such as `HomePage` or `AboutPage`
- `components` - all other components
- `redux` - all Redux related stuff
- `assets` - any static images, icons or fonts used in the app

In addition to this you'll find the following files not normally present in a React app:

- `src/GlobalLifecycle.js` - A component that doesn't render anything but can be used to e.g. dispatch API calls or do other actions that we want to perform when the app first loads
- `src/config.js` - A config object that takes values from your `.env` file and maps them to config options (you shouldn't use `process.env.SOME_VARIABLE` anywhere else in the app)

## Working with components

When creating new components, you should use the following structure: 

1) Is it a page with a unique url (put it in `pages`) or is it a reusable, smaller component (put it in `components`)
2) Under the correct directory, create a new **folder** with the name of the component:

```
-MyComponent
---index.js
---style.scss
```

With this structure you can import this component with `import MyComponent from 'components/MyComponent'` instead of having to write `components/MyComponent/index.js` (it automatically chooses the `index.js` file from the specified directory)

## Styling components

You should use some version of [BEM](https://css-tricks.com/bem-101/) when thinking about classNames for your components. For example, if I were to write a component to display a social media post (a component called `<Post />`), I might do something like this:

```
<div className="Post">
	<h3 className="Post--title">A post</h3>
	<p className="Post--body">Yadayadayada</p>
	<div className="Post--buttons">
		<a className="Post--buttons__facebook">Share on Facebook</a>
		<a className="Post--buttons__linkedin">Share on LinkedIn</a>
	</div>
</div>
```

This keeps your `.scss` code very clean and readable, because you can take advantage of nesting:

```
.Post {

	&--title {

	}

	&--body {

	}

	&--buttons {

		&__facebook {

		}

		&__linkedin {

		}
	}
}
```

If a component has more than two levels of hierarchy, the class names might start getting a bit ugly. This might be a good situation to extract that part of the code to a smaller component, which can be styled in a similar manner. 

The upsides of this BEM approach are:

- Your Scss code looks really nice, logical and readable
- You can clearly see the hierarchy of your elements directly from your .scss
- As long as you don't create several components with the same name (which you shouldn't), your styles have no possible way of leaking elsewhere, as your .scss is all contained within a class name that begins with the component's name
- You don't have to constantly hop between your .scss and .js files when styling, since you can intuitively remember the logical names you gave to your components once you get used to using a system like this.

You can make up your own version of BEM as well, or look up a good one from the internet, it's up to you - your classes don't need to be in the specific format that I like to use (`ComponentName--element__child`).

**Also, one additional note** about .scss: Please don't use element selectors for styling (`h1`, `span`, etc.) - take the time to give a class for each element you want to apply styles to. Element selectors should only be used when you want to apply global styles, such as saying "I want all `<a/>` elements on my site to be red (unless overriden somewhere)"

## Adding a new content type

Let's say you want to add a new content type to the site - for example, FAQ items. These items would have two fields: a question, and an answer to it. 

#### Create the content type in the admin panel

- Go to the admin panel
- Click Content Type Builder in the sidebar
- Click the Add Content Type button

In the following popup, give it a descriptive name - we'll use `FAQ` for this one.

Next, it'll ask you to add some fields. We'll add two fields:

**Question:**

- A String field
- which is required
- which must be unique (we don't want to have two FAQ items with the same question)

You can set it to be required/unique from the Advanced tab.

**Answer:**

- A Text field
- which will also be required

That's all of the fields we want to add, so we can now save the content type with the Save button in the top right.

Once we save the content type, it appears in the sidebar. **Let's click that and create a new FAQ item or two.**

#### Add an API service to fetch the content

Now that we've created the content type and we've added a few items of that type, let's have our frontend fetch that content. 

If you open `backend/api`, you'll see that Strapi has created a new folder there with the name of your content type, in this case `faq`. If you open `faq/config/routes.json`, you'll see all of the API routes that it exposed for the content type:

```
{
  "routes": [
    {
      "method": "GET",
      "path": "/faqs",
      "handler": "Faq.find",
      "config": {
        "policies": []
      }
    },
	...
```

But if we now go to `localhost:1337/faqs`, we'll see this:

```
{
	statusCode: 403,
	error: "Forbidden",
	message: "Forbidden"
}
```

That's because by default, the API endpoint Strapi created isn't publicly accessible. Let's change that by going to Roles & Permission > Public > and checking `find`, `findone` and `count` under your new content type. Remember to click Save after you do this.

Now if we reload `http://localhost:1337/faqs`, we'll see it returns the content we created earlier.

**Okay, let's get the content in our React app**

Create a new file under `frontend/services` - you can call it for example `faqs.js`. It's probably easiest to just copy one of the existing ones, and make a few minor edits to it:

```
/* faqservice.js */

import axios from 'axios'
import config from '../config'
const URL = config.API_BASE_URL + '/faqs'

const FaqService = {

	count: () => {
		return axios.get(`${URL}/count`).then(res => res.data)
	},

	getAll: () => {
		return axios.get(URL).then(res => res.data)
	},

	getOne: (id) => {
		return axios.get(`${URL}/${id}`).then(res => res.data)
	}
}

export default FaqService
```

Now if you want to get the content from the api, all you need to do is use this service in one of your components:

```
import FaqService from '../services/faqs';

FaqService.getAll().then(faqs => {
	console.log('FAQS', faqs);
})
```

#### Storing the data - a brief introduction to Redux

That's cool, but we don't really want to have to call the API endpoint over and over again every time we need the data - a better solution would be to only fetch it once and then store it in the user's browser for later use. We'll use Redux for that. 

Redux can seem somewhat intimidating at first, but it's really rather simple and I'll do my best in explaining how it works. I do encourage you to read into it further by reading a beginner tutorial on Redux if you feel like you don't quite understand how it works, for example [this one](https://www.valentinog.com/blog/redux/).

Anyway, Redux in a nutshell:

- A local "database" which you can put stuff into
- and which you can get stuff out of, where and when you need it 

We call this local "database" the Redux store, and the way we interact with it is:

- Actions, which send things to the store
- Reducers, which receive these packages of data and decide how to save it in the store
- Selectors, which help us get a specific piece of data from the store to our components

#### Storing the data in Redux

Ok, let's store our FAQs in the Redux store. Let's start by creating a new folder under `frontend/src/redux`, which will be named after our content type - so we'll create a folder called `faqs/`. In there, let's create a few files.

**actionTypes.js**
In this file, you should define the types of actions your app is allowed to send to the store.

We'll have a single type of action related to FAQs, which will be called UPDATE_FAQS. An actionType is just a string value, which must be unique across your app, so it's best to name it something like `{name-of-folder}/{name-of-action}`.

```
export const UPDATE_FAQS = 'faqs/UPDATE';
```

This is all you need to add to that file.

**actions.js**

Okay, next up is our Actions. We'll define a single action, which will:

- Fetch the FAQs from the API with the FaqService we created earlier
- Send the data to the redux store

A function in your actions.js should just end up "dispatching" an action to your store. An action object has a `type` which states what kind of action it is, and possibly a `payload` which is some data that it sends with it. If we think of an action like an envelope you send in the mail, the type would be the address of the recipient and the payload would the contents of the envelope (the dispatch function is the mailman :D)

It'll look something like this:

```
import * as ActionTypes from './actionTypes';
import logger from '../../utils/logger';
import FaqService from '../../services/faqs';

export const updateFaqs = () => (dispatch) => {

	FaqService.getAll().then(faqs => {
		dispatch({
			type: ActionTypes.UPDATE_FAQS,
			payload: faqs
		})
	})
}
```

Or this would be how you would typically do it. But, we are using a helpful library called `redux-pack` in this project, which allows us to write some cleaner actions and reducers, so we'll write it like this for now: 

```
import * as ActionTypes from './actionTypes';
import logger from '../../utils/logger';
import FaqService from '../../services/faqs';

export const updateFaqs = () => (dispatch) => {
	dispatch({
		type: ActionTypes.UPDATE_FAQS,
		promise: FaqService.getAll()
	})
}
```

**reducer.js**

Now we need to set up a reducer to receive the actions that we are dispatching to the store. If we continue with the envelope/mail analogy, your reducer would be the post office that receives the letters people send and decides what to do with them (sort of, at least).

Since the purpose of the reducer is to make updates to the Redux store, we'll need to first define what the store should look like before any actions have been received by the reducer. Let's define an `initialState`:

```
/* Import these as well, we'll use them soon */
import * as ActionTypes from './actionTypes';
import { handle } from 'redux-pack';

const initialState = {
	data: [],
	loading: false,
	error: false,
	lastUpdate: 0
};
```

So our `initialState` has `data` which is the FAQ items, `loading` which tells us if we're currently fetching new FAQs, `error` which tells us if something went wrong the last time we tried to fetch new FAQs, and `lastUpdate` which stores the timestamp of when the FAQs were last updated successfully.

Let's add a reducer to handle the incoming actions:

```
const initialState = {
	data: [],
	loading: false,
	error: false,
	lastUpdate: 0
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case ActionTypes.UPDATE_FAQS: {
			/* Do something when we receive an action of type UPDATE_FAQS */
		}
		default: return state
	}
}
```

I recommend to familiarize yourself to the way reducers usually work if you're not familiar with Redux before this, but `redux-pack` allows us to really easily handle the action we dispatched in our `updateFaqs`: 

```
export default function reducer(state = initialState, action) {
	switch (action.type) {
		case ActionTypes.UPDATE_FAQS: {
			return handle(state, action, {
				start: prevState => ({ ...prevState, loading: true, error: false }),
				finish: prevState => ({ ...prevState, loading: false }),
				failure: prevState => ({ ...prevState, error: true }),
				success: prevState => ({ ...prevState, data: action.payload, lastUpdate: Date.now() }),
			}) 
		}
		default: return state
	}
}
``` 

Just briefly how this works: under the hood, `redux-pack` dispatches different variants of the `UPDATE_FAQS` action. One version of it when our FaqService API call starts loading, one when it's finished, one if it fails and one when it succeeds. The `handle` function we imported from `redux-pack` allows us to really nicely handle these different cases.

Essentially a reducer should always just return a new version of the state after it receives an action, not directly mutate the state. Notice the `{...prevState, something: true}` notation - this is called a "spread operator", and essentially says "I want to create a new object with everything that is in prevState, but make these changes to it".

You'll also notice that at the bottom the `default` statement just returns the current state. This means that if the reducer receives an action that it doesn't know how to handle, it'll not make any changes to the state.

Now that we've created our reducer, we'll want to make sure Redux knows it exists. We'll add it to `frontend/src/redux/rootReducer.js`:

```
import { combineReducers } from 'redux'

// Import the reducer from each module here, and add it to the combined reducer
import mediafields from './mediafields/reducer';
import textfields from './textfields/reducer';
import pages from './pages/reducer';
import technologies from './technologies/reducer';
import faqs from './faqs/reducer'; // <- Add this

export default () => combineReducers({
	mediafields,
	textfields,
	pages,
	technologies,
	faqs, // <- And this
});
```

Now our faqs will be stored in Redux under the key `faqs`.

**selectors.js**

Okay, finally, let's define some functions that allow us to retrieve data from the Redux store into our components. 

In this file, let's declare the following:

```
export const faqs = state => state.faqs.data;
export const faqsMeta = state => ({
	loading: state.faqs.loading,
	error: state.faqs.error,
	lastUpdate: state.faqs.lastUpdate
})
```

So this file exports a few functions:

- `faqs`, which just returns whatever FAQs are in the store
- `faqsMeta`, which returns information about if the FAQs are loading or there's been an error, if we're interested in that

So your `frontend/src/redux/faqs` folder should now look like this: 

```
-faqs
---actionTypes.js
---actions.js
---reducer.js
---selectors.js
```

It was a bit of work to set this up, and it might seem a bit overwhelming, but trust me - it will be super helpful. Also, once you've done this a few times it takes literally a few minutes to do it again for another type of data you want to store in Redux.

That's it - now we just need to create a component to use our FAQs! 

#### The FAQList component

Since FAQ's are the type of data that we won't need all over the app, just in the list of FAQs, we'll create a single component - `FAQList` - which handles updating the FAQs and showing them. That way we won't be doing any unnecessary API calls for fetching the FAQs before the user navigates to a page where they are displayed. 

So, let's create the `components/FAQList/` folder, and add a `index.js` (and `style.scss`) file to it. Without any Redux integration, it might look like this: 

```
import React, {Component} from 'react'

class FAQList extends Component {

	render() {

		const { faqs } = this.props 

		return(
			<div className="FAQList">
				{faqs.map(faq => (
					<FAQItem faq={faq} />
				))}
			</div>
		)
	}
}

export default FAQList
```

We can tell the Redux store that we want to use the FAQs we have in the store in this component by `connecting` it to the store:

First, add the following imports:

```
import {connect} from 'react-redux'
import * as FAQSelectors from '../../redux/faqs/selectors';
import * as FAQActions from '../../redux/faqs/actions';
```

Next, let's add two functions to the bottom of the file, just above the export statement: 

```
const mapStateToProps = (state) => ({
	faqs: FAQSelectors.faqs(state),
})

const mapDispatchToProps = (dispatch) => ({
	updateFaqs: () => dispatch(FAQActions.updateFaqs())
})
```

Let's also change the export from: 

```
export default FAQList
```

to: 

```
export default connect(mapStateToProps, mapDispatchToProps)(FAQList)
```

**So what's going on here???**

By making these additions, we've told redux that we want to: 

- Give our FAQList component a `faqs` prop, which should just be the faq items from the Redux store
- Give our FAQList component a `updateFaqs` prop, which essentially calls our updateFaqs action and starts the process of updating the FAQs stored in our Redux store.

The `faqs` prop will be updated with the current data in the store any time it changes, so your FAQList will always have the latest data as a prop.

Now we can have our FAQList component request an update to the FAQs every time it's mounted: 

```
class FAQList extends Component {

	componentDidMount() {
		this.props.updateFaqs()
	}
	...
}
```

If you render this somewhere, you'll see that it now renders the FAQs you add via the admin panel, and makes sure to also keep them updated. 

#### Improving on the Redux implementation

Okay, this isn't yet quite ideal - every time we show the FAQList component it's making an API call to update the FAQs even though it's likely that they haven't changed since the last update. And even if they have, it's probably not such critical information that we need to waste a user's data bandwidth by constantly updating them.

If you look at how the other redux folders are structured, for example `frontend/src/redux/pages`, and open up `actions.js`, you'll see that every time the `updatePages` function is called, it'll check if the pages should be updated or not, and skip the update if not. In the `selectors.js` file, we've declared a selector to essentially determine if an update is necessary. The code should be understandable enough that I don't need to walk you through it - the confusing part might be the use of `createSelector`, and I would urge you to read into the [`reselect`](https://github.com/reduxjs/reselect) library introduction to better understand what it does. 

In any case, even without understanding how `reselect` works, you'll probably be able to implement this same improvement in your faqs actions/selectors
