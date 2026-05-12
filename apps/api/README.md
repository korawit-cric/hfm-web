# HFM API

NestJS application for the **hfm-web** monorepo.

## Getting Started

From the repo root:

```bash
npm run dev --filter=hfm-api
```

By default the server listens on **`API_PORT`** (see root `.env`), commonly [http://localhost:3001](http://localhost:3001). Use [Insomnia](https://insomnia.rest/), [Postman](https://www.postman.com/), or the Swagger UI at **`/api`** to explore endpoints.

You can start editing the demo **APIs** by modifying [links.service.ts](./src/links/links.service.ts).

### Important Note

If you plan to `build` or `test` the app, build `packages/*` first.

## Learn More

- [NestJS documentation](https://docs.nestjs.com)
- [NestJS courses](https://courses.nestjs.com)
- [NestJS on GitHub](https://github.com/nestjs/nest)
