import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = ({
  numberOfProducts = 12,
}: {
  numberOfProducts?: number
}) => {
  return (
    <div className="w-full flex-1">
      <div className="mb-6 h-5 w-24 animate-pulse rounded bg-gray-100" />
      <ul
        className="grid grid-cols-2 small:grid-cols-4 medium:grid-cols-5 large:grid-cols-6 gap-x-5 gap-y-6"
        data-testid="products-list-loader"
      >
        {repeat(numberOfProducts).map((index) => (
          <li key={index}>
            <SkeletonProductPreview />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SkeletonProductGrid
