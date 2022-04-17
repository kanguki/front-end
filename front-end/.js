const defaultHost = env.defaultEndpoint;
const container = "container",
  request = "request",
  response = "response",
  submit = "submit",
  uri = "uri",
  requestBody = "requestBody",
  header = "header",
  method = "method",
  short = "short",
  methodColorSuffix = "-color";
const methods = { GET: "GET", POST: "POST", PUT: "PUT", DELETE: "DELETE" };
const methodColor = new RegExp(
  `(${Object.values(methods).join("|")}).*${methodColorSuffix}`
);
const headers = {
  authorization: "authorization",
  cookie: "cookie",
  custom: "custom",
};
let containers = document.getElementById("containers");


addContainer(methods.GET, "/hello")
addContainer(methods.POST, "/login")
addContainer(methods.GET, "/")
addContainer(methods.POST, "/logout")

function addContainer(_method = methods.GET, _uri) {
  //container
  let containerNode = document.createElement("div");
  containerNode.setAttribute("class", container);
  //request
  let requestNode = document.createElement("div");
  requestNode.setAttribute("class", request);

  //method
  let methodNode = document.createElement("select");
  methodNode.setAttribute("name", method);
  //method options
  for (m of Object.keys(methods)) {
    let option = document.createElement("option");
    option.value = m;
    option.text = m;
    if (_method == m) {
      option.selected = true
    }
    methodNode.appendChild(option);
  }
  //method colorize
  requestNode.classList.add(methods[methodNode.value] + methodColorSuffix);
  methodNode.addEventListener("change", function () {
    requestNode.className = requestNode.className.replace(
      methodColor,
      methods[this.value] + methodColorSuffix
    );
  });
  requestNode.appendChild(methodNode);
  //uri
  let uriNode = document.createElement("input");
  uriNode.setAttribute("class", uri);
  uriNode.setAttribute("type", "url");
  uriNode.setAttribute("placeholder", "whole url. always start with /");
  if (_uri) {
    uriNode.value = _uri
  }
  requestNode.appendChild(uriNode);
  //headers
  let headersNode = document.createElement("div");
  headersNode.setAttribute("class", header);
  //real headers go here
  let headersVals = document.createElement("div");
  headersVals.setAttribute("class", "headersVals");
  //popular header options
  let headersOpts = document.createElement("div");
  headersOpts.setAttribute("class", "headersOpts");
  headersOpts.innerText = "Headers";
  //action when choosing header options
  for (h of Object.keys(headers)) {
    let hd = document.createElement("button");
    hd.innerText = h;
    hd.addEventListener("click", function () {
      //avoid duplicate headers
      for (pairHd of headersVals.childNodes) {
        v = pairHd.firstChild;
        if (v.name == hd.innerText) {
          temporarilyHighlight(v);
          return;
        }
      }
      //a header pair includes header and clear button
      let hdPair = document.createElement("div");
      hdPair.setAttribute("class", "headerPair");
      //clear button
      let hdClear = document.createElement("button");
      hdClear.innerText = "clear";
      hdClear.addEventListener("click", function () {
        this.parentNode.parentNode.removeChild(this.parentNode);
      });
      //real header values
      let newHeader = document.createElement("input");
      newHeader.setAttribute("type", "text");
      newHeader.setAttribute("class", "stretch");
      if (hd.innerText != headers.custom) {
        newHeader.setAttribute("name", hd.innerText);
        newHeader.setAttribute("placeholder", hd.innerText);
      } else {
        newHeader.setAttribute(
          "placeholder",
          "custom header. format: <name>: <value>"
        );
      }
      hdPair.appendChild(newHeader); //order here matters. as I loop and get firstChild at some point
      hdPair.appendChild(hdClear);
      headersVals.appendChild(hdPair);
    });
    headersOpts.appendChild(hd);
  }
  headersNode.appendChild(headersOpts);
  headersNode.appendChild(headersVals);
  requestNode.appendChild(headersNode);
  //body
  let requestBodyNode = document.createElement("textarea");
  requestBodyNode.setAttribute("class", requestBody);
  requestBodyNode.setAttribute(
    "placeholder",
    "complete request body goes here. in json/ string..."
  );
  requestNode.appendChild(requestBodyNode);

  //submit
  let submitNode = document.createElement("button");
  submitNode.setAttribute("class", submit);
  submitNode.classList.add(short);
  submitNode.innerText = "submit";
  submitNode.addEventListener("click", function () {
    let methodV = methodNode.value;
    let uriV = uriNode.value;
    let headers = {};
    for (pairHd of headersVals.childNodes) {
      v = pairHd.firstChild;
      if (v.name != undefined && v.name != "") {
        headers[v.name] = v.value;
      } else {
        let headerPair = v.value.split(":");
        if (headerPair.length != 2) {
          temporarilyHighlight(v, 1000);
          continue;
        } else {
          headers[headerPair[0]] = headerPair[1];
        }
      }
    }
    let requestBodyV = requestBodyNode.value;
    callHttpRequest(methodV, uriV, headers, requestBodyV).then(
      (response) => {
        responseNode.innerHTML = response.data;
      },
      (e) => {
        responseNode.innerHTML = `error: ${e}`;
      }
    );
  });

  //response
  let responseNode = document.createElement("textarea");
  responseNode.setAttribute("class", response);
  responseNode.setAttribute("placeholder", "response goes here");

  //container clear button
  let containerClear = document.createElement("button");
  containerClear.setAttribute("class", short);
  containerClear.innerText = "-";
  containerClear.addEventListener("click", function () {
    this.parentNode.parentNode.removeChild(this.parentNode);
  });
  containerNode.appendChild(containerClear);
  containerNode.appendChild(requestNode);
  containerNode.appendChild(submitNode);
  containerNode.appendChild(responseNode);
  containers.appendChild(containerNode);
}

function temporarilyHighlight(htmlNode, timeInMs = 200) {
  let highlight = "highlight-input";
  htmlNode.classList.toggle(highlight);
  setTimeout(function () {
    htmlNode.classList.toggle(highlight);
  }, timeInMs);
}

/***
 * @returns {string}
 * @param {string} method
 * @param {string} uri
 * @param {Object<string, string>} headers
 * @param {string} requestBody
 **/
function callHttpRequest(method, uri, headers, requestBody) {
  const url = defaultHost + uri;
  console.log(`${method} ${url} ${requestBody} ${JSON.stringify(headers)}`);
  let response;
  switch (method) {
    case methods.GET:
      response = axios.get(url, { headers });
      break;
    case methods.POST:
      response = axios.post(url, requestBody, { headers });
      break;
    case methods.PUT:
      response = axios.put(url, requestBody, { headers });
      break;
    case methods.DELETE:
      response = axios.delete(url, requestBody, { headers });
      break;
    default:
      response = Promise.resolve("invalid method");
      break;
  }
  return response;
}
