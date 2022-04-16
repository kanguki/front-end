package main

import (
	"fmt"
	"net/http"
)

var port = ":80"
var message = "hello"

func get(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, message+"\n")
}

func main() {
	http.HandleFunc("/", get)
	fmt.Printf("Yayy, u have a http server running on port %v", port)
	http.ListenAndServe(port, nil)
}
