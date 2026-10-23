# Test design in kurasu

- Automated tests are integration tests only, in the API and the web.
- A manual check is a web test row marked `test + manual`. Claude runs each one with agent-browser against the local stack. Every web branch has at least one. Pick the common cases, common errors included, such as a login with a user who has access and one who does not. Leave rare cases as tests only.
- API branches carry manual checks too: their most common rows, common errors included, marked `test + manual`. Claude runs each one against the local stack with HTTP requests, and checks the response and the state it leaves (the lists it changes, the mails the local binding writes). Leave rare cases as tests only.
- Checks that need production, such as the domain, real mail or hibernation, go in their own tree. Claude and the user run them by hand after the site launches on Cloudflare. They are not part of the design for the first implementation.
