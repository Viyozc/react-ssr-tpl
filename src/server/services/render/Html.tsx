import React, { useMemo } from 'react'

export interface Props {
  title?: string
  scripts?: string[];
  styles?: string[];
}

function geneScriptTag(scripts: string[]) {
  return scripts.filter(Boolean).map((src) => {
    return <script key={src} src={src} crossOrigin="anonymous" />
  })
}

const buildInfo = {
  'version': process.env.BUILD_VERSION,
}

export default function Html(props: React.PropsWithChildren<Props>) {
  const {
    title = 'React SSR',
    scripts = [],
    styles = [],
  } = props

  const jsElements = useMemo(() => {
    return geneScriptTag(scripts)
  }, [scripts])

  const favico = ''

  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: 'performance.mark("begin csr")',
          }}
        ></script>
        <meta charSet="utf-8" />
        {Object.entries(buildInfo).map(([key, value]) => (
          <meta key={key} name={key} content={value} />
        ))}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="renderer" content="webkit" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
        <link rel="shortcut icon" type="image/png" href={favico} />
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {styles
          .filter(Boolean)
          .map((href) => (
              <link key={href} rel="stylesheet" href={href} />
            )
          )}
        {jsElements}
        {/* {preloads.map(({ as = 'script', href }) => (
          <link
            key={href}
            rel="preload"
            as={as}
            href={href}
            crossOrigin="anonymous"
          />
        ))} */}
      </head>
      <body>
        <div
          id="root"
          // for tailwind namespace
          className="ac"
        >
          {props.children}
        </div>
      </body>
    </html>
  )
}