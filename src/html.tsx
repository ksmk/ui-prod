/* tslint:disable no-var-requires */
/* tslint:disable no-console */

import * as React from 'react';
import Helmet from 'react-helmet';

const config = require('../gatsby-config.js');

interface HtmlProps {
  body: any;
  postBodyComponents: any;
  headComponents: any;
}

export default (props: HtmlProps) => {
  const head = Helmet.rewind();

  const verification =
    config.siteMetadata && config.siteMetadata.googleVerification ? (
      <meta
        name="google-site-verification"
        content={config.siteMetadata.googleVerification}
      />
    ) : null;

  return (
    <html lang="en">
      <head>
        {props.headComponents}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {verification}
      </head>
      <body>
        <div id="___gatsby" dangerouslySetInnerHTML={{ __html: props.body }} />
        {props.postBodyComponents}

        <script
          dangerouslySetInnerHTML={{
            __html: `
                    !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window,document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                 fbq('init', '411039736336236');
                fbq('track', 'PageView');
            `,
          }}
        />
        <script
          type="text/javascript"
          id="cookieinfo"
          src="//cookieinfoscript.com/js/cookieinfo.min.js"
          data-bg="#645862"
          data-fg="#FFFFFF"
          data-link="#F1D600"
          data-cookie="CookieInfoScript"
          data-text-align="left"
          data-moreinfo="https://pl.wikipedia.org/wiki/HTTP_cookie"
          data-message="Cookies umożliwiają łatwe poruszanie się po stronie. Korzystamy z nich. Będąc na www.umawiajonline.pl, zgadzasz się na ciasteczkową politykę. Więcej w Polityce prywatności."
          data-close-text="Rozumiem"
          data-linkmsg="Więcej informacji"
        />

        <noscript>
          <img
            height="1"
            width="1"
            src="https://www.facebook.com/tr?id=411039736336236&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  );
};
