type PageHeaderProps = {
  title: string
  intro: string
}

export default function PageHeader({ title, intro }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-y-3">
      <h1
        className="text-2xl-semi text-surface-on"
        data-testid="support-page-title"
      >
        {title}
      </h1>
      <p className="text-base-regular text-surface-on-variant">{intro}</p>
    </header>
  )
}
