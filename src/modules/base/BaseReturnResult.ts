export interface PageQuery {
  pageNumber: number;
  limit: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BaseReturnResult<Model> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: Model | Model[];
  pages?: PaginationInfo;
}
