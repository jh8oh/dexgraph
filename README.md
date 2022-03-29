# Dexgraph

A web app that charts your [MangaDex](https://mangadex.org/) follows. Breaks down your library by most-read genres, themes, authors, etc. Calls the MangaDex API v5. Built in order to familiarize myself with API calls and handling data.

## Stack

- Vue 3
  - VueX
  - Vue Router
- SCSS
- TypeScript
  - Axios
  - vue-chart-3
- Netlify

## Post-Mortem Analysis

- Working with TypeScript was kind of annoying when dealing with network API calls and models for data. Since TypeScript is a static type language, I needed to create models for the responses/data that I would receive from the API. This might not have been too difficult if not for the fact that the models were overly complicated (or so I felt). There were lots of unnecessary nested objects and the relationships between manga, author, artist, and tags was hard to get my head around at first.
- The documentation for the API was lacking as well. When it came to how the API calls were to be made, what API calls they were, and what parameters each API call needed, the documentation was satifyingly rigorous. However, the documents offered little help in terms of reponse models. There was no indications of what a specific error might mean beyond the 400 Bad Request code and a short 1 sentence description. A manga relationship schema might be shown but the type would display "string" with no indication what that string could be when it's actually called.
- There was a bit of an issue during development to do with API calls. I was unsure whether to make multiple small calls to the API or bunch it all up into one big call. Multiple smaller calls allow for smoother loading and ease of handling since I can just call for each relationship, rather than having to sort through the large array of data I would receive for the latter method. However, the API forced me to make less calls, as the API could only handle so many requests and my calls were being seen as DDOS attack (whoops). So, now the site loading bar loads in chunks.
- Currently, VueX stores the Manga list in local storage so that the user doesn't have to load the entire library again after a refresh. This was more for my benefit since I didn't want to have to sit through the API calls every time I made a change and needed to refresh the site. However, I may need to make this more efficient as it currently store information that can be calculated instead of stored.
