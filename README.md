# FMETS2

https://fmets2.vercel.app/

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI v3](https://www.chakra-ui.com/)
- [Vercel](https://vercel.com/) (Hosting)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

GET /api/letters/unprocessed — 未処理のおたよりを古い順に返す

レスポンス: { status: "ok", letters: [...] }
PATCH /api/letters/{id}/process — 指定IDのおたよりを処理済にする