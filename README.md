# OpenReview Web

The next-generation web interface to the [OpenReview API](https://github.com/openreview/openreview/).

## Installation

Clone this repository into a new directory, then from inside that directory run:

```bash
npm install
```

Next set the port that the server will listen on, or add it to your shell configuration:

```bash
export $NEXT_PORT=3030
```

Finally, copy the sample `.env` file and replace the dummy values with the correct values for your environment:

```bash
cp .env.sample .env
```

## Development

To run the development server, run:

```bash
npm run dev
```

This will watch for any changes and rebuild the page.

## Deployment

To create an optimized production build of the application run:

```bash
npm run build
```

To start the production server running execute:

```bash
npm run start
```