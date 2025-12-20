export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PageQuery {
  pageNumber: number;
  limit: number;
}
