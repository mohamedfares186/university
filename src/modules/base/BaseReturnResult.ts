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

export interface StandardReturn {
  statusCode: number;
  success: boolean;
  message: string;
}

export interface SingleReturnResult<Model> extends StandardReturn {
  data?: Model;
}

export interface BaseReturnResult<Model> extends StandardReturn {
  data?: Model | Model[];
  pages?: PaginationInfo;
}
