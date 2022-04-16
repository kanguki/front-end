FROM golang:1.16-alpine as builder
WORKDIR /app
COPY . .
RUN go build  -o simpleHttp main.go
CMD ["./simpleHttp"]
FROM alpine
WORKDIR /
COPY --from=builder /app/simpleHttp ./simpleHttp
ENTRYPOINT ["./simpleHttp"]