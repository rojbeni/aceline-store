type JsonLdProps = {
  data: object | object[]
}

/** Renders schema.org structured data. `<` is escaped so data can't close the script tag. */
const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
)

export default JsonLd
