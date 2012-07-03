# Facebook User Backbone.js Model

**tl;dr** A small wrapper that wraps facebook connect in a backbone.js model

This small lib provides a Backbone model that works with the facebook JavaScript SDK.

It can be used to connect a user via facebook, ask for permissions and retrieve profile information.

The events of the facebook SDK are converted to Backbone events so the model can easily be used with Backbone views.

## Demo

Try it out yourself on the [demo page](https://fabrik42.github.com/facebook-user.js)

## Getting Started Guide

<h3>Dependencies</h3>

* <a href="http://backbonejs.org">Backbone.js</a></li>
* <a href="https://developers.facebook.com/docs/reference/javascript">FB JavaScript SDK</a>

<h3>Make sure you initialized the facebook SDK</h3>
<pre class="prettyprint linenums">
FB.init({
  appId: 'YOUR-FACEBOOK-APP-ID'
})
</pre>

<h3>Create a model</h3>
<pre class="prettyprint linenums">
user = new FacebookUser()
</pre>

<h3>Register to model events</h3>
<pre class="prettyprint linenums">
// callback example:
// callback = function(model, response) {}
user.on('facebook:connected',    callback)
user.on('facebook:disconnected', callback)
user.on('facebook:unauthorized', callback)
</pre>

<h3>Log the user in <small>(opens the facebook popup)</small></h3>
<pre class="prettyprint linenums">
user.login()
</pre>

<h3>Log the user out</h3>
<pre class="prettyprint linenums">
user.logout()
</pre>

<h3>Fetch the facebook profile</h3>
<pre class="prettyprint linenums">
user.fetch()
</pre>

<h3>Check for Login status <small>(e.g. after initialization)</small></h3>
<pre class="prettyprint linenums">
user.updateLoginStatus()
</pre>

### LICENSE:

(The MIT License)

Copyright (c) 2010 Christian Bäuerlein

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.