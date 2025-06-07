import {
	PaginationOptions,
	PrismaPaginationOptions,
	SortOptions,
	ZodType,
} from '@/shared/types'
import {
	PageableSchema,
	SearchArraySchema,
	SearchDateRangeSchema,
	SearchDateTimeRangeSchema,
	SearchTextSchema,
} from '@/shared/schemas'

/**
 * 기본 where 조건과 필터 조건을 합치는 함수
 */
export function buildWhereCondition(
	baseWhere: Record<string, unknown>,
	filter?: Record<string, unknown>,
): Record<string, unknown> {
	if (!filter) {
		return baseWhere
	}

	const advancedWhere = { ...baseWhere }

	Object.entries(filter).forEach(([key, value]) => {
		const searchText = SearchTextSchema.safeParse([key, value])
		if (searchText.success) {
			const [searchKey, searchValue] = searchText.data
			advancedWhere[searchKey] = { contains: searchValue, mode: 'insensitive' }
			return advancedWhere
		}

		const searchDateRange = SearchDateRangeSchema.safeParse([key, value])
		if (searchDateRange.success) {
			const [dateKey, dateValue] = searchDateRange.data
			advancedWhere[dateKey] = { between: [dateValue.from, dateValue.to] }
			return advancedWhere
		}

		const searchDateTimeRange = SearchDateTimeRangeSchema.safeParse([
			key,
			value,
		])
		if (searchDateTimeRange.success) {
			const [dateTimeKey, dateTimeValue] = searchDateTimeRange.data
			advancedWhere[dateTimeKey] = {
				between: [dateTimeValue.from, dateTimeValue.to],
			}
			return advancedWhere
		}

		const arraySearch = SearchArraySchema.safeParse([key, value])
		if (arraySearch.success) {
			const [arrayKey, arrayValue] = arraySearch.data
			advancedWhere[arrayKey] = { in: arrayValue }
			return advancedWhere
		}

		advancedWhere[key] = value
	})

	return advancedWhere
}

/**
 * sort 객체를 Prisma orderBy 형태로 변환하는 함수
 */
export function buildOrderBy<T extends Record<string, unknown>>(
	sort?: SortOptions,
): T | T[] {
	if (!sort || Object.keys(sort).length === 0) {
		return {} as T
	}

	const orderByArray = Object.entries(sort).map(([field, direction]) => ({
		[field]: direction,
	})) as T[]

	return orderByArray.length === 1 ? orderByArray[0] : orderByArray
}

/**
 * offset, limit을 Prisma skip, take로 변환하는 함수
 */
export function buildPaginationOptions(
	pagination?: PaginationOptions,
): PrismaPaginationOptions {
	const result: PrismaPaginationOptions = {}

	if (pagination?.offset !== undefined) {
		result.skip = pagination.offset
	}

	if (pagination?.limit !== undefined) {
		result.take = pagination.limit
	}

	return result
}

/**
 * 전체 리스트 쿼리 옵션을 빌드하는 통합 함수
 */
export function buildListQueryOptions<
	TWhereInput extends Record<string, unknown>,
	TOrderByInput extends Record<string, unknown>,
>({
	baseWhere,
	filter,
	sort,
	pagination,
}: {
	baseWhere: TWhereInput
	filter?: Record<string, unknown>
	sort?: SortOptions
	defaultOrderBy?: TOrderByInput
	pagination?: PaginationOptions
}) {
	return {
		where: buildWhereCondition(baseWhere, filter),
		orderBy: buildOrderBy(sort),
		...buildPaginationOptions(pagination),
	}
}

/**
 * 제네릭 도메인별 쿼리 빌더 팩토리
 */
export function createDomainQueryBuilder<
	TFilter extends Record<string, unknown>,
>(
	input?: {
		filter?: TFilter
		pageable?: ZodType<typeof PageableSchema>
	},
	config: { paranoid?: boolean } = { paranoid: false },
) {
	const baseWhere = config.paranoid ? {} : { deletedAt: null }
	return buildListQueryOptions({
		baseWhere,
		filter: input?.filter,
		sort: input?.pageable?.sort,
		pagination: {
			offset: input?.pageable?.offset,
			limit: input?.pageable?.limit,
		},
	})
}
