---
layout: single
title: "machine-learning"
permalink: /machine-learning/
author_profile: true
---

{% assign custom_category = 'ML' %}
{% for post in site.posts  %}
  {% if post.category == custom_category %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}