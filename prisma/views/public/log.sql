SELECT
  request_id,
  ip_address,
  base_url,
  method,
  COALESCE((headers ->> 'x-reference' :: text), '' :: text) AS noref,
  body_request,
  date_request,
  STATUS,
  body_respon,
  date_respon,
  COALESCE((headers ->> 'username' :: text), '' :: text) AS username
FROM
  log_request;