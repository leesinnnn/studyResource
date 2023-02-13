/*
{
  a: 1,
  b: 2
}
?a=1&b=2
*/
export function myAxios ({ url, method = 'GET', data = {}, params = {} }) {
  return new Promise((resolve, reject) => {
    method = method.toUpperCase();
    const request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = () => {
      if (request.readyState !== 4) return;
      if (request.status >= 200 && request.status < 300) {
        const response = {};
        response.data = request.response;
        response.status = request.status;
        response.statusText = request.statusText;
        resolve(response);
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('发生了错误，状态码为' + request.status);
      }
    };
    if (Object.keys(params).length > 0) {
      let paramsStr = '';
      Object.keys(params).forEach(key => {
        paramsStr += `&${key}=${params[key]}`;
        paramsStr = paramsStr.slice(1);
      });
      url += '?' + paramsStr;
    }
    request.open(method, url, true);
    if (method === 'POST' || method === 'PUT') {
      request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
      request.send(JSON.stringify(data));
    } else {
      request.send();
    }
  });
}
