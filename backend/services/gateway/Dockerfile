# Build stage
FROM golang:1.25.5-alpine AS builder

WORKDIR /app

# Copy shared module
COPY services/shared /app/services/shared

# Copy gateway service
COPY services/gateway /app/services/gateway

# Build the gateway service
WORKDIR /app/services/gateway
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/services/gateway/main .

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./main"]
