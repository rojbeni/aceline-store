const SkeletonCartLineItem = () => {
  return (
    <div className="flex gap-4 py-4 border-b border-outline-variant last:border-b-0">
      <div className="w-16 small:w-24 aspect-square shrink-0 rounded-large bg-surface-container-high animate-pulse" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-y-2">
            <div className="w-32 h-4 bg-surface-container-high animate-pulse" />
            <div className="w-24 h-4 bg-surface-container-high animate-pulse" />
          </div>
          <div className="w-12 h-6 bg-surface-container-high animate-pulse" />
        </div>
        <div className="w-24 h-10 bg-surface-container-high animate-pulse" />
      </div>
    </div>
  )
}

export default SkeletonCartLineItem
