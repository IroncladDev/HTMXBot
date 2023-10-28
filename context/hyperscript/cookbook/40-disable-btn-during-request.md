---
title: Disable a Button During an htmx Request
---

If you wish to disable a button during an [htmx](https://htmx.org) request, you can use this snippet:

{% example "Disable button until request finishes" %}
<button
      class="button is-primary"
      hx-get="/example"
      _="on click toggle @disabled until htmx:afterOnLoad">
      Do It
</button>
{% endexample %}
