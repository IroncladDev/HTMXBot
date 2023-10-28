# Introduction

This is a book about building applications using hypermedia systems.  _Hypermedia systems_ might seem like a strange phrase:
how is hypermedia a _system_? Isn’t hypermedia just a way to link documents together?

Like with HTML, on the World Wide Web?

What do you mean hypermedia _systems_?

Well, yes, HTML is _a_ hypermedia.  But there is more to the way the web works than just HTML:  HTTP, the Hyper Text
Transfer Protocol, is what transfers HTML from servers to clients, and there are many details and features associated
with it: caching, various headers, response codes, and so forth.

And then, of course, there are _hypermedia servers_, which present _hypermedia APIs_ (yes, _APIs_) to clients over the network.

(((hypermedia client)))
(((web browser)))
And, finally, there is the all-important _hypermedia client_: a software client that understands how to render a _hypermedia
response_ intelligibly to a human, so that a human can interact with the remote system.  The most widely known and used
hypermedia clients are, of course, web browsers.

Web browsers are perhaps the most sophisticated pieces of software we use.  They not only understand HTML, CSS and many
other file formats, but they also provide a JavaScript runtime and programming environment that is so powerful that web
developers can create entire applications in it that are nearly as sophisticated as _thick clients_, that is, native
applications.

This JavaScript runtime is so powerful, in fact, that today many developers ignore the _hypermedia_ features of the
browser, in favor of building their web applications entirely in JavaScript.  Applications built in this manner have come
to be called Single Page Applications (SPAs).  Rather than navigating between pages, these web applications use
JavaScript for updating the user interface directly.  When they communicate with a server, these applications
typically use JSON API calls via AJAX.  And they often update the user interface using a <q>reactive</q> style frontend
JavaScript library.

In these applications HTML becomes a (somewhat awkward) graphical interface description language that is used
because, for historical reasons, that’s what happens to be there, in the browser.

Applications built in this style are not _hypermedia-driven_: they do not take advantage of the underlying hypermedia
system of the web.

To explain what a hypermedia-driven application looks like, and to contrast it with the popular SPA approach of today,
we need to first explore the entire _hypermedia system_ of the web, beyond just discussing HTML.  We need to look at the
_network architecture_ of the web, including how a web server delivers a hypermedia API, and how to effectively
use the hypermedia features available in the hypermedia _client_ (e.g., the browser).

Each of these are important aspects of building an effective hypermedia-driven application, and it is the entire
_hypermedia system_ that comes together to make hypermedia such a powerful architecture.

## What is a Hypermedia System?

((("Fielding, Roy")))
(((REST)))
To understand what a hypermedia system is we’ll first take an in-depth look at _the_ canonical hypermedia system: the
World Wide Web.  Roy Fielding, an engineer who helped create specifications and build the
implementations of many early pieces of the web, gave us the term REpresentational State Transfer, or REST.
In his PhD dissertation he described REST as a _network architecture_, and he contrasted it with earlier approaches to building
distributed software.

(((hypermedia system)))
We define a _hypermedia system_ as a system that adheres to the RESTful network architecture in Fielding’s _original_
sense of this term.

Unfortunately, today, you probably associate the term <q>REST</q> with JSON APIs, since that is where the term is typically
used in industry.  This is a misapplied use of the term REST because JSON is not a _natural_ hypermedia due to the absence of
hypermedia controls. The exchange of hypermedia is an explicit requirement for a system to be considered <q>RESTful.</q>
It is a long story how we got here, using the term REST so incorrectly, and we will go into the details later in this book.
But, for now, if you think REST implies JSON, please try to set that understanding aside while reading this book,
and come to the concept with fresh eyes.

It is important to understand that, in his dissertation, Fielding was describing The World Wide Web as it existed in the
late 1990s.  The web, at that point, was simply web browsers exchanging hypermedia.  That system, with its simple links
and forms, was what Fielding was calling RESTful.

JSON APIs were a decade away from becoming a common tool in web development: REST was about _hypermedia_ and the 1.0
version of the web.

## Hypermedia-Driven Applications

(((HDA)))
(((Hypermedia-Driven Application)))
In this book we are going to take a look at hypermedia as a _system architecture_ and then explore some practical,
_modern_ approaches to building web applications using it.  We will call applications built in this style
_Hypermedia-Driven Applications_, or HDAs, and we contrast them with a popular style in use today, the Single Page
Application.

A Hypermedia-Driven Application is an application built on top of a hypermedia system that respects and utilizes the
hypermedia functionality of that underlying system.

## Goals

The goal of this book is to give you a strong sense of how the RESTful, hypermedia system architecture _differs_ from
other client-server systems, and what the strengths (and weaknesses) of the hypermedia approach are.  Further, we hope
to convince you that the hypermedia architecture is _relevant_ to developers building modern web applications.

We aim to give you the tools to evaluate the requirements for an application and  answer the question:

<q>Could I build this as a Hypermedia-Driven Application?</q>

We hope that for many applications the answer to that question will be <q>Yes!</q>

## Book Layout

The book is broken into three parts:

* An introduction (or re-introduction) to hypermedia, with a particular focus on HTML and HTTP.  We will finish this
  review of core hypermedia concepts by creating a simple <q>Web 1.0</q>-style application, Contact.app, for managing contacts.
* Next we will look at how we can use [htmx](https://htmx.org), a hypermedia-oriented JavaScript library created by the
  authors of this book, to improve Contact.app.  By using htmx, we will be able to achieve a level of interactivity in our
  application that many developers would expect to require a large, sophisticated front end library, such as React.
  Thanks to htmx, we will be able to do this using hypermedia as our system architecture.
* Finally, we will look at a completely different hypermedia system, Hyperview.  Hyperview is a _mobile_ hypermedia system, related to, but distinct from the web and created by one of the authors of this book -- Adam Stepinski.  It supports _mobile specific_ features by providing not only a mobile specific hypermedia, but also a mobile hypermedia client. These novel components, combined with any HTTP server, make it possible to build mobile Hypermedia-Driven Applications.

Note that each section is _somewhat_ independent of the others.  If you already know hypermedia in-depth and how basic Web
1.0 applications function, you may want to skip ahead to the second section on htmx and how to build modern web applications
using hypermedia.  Similarly, if you are well versed in htmx and want to dive into a novel _mobile_ hypermedia,
you can skip ahead to the Hyperview section.

That being said, the book is designed to be read in order and both the htmx and Hyperview sections build on the Web 1.0
application described at the end of the first section.  Furthermore, even if you _are_ well versed in all the concepts
of hypermedia and details of HTML & HTTP, it is likely worth it to at least skim through the first few chapters for
a refresher.

## Hypermedia: A New Generation

Hypermedia isn’t a frequent topic of discussion these days.  Even many older programmers who grew up with the web
in the late 1990s and early 2000s haven’t thought much about these ideas in years.  Many younger web developers have
grown up knowing nothing but Single Page Applications and the frameworks that are used to build them.

In particular, many young web developers began their careers by building React.js applications that interact with a Node server using a
JSON API; they may never have learned about hypermedia as a system at all.

This is a tragedy, and, frankly, a failure on the part of the thought leaders in the web development community to properly
communicate and advocate for the hypermedia approach.

Hypermedia was a great idea!  It still is!

By the end of this book, you will have the tools and the _language_ to put this great idea to work in your own
applications.  And, further, you will be able to bring the ideas and concepts of hypermedia systems
to the broader web development community.

Hypermedia can compete, hypermedia _can win_, hypermedia _has won_ as an architectural choice against the Single
Page Application approach, but _only_ if smart people (like you) learn about it, build with it and then tell the world
about it.

> Remember the message? “The future is not set. There is no fate but what we make for ourselves.”
>
> — Kyle Reese

## HTML Notes: Hypermedia In Practice

Clearly, HTML plays a central role in the story we tell here. At the end of each chapter we will share what we have learned about writing HTML for hypermedia-driven web applications. 

To start, remember that our web applications are not islands. We’re writing HTML not just for a particular application, but also to play along with other members of the web. When we write with the hypermedia _system_ in mind, we’re better able to tap the range of abilities available to the web.

HTML is hypermedia-friendly when it is written for the full range of constituents of the hypermedia system.
It conveys the state of an application to people viewing our sites with a browser, as well as to people listening to screen readers that read sites aloud. It conveys the aims of our sites to search engines that scrape sites programmatically. It also conveys its behavior as clearly as possible to other developers. 
 
No, we can’t fix every problem with good HTML. The mantra that HTML is "accessible by default" is misleading. We would miss out on important opportunities if we shunned other technologies like JavaScript. And we still need to test, a lot, everywhere, to ensure things work as expected. 

But good HTML lets browsers do a _lot_ of work for us.
