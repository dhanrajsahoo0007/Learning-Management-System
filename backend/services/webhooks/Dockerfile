FROM golang:1.25.5-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY services/webhooks/go.mod services/webhooks/go.sum ./
COPY services/shared/go.mod services/shared/go.sum ./shared/

# Download dependencies
RUN go mod download

# Copy source code
COPY services/webhooks/ ./
COPY services/shared/ ./shared/

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o webhooks-service .

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/webhooks-service .

# Expose port
EXPOSE 8087

# Run the service
CMD ["./webhooks-service"]
