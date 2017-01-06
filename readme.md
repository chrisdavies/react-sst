# React-SST

React-SST is the react bindings for [sst](https://github.com/chrisdavies/sst).

[![Build Status](https://travis-ci.org/chrisdavies/react-sst.svg?branch=master)](https://travis-ci.org/chrisdavies/react-sst)

## Installation

`npm install react-sst`

## Getting started

First, you should read the [documetation for sst](https://github.com/chrisdavies/sst).

## Provider

React-sst follows a similar pattern to `react-redux` if you are familiar with that.

The `Provider` component is a React component that belongs at the root of your application. There
can be only one. This provides the sst store to any components in your app which require access
to the global state or any of its transforms.

The first thing you need to do is initialize your sst store. Again, see [sst](https://github.com/chrisdavies/sst)
for more information on how to do that. Then, in your root component, initialize the `react-sst` Provider:

```js
import {render} from 'react-dom';
import {Provider} from 'react-sst';
import MyAwesomeApp from './my-awesome-app';

// Assuming that sst has been called and `store` is the resulting variable name

render(
  <Provider store={store}>
    <MyAwesomeApp />
  </Provider>,
  document.querySelector('main')
);
```

## Connect

Once you've set up your provider, you are ready to connect your application to the global state.
Here's an example:

```js
// current-user.js
import React from 'react';
import {connect} from 'react-sst';

export default connect(function ({$transform, $selector, $state}) {
  const {currentUser} = $state;
  const {logout} = $transform.currentUser;
  const firstName = $selector.currentUser.$firstName();

  return (
    <nav className="current-user">
      <a href={`/profile/${currentUser.id}`>
        {firstName} {currentUser.email}
      </a>
      <button onClick={logout}>
        Logout
      </button>
    </nav>
  );
});
```

The `connect` function has passed in `$transform, $selector, $state` as props.

- $state - the global state
- $transform - the sst $transform object
- $selector - the sst $selector object

Connect is smart enough not to update your component unless its props change. If some
global state other than `currentUser` changes, the example component will not rerender.
However, if global state's `currentUser` changes, the example component will rerender.

If you would like to do complex mapping of state to your component, e.g. performing some
expensive computation which you'd like to memoize, you can do this with `reselect`. You can
define a `mapStateToProps` function and pass it as the first argument to `connect`.

Here's an example:

```js
// current-user.js
import React from 'react';
import {connect} from 'react-sst';

// Maybe our user hasn't input their name, so we'll use the email prefix in that case
const mapStateToProps = ({currentUser}) => ({
  name: currentUser.name || currentUser.email.split('@')[0]
});

export default connect(function ({$transform, $state, name}) {
  const {currentUser} = $state;
  const {logout} = $transform.currentUser;

  return (
    <nav className="current-user">
      <a href={`/profile/${currentUser.id}`>
        {name} {currentUser.email}
      </a>
      <button onClick={logout}>
        Logout
      </button>
    </nav>
  );
});
```


## License MIT

Copyright (c) 2017 Chris Davies

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.