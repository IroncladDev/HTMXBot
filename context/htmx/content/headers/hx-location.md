+++
title = "HX-Location Response Header"
+++

This response header can be used to trigger a client side redirection without reloading the whole page. Instead of changing the page's location it will act like following a [`hx-boost` link](@/attributes/hx-boost.md), creating a new history entry, issuing an ajax request to the value of the header and pushing the path into history.

A sample response would be:

```html
HX-Location: /test
```

Which would push the client to test as if the user had clicked on `<a href="/test" hx-boost="true">`

If you want to redirect to a specific target on the page rather than the default of document.body, you can pass more details along with the event, by using JSON for the value of the header:

```html
HX-Location: {"path":"/test2", "target":"#testdiv"}
```

Path is required and is url to load the response from. The rest of the data mirrors the [`ajax` api](@/api.md#ajax) context, which is:

* `source` - the source element of the request
* `event` - an event that "triggered" the request
* `handler` - a callback that will handle the response HTML
* `target` - the target to swap the response into
* `swap` - how the response will be swapped in relative to the target
* `values` - values to submit with the request
* `headers` - headers to submit with the request
