# Build stage
FROM golang:1.25.5-alpine AS builder

WORKDIR /app

# Copy shared module
COPY services/shared /app/services/shared

# Copy webhooks service
COPY services/webhooks /app/services/webhooks

# Build the webhooks service
WORKDIR /app/services/webhooks
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/services/webhooks/main .

# Expose port
EXPOSE 8087

# Run the service
CMD ["./main"]
