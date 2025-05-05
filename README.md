# touch-bistro-challenge-app

## Code challenge questions:

1. yes I have production experience with Node, ~8yrs
2. yes I have production experience with React, ~8yrs
3. Benjamin Vincent

share w/ https://github.com/ohsabry

## Explanation

This app is divided into `express-backend` and `react-frontend` directories. Each is it's own packaging and deployment (which is nothing because this is a demo).

The app lets users "login" and take all the available tests, and answer each available question at most 3 times. To see the seeded data (ie the correct answers) see [questions.json](./express-backend/scripts/fixtures/questions.json)

The work for the app is divided up according to the 3 tickets outlined in the [docs](./docs/) folder.

Each commit has the format `{type}({id})?: {description}` where the type is either `feat` or `chore` and if it's a feat, it has the ticket id as it's id.

EG: `feat(#002): add cheats module` vs `chore: implement formatting`

## Development

> frontend

development: `make dev`
tests: `make cypress` -> then click the e2e tests, and then run each spec accordingly (these are UI tests only, so you don't need the backend running)

> backend

1st time: `make services`, `make seed` (in other terminal)
development: `make services`, `make dev` (in other terminal)
tests: `make tests` (don't need the db running)
