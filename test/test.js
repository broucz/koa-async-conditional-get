import request from 'supertest';
import {expect} from 'chai';
import Koa from 'koa';
import eTag from 'koa-async-etag';
import conditionalGet from '../src';

describe('koa-async-conditonal-get', () => {
  it(`should respond with 304 when cache is fresh`, done => {
    const app = new Koa();

    app.use(conditionalGet);
    app.use(eTag);

    app.use(async (ctx, next) => {
      await next();
      ctx.body = {hello: 'world'};
    });

    request(app.listen())
      .get('/')
      .set('If-None-Match', '"11-+8JLzHoXlHWPwTJ/z+va9g"')
      .expect(304, done);
  });
  it(`should do nothing when cache is stale`, done => {
    const app = new Koa();

    app.use(conditionalGet);
    app.use(eTag);

    app.use(async (ctx, next) => {
      await next();
      ctx.body = {hello: 'world'};
    });

    request(app.listen())
      .get('/')
      .set('If-None-Match', '"old_ETag"')
      .expect(200, done);
  });
});
