# JSON Data APIs & Hypermedia-Driven Applications

So far we have been focusing on using hypermedia to build Hypermedia-Driven Applications.  In doing so we are
following and taking advantage of the native network architecture of the web, and building a RESTful system, in the original sense
of that term.

(((JSON, "Data API")))
However, today, we should acknowledge that many web applications are often _not_ built using this approach.  Instead, they use a
Single Page Application front end library such as React to build their application, and they interact with the server
via a JSON API.  This JSON API almost never uses hypermedia concepts.  Rather JSON APIs tend to be _Data APIs_, that
is, an API that simply returns structured domain data to the client without any hypermedia control information.  The client
itself must know how to interpret the JSON Data: what end points are associated with the data, how certain fields should
be interpreted, and so on.

Now, believe it or not, we _have_ been creating an API for Contact.app.

This may sound confusing to you: an API?  We have just been creating a web application, with handlers that just return HTML.

How is that an API?

It turns out that Contact.app is, indeed, providing an API.  It just happens to be a _hypermedia_ API that a _hypermedia client_,
that is, a browser, understands.  We are building an API for the browser to interact with over HTTP, and, thanks to the
magic of HTML and hypermedia, the browser doesn’t need to know anything about our hypermedia API beyond an entry point
URL: all the actions and display information comes, self-contained, within the HTML responses.

Building RESTful web applications like this is so natural and simple that you might not think of it as an API at all, but
we assure you, it is.

## Hypermedia APIs & JSON Data APIs

So, we have a hypermedia API for Contact.app.  Should we include a Data API for Contact.app as well?

((("Data API")))
Sure!  The existence of a hypermedia API _in no way means_ that you can’t _also_ have a Data API.  In fact, this is a
common situation in traditional web applications: there is the <q>web application</q> that is entered through that entry point
URL, say `https://mywebapp.example.com/`. And there is also a _separate_ JSON API that is accessible through another
URL, perhaps `https://api.mywebapp.example.com/v1`.

This is a perfectly reasonable way to split up the hypermedia interface to your application and the Data API you provide to other, non-hypermedia clients.

Why would you want to include a Data API along with a hypermedia API?  Well, because _non-hypermedia clients_ might also
want to interact with your application as well.

For example:

* Perhaps you have a mobile application that isn’t built using Hyperview.  That application will need to interact with
  your server somehow, and using the existing HTML API would almost certainly be a poor fit!  You want programmatic
  access to your system via a Data API, and JSON is a natural choice for this.
* Perhaps you have an automated script that needs to interact with the system on a regular basis.  For example, maybe we
  have a bulk-import job that runs nightly, and needs to import/sync thousands of contacts.  While it would be possible
  to script this against the HTML API, it would also be annoying: parsing HTML in scripts is error prone and tedious.  It
  would be better to have a simple JSON API for this use case.
* Perhaps there are 3rd party clients who wish to integrate with your system’s data in some way.  Maybe a partner
  wants to synchronize data nightly.  As with the bulk-import example, this isn’t a great use case for an HTML-based API,
  and it would make more sense to provide something more amenable to scripting.

For all of these use cases, a JSON Data API makes sense: in each case the API is not being consumed by a hypermedia client,
so presenting an HTML-based hypermedia API would be inefficient and complicated for the client to deal with.  A simple JSON Data API fits the bill for what we want and, as always, we recommend using the right tool for the job.

**<q>What!?!  You Want Me To Parse HTML!?!</q>**

A confusion we often run into in online discussions when we advocate a hypermedia approach to building web
applications is that people think we mean that they should parse the HTML responses from the server, and then dump the
data into their SPA framework or mobile applications.

This is, of course, silly.

What we mean, instead, is that you should consider using a hypermedia API _with a hypermedia client_, like the browser,
interpreting the hypermedia response itself and presenting it to the user. A hypermedia API can’t simply be welded on
top of an existing SPA approach.  It requires a sophisticated hypermedia client such as the browser to be consumed
effectively.

If you are writing code to tease apart your hypermedia only to then treat as data to feed into a client-side model,
you are probably doing it wrong.

### Differences Between Hypermedia APIs & Data APIs

Let’s accept for a moment that we _are_ going to have a Data API for our application, in addition to our hypermedia API.
At this point, some developers may be wondering: why have both?  Why not have a single API, the JSON Data API, and have
multiple clients use this one API to communicate with it?

Isn’t it redundant to have both types of APIs for our application?

This is a reasonable point: we do advocate having multiple APIs to your web application if necessary and, yes, this may
lead to some redundancy in code.  However, there are distinct advantages to both sorts of APIs and, even more so,
distinct requirements for both sorts of APIs.

By supporting both of these types of APIs separately you can get the strengths of both, while keeping their varying
styles of code and infrastructure needs cleanly split out.

Let’s contrast the needs of JSON APIs with Hypermedia APIs:

| JSON API Needs | Hypermedia API |
| --- | --- |
| It must remain stable over time: you cannot change the API willy-nilly or you risk breaking clients that use the API and expect certain end points to behave in certain ways. | There is no need to remain stable over time: all URLs are discovered via HTML responses, so you can be much more aggressive in changing the shape of a hypermedia API. |
| It must be versioned: related to the first point, when you do make a major change, you need to version the API so that clients that are using the old API continue to work. | Versioning is not an issue, another strength of the hypermedia approach. |
| It should be rate limited: since data APIs are often used by other clients, not just your own internal web application, requests should be rate limited, often by user, in order to avoid a single client overloading the system. | Rate limiting probably isn’t as important beyond the prevention of Distributed Denial of Service (DDoS) attacks. |
| It should be a general API: since the API is for _all_ clients, not just for your web application, you should avoid specialized end points that are driven by your own application needs.  Instead, the API should be general and expressive enough to satisfy as many potential client needs as possible. | The API can be _very specific_ to your application needs: since it is designed only for your particular web application, and since the API is discovered through hypermedia, you can add and remove highly tuned end points for specific features or optimization needs in your application. |
| Authentication for these sorts of API is typically token based, which we will discuss in more detail later. | Authentication is typically managed through a session cookie established by a login page. |

These two different types of APIs have different strengths and needs, so it makes sense to use both. The hypermedia
approach can be used for your web application, allowing you to specialize the API for the <q>shape</q>
of your application.  The Data API approach can be used for other, non-hypermedia clients like mobile, integration
partners, etc.

Note that by splitting these two APIs apart, you reduce the pressure to constantly change a general Data API to address application needs.  Your Data API can focus on remaining stable and reliable, rather than requiring a new version with every added feature.

This is the key advantage of splitting your Data API from your Hypermedia API.

((("REST API")))
.JSON Data APIs vs JSON <q>REST</q> APIs
Unfortunately, today, for historical reasons, what we are calling JSON Data APIs are often referred to as
<q>REST APIs</q> in the industry.  This is ironic, because, by any reasonable reading of Roy Fielding’s work defining what REST
means, the vast majority of JSON APIs are _not_ RESTful.  Not even close.

> I am getting frustrated by the number of people calling any HTTP-based interface a REST API. Today’s example is the
> SocialSite REST API. That is RPC. It screams RPC. There is so much coupling on display that it should be given an X rating.
>
> What needs to be done to make the REST architectural style clear on the notion that hypertext is a constraint? In other
> words, if the engine of application state (and hence the API) is not being driven by hypertext, then it cannot be RESTful
> and cannot be a REST API. Period. Is there some broken manual somewhere that needs to be fixed?
>
> — Roy Fielding

The story of how <q>REST API</q> came to mean <q>JSON APIs</q> in the industry is a long and sordid one, and beyond the
scope of this book.  However, if you are interested, you can refer to an essay by one of the authors of this book entitled "`How Did REST Come To Mean The Opposite of
REST?`" on the [htmx website](https://htmx.org/essays/how-did-rest-come-to-mean-the-opposite-of-rest/).

In this book we use the term <q>Data API</q> to describe these JSON APIs, while acknowledging that many people
in the industry will continue to call them <q>REST APIs</q> for the foreseeable future.

## Adding a JSON Data API To Contact.app

Alright, so how are we going to add a JSON Data API to our application?  One approach, popularized by the Ruby on Rails
web framework, is to use the same URL endpoints as your hypermedia application, but use the HTTP `Accept` header to
determine if the client wants a JSON representation or an HTML representation.  The HTTP `Accept` header allows a client
to specify what sort of  Multipurpose Internet Mail Extensions (MIME) types, that is file types, it wants back from the
server: JSON, HTML, text and so on.

So, if the client wanted a JSON representation of all contacts, they might issue a `GET` request that looks like this:

**A request for a JSON representation of all contacts**

```http
Accept: application/json

GET /contacts
```

If we adopted this pattern then our request handler for `/contacts/` would need to be updated to inspect this header and,
depending on the value, return a JSON rather than HTML representation for the contacts.  Ruby on Rails has support for
this pattern baked into the framework, making it very easy to switch on the requested MIME type.

Unfortunately, our experience with this pattern has not been great, for reasons that should be clear given the
differences we outlined between Data and hypermedia APIs: they have different needs and often take on very different
<q>shapes</q>, and trying to pound them into the same set of URLs ends up creating a lot of tension in the application code.

Given the different needs of the two APIs and our experience managing multiple APIs like this, we think separating the two, and, therefore, breaking the JSON Data API out to its own set of URLs is the right choice.  This will
allow us to evolve the two APIs separately from one another, and give us room to improve each independently, in a manner
consistent with their own individual strengths.

### Picking a Root URL For Our API

Given that we are going to split our JSON Data API routes out from our regular hypermedia routes, where should we place
them?  One important consideration here is that we want to make sure that we can version our API cleanly in some way,
regardless of the pattern we choose.

Looking around, a lot of places use a subdomain for their APIs, something
like `https://api.mywebapp.example.com` and, in fact, often encode versioning in the subdomain: `https://v1.api.mywebapp.example.com`.

While this makes sense for large companies, it seems like a bit of overkill for our modest little Contact.app.  Rather
than using subdomains, which are a pain for local development, we will use sub-paths within the existing application:

* We will use `/api` as the root for our Data API functionality
* We will use `/api/v1` as the entry point for version 1 of our Data API

If and when we decide to bump the API version, we can move to `/api/v2` and so on.

This approach isn’t perfect, of course, but it will work for our simple application and can be adapted to a subdomain
approach or various other methods at a later point, when our Contact.app has taken over the internet and we can afford
a large team of API developers.  :)

### Our First JSON Endpoint: Listing All Contacts

((("Data API", endpoint)))
(((JSON, endpoint)))
Let’s add our first Data API endpoint.  It will handle an HTTP `GET` request to `/api/v1/contacts`, and return
a JSON list of all contacts in the system.  In some ways it will look quite a bit like our initial code for the
hypermedia route `/contacts`: we will load all the contacts from the contacts database and then render some text
as a response.

We are also going to take advantage of a nice feature of Flask: if you simply return an object from a handler, it will
serialize (that is, convert) that object into a JSON response.  This makes it very easy to build simple JSON APIs
in flask!

**A JSON data API to return all contacts**

```python
@app.route("/api/v1/contacts", methods=["GET"]) ①
def json_contacts():
    contacts_set = Contact.all()
    contacts_dicts = [c.__dict__ for c in contacts_set] ②
    return {"contacts": contacts_dicts} ③
```
1. JSON API gets its own path, starting with `/api`.
2. Convert the contacts array into an array of simple dictionary (map) objects.
3. Return a dictionary that contains a `contacts` property of all the contacts.

This Python code might look a little foreign to you if you are not a Python developer, but all we are doing is converting
our contacts into an array of simple name/value pairs and returning that array in an enclosing object as the `contacts`
property.  This object will be serialized into a JSON response automatically by Flask.

With this in place, if we make an HTTP `GET` request to `/api/v1/contacts`, we will see a response that looks something
like this:

**Some sample data from our API**

```json
{
  "contacts": [
    {
      "email": "carson@example.com",
      "errors": {},
      "first": "Carson",
      "id": 2,
      "last": "Gross",
      "phone": "123-456-7890"
    },
    {
      "email": "joe@example2.com",
      "errors": {},
      "first": "",
      "id": 3,
      "last": "",
      "phone": ""
    },
    ...
  ]
}
```

So, you can see, we now have a way to get a relatively simple JSON representation of our contacts via an HTTP request.
Not perfect, but it’s a good start. It’s certainly good enough to write some basic automated
scripts against. For example, you could use this Data API to:

* Move your contacts to another system on a nightly basis
* Back your contacts up to a local file
* Automate an email blast to your contacts

Having this small JSON Data API opens up a lot of automation possibilities that would be messier to achieve with our existing
hypermedia API.

### Adding Contacts

Let’s move on to the next piece of functionality: the ability to add a new contact.  Once again, our code is going
to look similar in some ways to the code that we wrote for our normal web application.  However, here we are also
going to see the JSON API and the hypermedia API for our web application begin to obviously diverge.

In the web application, we needed a separate path, `/contacts/new` to host the HTML form for creating a new contact.  In
the web application we made the decision to issue a `POST` to that same path to keep things consistent.

In the case of the JSON API, there is no such path needed: the JSON API <q>just is</q>: it doesn’t need to provide any
hypermedia representation for creating a new contact.  You simply know where to issue a `POST` to create a contact -- likely through some documentation provided about the API -- and that’s it.

Because of that fact, we can put the <q>create</q> handler on the same path as the <q>list</q> handler: `/api/v1/contacts`, but
have it respond only to HTTP `POST` requests.

The code here is relatively straightforward: populate a new contact with the information from the `POST` request,
attempt to save it, and -- if it is not successful -- show error messages.  Here is the code:

**Adding contacts with our JSON API**

```python
@app.route("/api/v1/contacts", methods=["POST"]) ①
def json_contacts_new():
    c = Contact(None, request.form.get('first_name'), request.form.get('last_name'), request.form.get('phone'),
                request.form.get('email')) ②
    if c.save(): ③
        return c.__dict__
    else:
        return {"errors": c.errors}, 400 ④
```
1. This handler is on the same path as the first one for our JSON API, but handles `POST` requests.
2. We create a new Contact based on values submitted with the request.
3. We attempt to save the contact and, if successful, render it as a JSON object.
4. If the save is not successful, we render an object showing the errors, with a response code of `400 (Bad Request)`.

In some ways this is similar to our `contacts_new()` handler from our web application; we are creating the contact and attempting
to save it. In other ways it is very different:

* There is no redirection happening here on a successful creation, because we are not dealing with a hypermedia client
  like the browser.
* In the case of a bad request, we simply return an error response code, `400 (Bad Request)`.  This is in contrast with
   the web application, where we re-render the form with error messages in it.

These sorts of differences, over time, build up and make the idea of keeping your JSON and hypermedia APIs
on the same set of URLs less and less appealing.

### Viewing Contact Details

Next, let’s make it possible for a JSON API client to download the details for a single contact.  We will naturally use an
HTTP `GET` for this functionality and will follow the convention we established for our regular web application, and
put the path at `/api/v1/contacts/<contact id>`. So, for example, if you want to see the details of the contact with the
id `42`, you would issue an HTTP `GET` to `/api/v1/contacts/42`.

This code is quite simple:

**Getting the details of a contact in JSON**

```python
@app.route("/api/v1/contacts/<contact_id>", methods=["GET"]) ①
def json_contacts_view(contact_id=0):
    contact = Contact.find(contact_id) ②
    return contact.__dict__ ③
```
1. Add a new `GET` route at the path we want to use for viewing contact details
2. Look the contact up via the id passed in through the path
3. Convert the contact to a dictionary, so it can be rendered as JSON response

Nothing too complicated: we look the contact up by the ID provided in the path to the controller.
We then render it as JSON.  You have to appreciate the simplicity of this code!

Next, let’s add updating and deleting a contact as well.

### Updating & Deleting Contacts

As with the create contact API endpoint, because there is no HTML UI to produce for them, we can reuse the
`/api/v1/contacts/<contact id>` path.  We will use the `PUT` HTTP method for updating a contact and the `DELETE`
method for deleting one.

Our update code is going to look nearly identical to the create handler, except that, rather than creating a new contact,
we will look up the contact by ID and update its fields.  In this sense we are just combining the code of the create
handler and the detail view handler.

**Updating a contact with our JSON API**

```python
@app.route("/api/v1/contacts/<contact_id>", methods=["PUT"]) ①
def json_contacts_edit(contact_id):
    c = Contact.find(contact_id) ②
    c.update(request.form['first_name'], request.form['last_name'], request.form['phone'], request.form['email']) ③
    if c.save(): ④
        return c.__dict__
    else:
        return {"errors": c.errors}, 400
```
1. We handle `PUT` requests to the URL for a given contact.
2. Look the contact up via the id passed in through the path.
3. We update the contact’s data from the values included in the request.
4. From here on the logic is identical to the `json_contacts_create()` handler.

Once again, thanks to the built-in functionality in Flask, simple to implement.

Let’s look at deleting a contact now.  This turns out to be even simpler: as with the update handler we are going to
look up the contact by id, and then, well, delete it.  At that point we can return a simple JSON object indicating
success.

**Deleting a contact with our JSON API**

```python
@app.route("/api/v1/contacts/<contact_id>", methods=["DELETE"]) ①
def json_contacts_delete(contact_id=0):
    contact = Contact.find(contact_id)
    contact.delete() ②
    return jsonify({"success": True}) ③
```
1. We handle `DELETE` requests to the URL for a given contact.
2. Look the contact up and invoke the `delete()` method on it.
3. Return a simple JSON object indicating that the contact was successfully deleted.

And, with that, we have our simple little JSON Data API to live alongside our regular web application, nicely separated
out from the main web application, so it can evolve separately as needed.

### Additional Data API Considerations

Now, we would have a lot more to do if we wanted to make this a production ready JSON API. At minimum we would need to add:

* Rate limiting, important for any public-facing Data API to avoid abusive clients.
* An authentication mechanism.  (We don’t have one for our web application either!)
* Support for pagination of our contact data.
* Several small items, such as rendering a proper `404 (Not Found)` response if someone makes
  a request with a contact id that doesn’t exist.

These topics are beyond the scope of this book, but we’d like to focus on one in
particular, authentication, in order to show the difference between our hypermedia and JSON API.  In order to secure
our application we need to add _authentication_, some mechanism for determining who a request is coming from, and
also _authorization_, determining if they have the right to perform the request.

We will set authorization aside for now and consider only authentication.

#### Authentication in web applications

(((authentication)))
In the HTML web application world, authentication has traditionally been done via a login page that asks a user for
their username (often their email) and a password.  This password is then checked against a database of (hashed)
passwords to establish that the user is who they say they are.  If the password is correct, then a _session cookie_
is established, indicating who the user is.  This cookie is then sent with every request that the user makes to
the web application, allowing the application to know which user is making a given request.

**HTTP Cookies**

(((HTTP, cookies)))
HTTP Cookies are kind of a strange feature of HTTP.  In some ways they violate the goal of remaining stateless, a
major component of the RESTful architecture: a server will often use a session cookie as an index into state kept
on the server <q>on the side</q>, such as a cache of the last action performed by the user.

Nonetheless, cookies have proven extremely useful and so people tend not to complain about this aspect of them too much
(We are not sure what our other options would be here!)  An interesting example of pragmatism gone (relatively) right in
web development.

In comparison with the standard web application approach to authentication, a JSON API will typically use some sort of
_token based_ authentication: an authentication token will be established via a mechanism like OAuth, and that authentication
token will then be passed, often as an HTTP Header, with every request that a client makes.

At a high level this is similar to what happens in normal web application authentication: a token is established somehow
and then that token is part of every request.  However, in practice, the mechanics tend to be wildly different:

* Cookies are part of the HTTP specification and can be easily _set_ by an HTTP Server.
* JSON Authentication tokens, in contrast, often require elaborate exchange mechanics like OAuth to be established.

These differing mechanics for establishing authentication are yet another good reason for splitting up our JSON and hypermedia
APIs.

### The "`Shape`" of Our Two APIs

When we were building out our API, we noted that in many cases the JSON API didn’t require as many end points as our
hypermedia API did: we didn’t need a `/contacts/new` handler, for example, to provide a hypermedia representation for
creating contacts.

Another aspect of our hypermedia API to consider was the performance improvement we made: we pulled the total contact count
out to a separate endpoint and implemented the <q>Lazy Load</q> pattern, to improve the perceived performance of our
application.

Now, if we had both our hypermedia and JSON API sharing the same paths, would we want to publish this API as a JSON
endpoint as well?

Maybe, but maybe not.  This was a pretty specific need for our web application, and, absent a request from a user of
our JSON API, it doesn’t make sense to include it for JSON consumers.

And what if, by some miracle, the performance issues with `Contact.count()` that we were addressing with the Lazy Load
pattern goes away?  Well, in our Hypermedia-Driven Application we can simply revert to the old code and include the
count directly in the request to `/contacts`.  We can remove the `contacts/count` endpoint and all the logic associated
with it.  Because of the uniform interface of hypermedia, the system will continue to work just fine.

But what if we had tied our JSON API and hypermedia API together, and published `/contacts/count` as a supported end
point for our JSON API?  In that case we couldn’t simply remove the endpoint: a (non-hypermedia) client might be
relying on it.

Once again you can see the flexibility of the hypermedia approach and why separating your JSON API out from your
hypermedia API lets you take maximum advantage of that flexibility.

### The Model View Controller (MVC) Paradigm

One thing you may have noticed about the handlers for our JSON API is that they are relatively simple and regular.
Most of the hard work of updating data and so forth is done within the contact model itself: the handlers act as simple
connectors that provide a go-between the HTTP requests and the model.

This is the ideal controller of the Model-View-Controller (MVC) paradigm that was so popular in the early web: a controller
should be <q>thin</q>, with the model containing the majority of the logic in the system.

**The Model View Controller pattern**

((("Model-View-Controller (MVC)")))
The Model View Controller design pattern is a classic architectural pattern in software development, and was a major
influence in early web development.  It is no longer emphasized as heavily, as web development has split into frontend
and backend camps, but most web developers are still familiar with the idea.

Traditionally, the MVC pattern mapped into web development like so:

* Model - A collection of <q>domain</q> classes that implement all the logic and rules for the particular domain your application
  is designed for.  The model typically provides <q>resources</q> that are then presented to clients as HTML <q>representations.</q>
* View - Typically views would be some sort of client-side templating system, and would render the aforementioned HTML representation
  for a given Model instance.
* Controller - The controller’s job is to take HTTP requests, convert them into sensible requests to the Model and forward
  those requests on to the appropriate Model objects.  It then passes the HTML representation back to the client as an
  HTTP response.

Thin controllers make it easy to split your JSON and hypermedia APIs out, because all the important logic lives in the domain
model that is shared by both.  This allows you to evolve both separately, while still keeping logic in sync with one
another.

With properly built <q>thin</q> controllers and <q>fat</q> models, keeping two separate APIs both in sync and yet
still evolving separately is not as difficult or as crazy as it might sound.

## HTML Notes: Microformats

[Microformats](https://microformats.org/) is a standard for embedding machine-readable structured data in HTML.
(((Microformats)))
It uses classes to mark certain elements as containing information to be extracted,
with conventions for extracting common properties like name, URL and photo without classes.
By adding these classes into the HTML representation of an object, we allow the properties of the object to be recovered from the HTML. For example, this simple HTML:

```html
<a class="h-card" href="https://john.example">
  <img src="john.jpg" alt=""> John Doe
</a>
```

can be parsed into this JSON-like structure by a microformats parser:

```json
{
  "type": ["h-card"],
  "properties": {
    "name": ["John Doe"],
    "photo": ["john.jpg"],
    "url": ["https://john.example"]
  }
}
```

Using a variety of properties and nested objects, we could mark up every bit of information about a contact, for example, in a machine-readable way.

As explained in the above chapter, trying to use the same mechanism for human and machine interaction is not a good idea.
Your human-facing and machine-facing interfaces may end up being limited by each other.
If you want to expose domain-specific data and actions to users and developers, a JSON API is a great option.

However, microformats are way easier to adopt.
A protocol or standard that requires websites to implement a JSON API has a high technical barrier.
In comparison, any website can be augmented with microformats simply by adding a few classes.
Other HTML-embedded data formats like microdata, Open Graph are similarly easy to adopt.
This makes microformats useful for cross-website (dare we say _web-scale_) systems like the [IndieWeb](https://indieweb.org), which uses it pervasively.
