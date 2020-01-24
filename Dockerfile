FROM node:12-alpine
WORKDIR /auth
COPY --chown=node:node . .
RUN npm ci && \
    npm run build && \
    rm -rf node_modules && \
    npm ci --production --no-optional
USER node
ENV NODE_ENV=production \
    TERM=linux \
    TERMINFO=/etc/terminfo \
    PORT=4000
EXPOSE 4000
HEALTHCHECK --interval=30s \
    --timeout=2s \
    --retries=10 \
    CMD node /auth/scripts/healthcheck.js
CMD ["node", "."]
