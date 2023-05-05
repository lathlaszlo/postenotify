export interface Box {
  address: string,
  user: string,
  home: string,
  name: string,
  disable: boolean,
  domain_admin: boolean,
  super_admin: boolean,
  strict_from_disabled: boolean,
  reference_id: string,
  created: string,
  updated: string,
  redirect_only: boolean,
  redirect_to: [ string ],
  discard: boolean
}

export interface BoxRequest {
  page: number,
  paging: number,
  last_page: number,
  results_count: number,
  results: Box[]
}

export interface BoxStats {
  [key: string]: {
    in: number,
    out: number
  }
}