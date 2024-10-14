const slowPaths = ['/mint/', '/stake'];

const sitemapConfig = {
  siteUrl: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
  generateRobotsTxt: true, // (optional)
  // ...other options
  // alternateRefs: [
  //  {
  //    href: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/en-US/`,
  //    hreflang: 'en',
  //  },
  //  {
  //    href: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/es-MX/`,
  //    hreflang: 'es',
  //  },
  // ],
  transform: async (config, path) => {
    // custom function to ignore the path
    // if (protectedPaths.find((p) => path.startsWith(p))) {
    //  return null;
    // }

    // only create changefreq along with path
    // returning partial properties will result
    // in generation of XML field with only returned values.
    if (!slowPaths.find(p => path.startsWith(p))) {
      // This returns `path` & `changefreq`.
      // Hence it will result in the generation of XML field
      // with `path` and  `changefreq` properties only.
      return {
        loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
        changefreq: 'hourly',
        priority: 0.1
      };
    }

    // Use default transformation for all other cases
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: 'always',
      priority: 1,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? []
    };
  }
};

export default sitemapConfig;
