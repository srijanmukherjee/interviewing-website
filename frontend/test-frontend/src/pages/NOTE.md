Check issue: https://github.com/vercel/next.js/issues/43141

Basically, the pages/ folder is required for the middleware to work, even though we are using app router

Ignore the following warning:

```
- warn Next.js can't recognize the exported `config` field in route "/src/middleware":
Unsupported node type "CallExpression" at "config.matcher".
```
