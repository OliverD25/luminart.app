export default {
  fetch(request, env) {
    const target = new URL(env.TARGET);
    if (env.KEEP_PATH === 'true') {
      const { pathname, search } = new URL(request.url);
      target.pathname = pathname;
      target.search = search;
    }
    return Response.redirect(target, Number(env.STATUS || 302));
  },
};
