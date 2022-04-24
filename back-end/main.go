package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

var port = ":80"
var message = "empty"
var cookie = "kjadhuytiqwwjek328i23uirwyurywierhiweuryuewur"
var defaultCookieTimeoutInHour = 5

func login(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("bad request. method not supported"))
		return
	}
	w.Header().Add("Set-Cookie", cookie+"; path=/; HTTPOnly; expires="+
		time.Now().Add(time.Hour*time.
			Duration(defaultCookieTimeoutInHour)).
			Format(http.TimeFormat))
	w.Write([]byte("login success"))
}
func logout(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("bad request. method not supported"))
		return
	}
	w.Header().Add("Set-Cookie", "empty; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT")
	w.Write([]byte("logout success"))
}
func authorize(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c := r.Header.Get("Cookie")
		if c == "" || !strings.Contains(c, cookie) {
			errMsg := fmt.Sprintln("error unauthorized")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(errMsg))
			return
		}
		handler(w, r)
	}
}
func simpleHandler(w http.ResponseWriter, req *http.Request) {
	switch req.Method {
	case http.MethodGet:
		w.Write([]byte(fmt.Sprintf("%v\n", message)))
	case http.MethodPost, http.MethodPut:
		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("error reading request body" + err.Error()))
		}
		message = string(body)
		w.Write([]byte("ok\n"))
	case http.MethodDelete:
		message = "empty"
		w.Write([]byte("ok\n"))
	default:
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("bad request. method not supported"))
	}
}
func hello(w http.ResponseWriter, req *http.Request) {
	w.Write([]byte("hello\n"))
}

func main() {
	http.HandleFunc("/hello", hello)
	http.HandleFunc("/login", login)
	http.HandleFunc("/logout", logout)
	http.HandleFunc("/", authorize(simpleHandler))
	fmt.Printf("Yayy, u have a http server running on port %v", port)
	http.ListenAndServe(port, nil)
}
