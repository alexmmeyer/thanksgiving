# Product Spec

## Overview

I'm helping plan the biannual McAfee-Sandefur Thanskgiving family reunion this year, which is on Cape San Blas in Port St. Joe, FL. We typically have about 80 people gather for a few days. There's usually a "main house" where the event's primary planners stay and host the big thanksgiving potluck-style dinner, and then other families or family groups rent other houses nearby.

I want to create a microsite that serves as a one-stop-shop for the transfer of information in two directions:
  - **Planners to Attendees:** communicate details about where everyone is staying, the agenda for the weekend, and what's on the dinner menu.
  - **Attendees to Planners:** collect arrival/departure dates, what they're bringing to the thanksgiving potluck, and rsvp responses to specific events.

The site should be interactive and be able to perform basic CRUD data operations and hold state, since multiple people will be adding stuff from different devices. Ideally no sql database required. Some surfaces should be editable by anyone. Others should require a password so only planners can edit.

I will host the site on my vercel.

## Requirements

### Layout & Navigation

The site should be very simple and easy to navigate - we have some old folks who aren't very technically savvy attending. I'm thinking a very simple landing page with links to a other pages and a persitent nav bar - a pretty flat structure. Design for mobile-first. Almost everyone will be viewing it on their phone.

### Locations

- See `locations.md` for a list of where everyone is staying - i'll probably add to this.
- The site should present all of these locations on a map, and zoom in as much as possible where all are within the viewport, and the label should indicate which family is staying there.
- Planners can add, edit, remove locations.
- nice-to-have: Each pin on the map should have a "go" button which opens driving directions from current location to that pin in the user's google maps or apple maps native app. on desktop i guess it would just open a google maps browser. I have a google places API key if you need it.

### Food

At least for the thanksgiving meal, everyone should add an entry to the page for what their bringing.

- button to add an item >> opens submission form
- item submission form inputs:
  - "Dish name": text input
  - "who's bringing it?": 
  - "Category": radio button (app | salad | main | dessert | other)
  - "Label": multi select from gluten-free, dairy-free, vegan, vegetarian, paleo
- show one tab per category on the page (like restaurant menu applications). Tab should show, in parentheses, how many items there are in that category.
- in each tab, list the items in that category as a tile on the screen
- i'd like for item submitters to be able to edit/delete their own items but not others', but not sure if there's a reliable way to do that without auth. maybe cookies?
- password-authed planners can edit/delete anything

### RSVPs

- page shows one tile per event that requires rsvps
- tapping an event tile takes you to another page showing the attendee list (people who have already RSVP'd) with a "Yes" section and a "No" section.
- the event-specific RSVP page:
    - event details at top of page
    - button to rsvp >> open rsvp modal
    - rsvp modal:
      - name/party
      - number of people
      - yes/no/maybe

### Events

see `McAfee_Sandefur_Thanksgiving_2026_Agenda.pdf` - use this as starter data. Build a page where password-authed planners can add/edit/delete from a browswer without a redeploy.
