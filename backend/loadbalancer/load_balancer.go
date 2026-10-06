package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"sync/atomic"
)

var counter uint64

func main() {
	servers := []string{
		"http://localhost:8081",
		"http://localhost:8082",
	}

	var proxies []*httputil.ReverseProxy

	for _, server := range servers {
		target, err := url.Parse(server)
		if err != nil {
			log.Fatal(err)
		}

		proxies = append(proxies, httputil.NewSingleHostReverseProxy(target))
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		index := atomic.AddUint64(&counter, 1) % uint64(len(proxies))

		log.Printf("Request %s → Backend %d", r.URL.Path, index+1)

		proxies[index].ServeHTTP(w, r)
	})

	log.Println("Load balancer running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}